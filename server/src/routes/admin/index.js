import express from "express";
import fs from "fs";
import path from "path";

import { db } from "../../services/mongo.js";
import { checkQuery } from "./utils.js";
import uploadVersionRoute from "./upload/upload-version.js";

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
  console.log(directory);

  fs.readdir(directory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to scan files directory" });
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      console.log("filePath", filePath);

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

export default router;
