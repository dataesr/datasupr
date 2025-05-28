import { Router } from "express";
import { db } from "../../../../../services/mongo.js";

const router = Router();

router.get("/faculty-members/filters/years", async (req, res) => {
  try {
    const collection = db.collection(
      "test-PERSONNEL-ENSEIGNANT-effectifs-personnel-enseignant-etablissement"
    );

    const academicYears = await collection.distinct("annee_universitaire");

    const sortedYears = academicYears.filter(Boolean).sort((a, b) => {
      const yearA = parseInt(a.split("-")[0]);
      const yearB = parseInt(b.split("-")[0]);
      return yearB - yearA;
    });

    res.json({
      academic_years: sortedYears,
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    res.status(500).json({
      error: "Server error while fetching filters",
    });
  }
});

export default router;
