import express from "express";
import multer from "multer";

import fs from "fs";
import path from "path";
import { db } from "../../../services/mongo.js";

const router = new express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // return cb(null, "./src/routes/admin/upload/files");
    return cb(null, "../files");
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post(
  "/admin/upload-version",
  upload.single("file"),
  async (req, res) => {
    if (!req.file || req.file.mimetype !== "application/json") {
      return res.status(400).send("Only JSON files are allowed.");
    }

    const { dashboardId, collectionId } = req.body;

    if (dashboardId && collectionId) {
      const filePath = path.join("../files", req.file.filename);

      const fileContent = fs.readFileSync(filePath, "utf8");
      const jsonData = JSON.parse(fileContent);

      const timestamp = Date.now();
      const collectionName = `${collectionId}_${timestamp}`;

      const resultInsert = await db
        .collection(collectionName)
        .insertMany(jsonData);

      if (resultInsert.insertedCount > 0) {
        const response = await db.collection("boards").updateOne(
          { id: dashboardId, "data.id": collectionId },
          {
            $push: {
              "data.$.versions": {
                id: collectionName,
                createdAt: timestamp,
              },
            },
          }
        );
        if (response.modifiedCount > 0) {
          res
            .status(200)
            .send("Data uploaded and version updated successfully.");
        } else {
          res.status(500).send("Failed to update version information.");
        }
      } else {
        res.status(500).send("Failed to upload data.");
      }
    }
  }
);

export default router;
