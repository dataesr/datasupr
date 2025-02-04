import express from "express";
import fs from "fs";
import path from "path";

import { db } from "../../services/mongo.js";
import { checkQuery } from "./utils.js";
import uploadVersionRoute from "./upload/upload-version.js";
import { create } from "domain";

const router = new express.Router();

router.use(uploadVersionRoute);

// list all dashboards from server
router.route("/admin/list-dashboards").get(async (req, res) => {
  const response = await db.collection("boards").find({}).toArray();
  res.json(response);
});

// list all indexes from a collection
router.route("/admin/list-indexes").get(async (req, res) => {
  const collectionId = req.query.collectionId;
  if (!collectionId) {
    return res.status(400).json({ error: "Collection ID is required" });
  }

  try {
    const indexes = await db.collection(collectionId).indexes();
    res.json(indexes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to list indexes", details: error.message });
  }
});

// change current data
router.route("/admin/set-current-version").post(async (req, res) => {
  const filters = checkQuery(
    req.body,
    ["dashboardId", "dataId", "versionId"],
    res
  );

  const { dashboardId, dataId, versionId } = filters;

  const response = await db
    .collection("boards")
    .updateOne(
      { id: dashboardId, "data.id": dataId },
      { $set: { "data.$.current": versionId } }
    );

  if (response.matchedCount === 0) {
    res.status(404).json({ error: "No document found" });
  }

  // return current data
  const ret = await db.collection("boards").findOne({ id: dashboardId });

  res.json(ret);
});

// update constant
router.route("/admin/update-constant").post(async (req, res) => {
  const filters = checkQuery(req.body, ["dashboardId", "key", "value"], res);
  const { dashboardId, key, value } = filters;

  const response = await db
    .collection("boards")
    .updateOne(
      { id: dashboardId },
      { $set: { "constants.$[elem].value": value } },
      {
        arrayFilters: [{ "elem.key": key }]
      }
    );

  if (response.matchedCount === 0) {
    return res.status(404).json({ error: "No document found" });
  }

  // return current data
  const ret = await db.collection("boards").findOne({ id: dashboardId });
  res.json(ret);
});

// list all uploaded files in files folder
router.route("/admin/list-uploaded-files").get((req, res) => {
  fs.readdir("../files", (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to scan files directory" });
    }

    const fileDetails = files.map((file) => {
      const filePath = path.join("../files", file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: (stats.size / (1024 * 1024)).toFixed(2), // size in MB
      };
    });

    res.json(fileDetails);
  });
});

// delete a version
router.route("/admin/delete-version").delete(async (req, res) => {
  const filters = checkQuery(
    req.body,
    ["dashboardId", "collectionId", "versionId"],
    res
  );
  const { dashboardId, collectionId, versionId } = filters;

  // Check if the version to be deleted is the current version
  const board = await db
    .collection("boards")
    .findOne(
      { id: dashboardId, "data.id": collectionId },
      { projection: { "data.$": 1 } }
    );

  if (!board) {
    return res.status(404).json({ error: "No document found" });
  }

  const data = board.data[0];
  if (data.current === versionId) {
    return res.status(400).json({ error: "Cannot delete the current version" });
  }

  const response = await db.collection("boards").updateOne(
    { id: dashboardId, "data.id": collectionId },
    {
      $pull: {
        "data.$.versions": { id: versionId },
      },
    }
  );

  if (response.modifiedCount === 0) {
    res.status(404).json({ error: "No document found" });
  }

  // delete the collection
  await db.collection(versionId).drop();

  // return current data
  const ret = await db.collection("boards").findOne({ id: dashboardId });

  res.json(ret);
});

// delete all files in files folder
router.route("/admin/delete-uploaded-files").delete((req, res) => {
  const directory = "../files";

  fs.readdir(directory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to scan files directory" });
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);

      fs.unlink(filePath, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: `Unable to delete file: ${file}` });
        }
      });
    });

    res.json({ message: "All files deleted successfully" });
  });
});

// Update a collection from another collection with script execution
router.route('/admin/update-version-from-dependent-collection').post(async (req, res) => {
  const filters = checkQuery(req.body, ["dashboardId", "collectionId"], res);
  const { dashboardId, collectionId } = filters;

  const board = await db.collection("boards").findOne({ id: dashboardId });
  if (!board) {
    return res.status(404).json({ error: "No document found" });
  }
  
  const dependsOf = board.data.find((d) => d.id === collectionId).dependsOf;
  if (!dependsOf) {
    return res.status(400).json({ error: "No dependency found" });
  }

  // get the current version of the dependent collection - ex:atlas2024
  const dependentCollectionId = board.data.find((d) => d.id === dependsOf).current;
  
  
async function run({dependentCollectionId}) {
  try {
    const atlasCollection = db.collection(dependentCollectionId);
    const newCollectionId = 'similar-elements_' + Date.now();
    const similarElementsCollection = db.collection(newCollectionId);

    // await similarElementsCollection.deleteMany({});

    const years = await atlasCollection.distinct("annee_universitaire");
    const geoIds = await atlasCollection.distinct("geo_id");

    // for (let i = 0; i < years.length; i++) {
    for (let i = years.length-1; i < years.length; i++) { // TODO: remove this line
      for (let j = 0; j < geoIds.length; j++) {
        const query = { geo_id: geoIds[j], annee_universitaire: years[i], regroupement: 'TOTAL' };
        const data = await atlasCollection.find(query).toArray();

        const effectifPR = data.filter((item) => item.secteur === 'PR').reduce((acc, item) => acc + item.effectif, 0);
        const effectifPU = data.filter((item) => item.secteur === 'PU').reduce((acc, item) => acc + item.effectif, 0);
        const pctPR = effectifPR / (effectifPR + effectifPU) * 100;
        const pctPU = effectifPU / (effectifPR + effectifPU) * 100;

        const effectifF = data.filter((item) => item.sexe === '2').reduce((acc, item) => acc + item.effectif, 0);
        const effectifM = data.filter((item) => item.sexe === '1').reduce((acc, item) => acc + item.effectif, 0);
        const pctF = effectifF / (effectifF + effectifM) * 100;
        const pctM = effectifM / (effectifF + effectifM) * 100;

        const similarElement = {
          geo_id: geoIds[j],
          annee_universitaire: years[i],
          niveau_geo: data[0]?.niveau_geo,
          geo_nom: data[0]?.geo_nom,
          effectifPR: effectifPR,
          effectifPU: effectifPU,
          pctPR: pctPR,
          pctPU: pctPU,
          effectifF: effectifF,
          effectifM: effectifM,
          pctF: pctF,
          pctM: pctM,
        };

        const result = await similarElementsCollection.insertOne(similarElement);

        // insert dans la collection board de la nouvelle version
        const response = await db.collection("boards").updateOne(
          { id: dashboardId, "data.id": collectionId },
          {
            $push: {
              "data.$.versions": {
                id: newCollectionId,
                createdAt: new Date().toISOString().split('T')[0], // yyyy-mm-dd
                from: dependentCollectionId,
              }
            }
          }
        );
      };
    };
  } finally {
    await db.close();
    res.status(200).json({ message: "Update done" });
  }
}
  
await run({dependentCollectionId}).catch(console.dir);

  console.log('------------------------- fin ----------------------');
  
});

// get constants from a dashboard
router.route("/admin/get-constants").get(async (req, res) => {
  const dashboardId = req.query.dashboardId;
  if (!dashboardId) {
    return res.status(400).json({ error: "Dashboard ID is required" });
  }

  const board = await db.collection("boards").findOne({ id: dashboardId });
  if (!board) {
    return res.status(404).json({ error: "No document found" });
  }

  res.json(board.constants);
});

export default router;
