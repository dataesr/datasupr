import express from "express";
import fs from "fs";

const router = new express.Router();

// list all dashboards from the server folder
router.route("/admin/list-dashboards").get((req, res) => {
  const directoryPath = "./src/routes/tableaux";
  const folderList = fs.readdirSync(directoryPath);
  const list = folderList.map((folderName) => {
    const configFilePath = `${directoryPath}/${folderName}/config.json`;
    const config = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
    return {
      [folderName]: config,
    };
  });
  res.json(list);
});

// get last collection name for a dashboard collection
router.route("/admin/get-last-collection-name").get((req, res) => {
  if (!req.query.dashboardName) {
    res
      .status(400)
      .json({ error: "dashboardName query parameter is required" });
  }
  const dashboardName = req.query.dashboardName;
  if (!fs.existsSync(`./src/routes/tableaux/${dashboardName}`)) {
    res.status(400).json({ error: "dashboardName does not exist" });
  }
  if (!req.query.collectionKey) {
    res
      .status(400)
      .json({ error: "collectionKey query parameter is required" });
  }
  const collectionKey = req.query.collectionKey;

  const config = JSON.parse(
    fs.readFileSync(
      `./src/routes/tableaux/${dashboardName}/config.json`,
      "utf8"
    )
  );

  // TODO: fix - it doesn't sort
  // sort collections by uploadDatetime to return only the last collection name
  const collectionName = config.data[collectionKey].collections.sort((a, b) => {
    new Date(a.uploadDatetime) - new Date(b.uploadDatetime);
  })[0].name;

  res.json(collectionName);
});

// add new data file to a dashboard collection
router.route("/admin/add-dashboard-file").post((req, res) => {
  res.json([]);
});

router.route("/admin/list-dashboard-files").get((req, res) => {
  res.json([]);
});

// modify dashboard constant
router.route("/admin/modify-dashboard-constant").post((req, res) => {
  if (!req.query.dashboardName) {
    res
      .status(400)
      .json({ error: "dashboardName query parameter is required" });
  }
});

export default router;
