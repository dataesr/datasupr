import express from "express";
import { db } from "../../../../services/mongo.js";

const router = new express.Router();

const getCurrentCollectionName = async (idCollection) => {
  const data = await db.collection("boards").find({ id: "european-projects" }).toArray();
  const currentCollection = data[0].data.find(
    (item) => item.id === idCollection
  ).current;

  if (currentCollection) {
    return currentCollection;
  }
};

router.route("/european-projects/filters-countries").get(async (req, res) => {
  const currentCollectionName = await getCurrentCollectionName("fr-esr-horizon-projects-entities");

  try {
    const data = await db.collection(currentCollectionName).aggregate([
      {
        $match: {
          country_code: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$country_code",
          label_fr: { $first: "$country_name_fr" },
          label_en: { $first: "$country_name_en" },
          id: { $first: "$country_code" }
        }
      },
      {
        $project: {
          _id: 0,
          label_fr: 1,
          label_en: 1,
          id: 1
        }
      },
      {
        $sort: { label_fr: 1 }
      }
    ], {
      collation: { locale: "fr", strength: 1 }
    }).toArray();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/european-projects/filters-programs").get(async (req, res) => {
  const currentCollectionName = await getCurrentCollectionName("fr-esr-horizon-projects-entities");

  try {
    const data = await db.collection(currentCollectionName).aggregate([
      {
        $match: {
          programme_code: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$programme_code",
          label_fr: { $first: "$programme_name_fr" },
          label_en: { $first: "$programme_name_en" },
          id: { $first: "$programme_code" }
        }
      },
      {
        $project: {
          _id: 0,
          label_fr: 1,
          label_en: 1,
          id: 1
        }
      },
      {
        $sort: { 
          label_fr: 1
        }
      }
    ], {
      collation: { locale: "fr", strength: 1 }
    }).toArray();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/european-projects/filters-thematics").get(async (req, res) => {
  const currentCollectionName = await getCurrentCollectionName("fr-esr-horizon-projects-entities");

  try {
    const matchStage = {
      thema_code: { $ne: null }
    };
    
    if (req.query.programId === "all") {
      delete req.query.programId;
    }

    // Ajout du filtre sur programme_code si programId est présent
    if (req.query.programId) {
      matchStage.programme_code = req.query.programId;
    }


    const data = await db.collection(currentCollectionName).aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: "$thema_code",
          label_fr: { $first: "$thema_name_fr" },
          label_en: { $first: "$thema_name_en" },
          id: { $first: "$thema_code" }
        }
      },
      {
        $project: {
          _id: 0,
          label_fr: 1,
          label_en: 1,
          id: 1
        }
      },
      {
        $sort: { 
          label_fr: 1
        }
      }
    ], {
      collation: { locale: "fr", strength: 1 }
    }).toArray();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/european-projects/filters-pillars").get(async (req, res) => {
  const currentCollectionName = await getCurrentCollectionName("fr-esr-horizon-projects-entities");

  try {
    const data = await db.collection(currentCollectionName).aggregate([
      {
        $match: {
          pilier_code: { $ne: null },
          framework: "Horizon Europe"
        }
      },
      {
        $group: {
          _id: "$pilier_code",
          label_fr: { $first: "$pilier_name_fr" },
          label_en: { $first: "$pilier_name_en" },
          id: { $first: "$pilier_code" }
        }
      },
      {
        $project: {
          _id: 0,
          label_fr: 1,
          label_en: 1,
          id: 1
        }
      },
      {
        $sort: { 
          label_fr: 1
        }
      }
    ], {
      collation: { locale: "fr", strength: 1 }
    }).toArray();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/european-projects/all-programs").get(async (req, res) => {
  const currentCollectionName = await getCurrentCollectionName("fr-esr-horizon-projects-entities");

  try {
    const data = await db.collection(currentCollectionName).aggregate([
      {
      $match: {
        programme_code: { $ne: null }
      }
      },
      {
      $group: {
        _id: "$programme_code",
        label_fr: { $first: "$programme_name_fr" },
        label_en: { $first: "$programme_name_en" },
        id: { $first: "$programme_code" }
      }
      },
      {
      $project: {
        _id: 0,
        label_fr: 1,
        label_en: 1,
        id: 1
      }
      },
      {
      $sort: { 
        label_fr: 1
      }
      }
    ], {
      collation: { locale: "fr", strength: 1 }
    }).toArray();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/european-projects/all-thematics").get(async (req, res) => {
  const currentCollectionName = await getCurrentCollectionName("fr-esr-horizon-projects-entities");

  try {
    const data = await db.collection(currentCollectionName).aggregate([
      {
      $match: {
        thema_code: { $ne: null }
      }
      },
      {
      $group: {
        _id: "$thema_code",
        label_fr: { $first: "$thema_name_fr" },
        label_en: { $first: "$thema_name_en" },
        id: { $first: "$thema_code" }
      }
      },
      {
      $project: {
        _id: 0,
        label_fr: 1,
        label_en: 1,
        id: 1
      }
      },
      {
      $sort: { 
        label_fr: 1
      }
      }
    ], {
      collation: { locale: "fr", strength: 1 }
    }).toArray();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/european-projects/all-destinations").get(async (req, res) => {
  const currentCollectionName = await getCurrentCollectionName("fr-esr-horizon-projects-entities");

  try {
    const data = await db.collection(currentCollectionName).aggregate([
      {
      $match: {
        destination_code: { $ne: null },
        destination_name_en: { $ne: null }
      }
      },
      {
      $group: {
        _id: "$destination_code",
        label_fr: { $first: "$destination_name_en" },
        label_en: { $first: "$destination_name_en" },
        id: { $first: "$destination_code" }
      }
      },
      {
      $project: {
        _id: 0,
        label_fr: 1,
        label_en: 1,
        id: 1
      }
      },
      {
      $sort: { 
        label_fr: 1
      }
      }
    ], {
      collation: { locale: "fr", strength: 1 }
    }).toArray();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
);

router.route("/european-projects/programs-from-pillars").get(async (req, res) => {
  const currentCollectionName = await getCurrentCollectionName("fr-esr-horizon-projects-entities");

  try {
    const data = await db.collection(currentCollectionName).aggregate([
      {
        $match: {
          pilier_code: { $in: req.query.pillars.split("|") },
          framework: "Horizon Europe"
        }
      },
      {
        $group: {
          _id: "$programme_code",
          label_fr: { $first: "$programme_name_fr" },
          label_en: { $first: "$programme_name_en" },
          id: { $first: "$programme_code" }
        }
      },
      {
        $project: {
          _id: 0,
          label_fr: 1,
          label_en: 1,
          id: 1
        }
      },
      {
        $sort: { 
          label_fr: 1
        }
      }
    ], {
      collation: { locale: "fr", strength: 1 }
    }).toArray();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/european-projects/thematics-from-programs").get(async (req, res) => { 
  const currentCollectionName = await getCurrentCollectionName("fr-esr-horizon-projects-entities");

  try {
    const data = await db.collection(currentCollectionName).aggregate([
      {
        $match: {
          programme_code: { $in: req.query.programs.split("|") },
          thema_code: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$thema_code",
          label_fr: { $first: "$thema_name_fr" },
          label_en: { $first: "$thema_name_en" },
          id: { $first: "$thema_code" }
        }
      },
      {
        $project: {
          _id: 0,
          label_fr: 1,
          label_en: 1,
          id: 1
        }
      },
      {
        $sort: { 
          label_fr: 1
        }
      }
    ], {
      collation: { locale: "fr", strength: 1 }
    }).toArray();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
);

router.route("/european-projects/destinations-from-thematics").get(async (req, res) => { 
  const currentCollectionName = await getCurrentCollectionName("fr-esr-horizon-projects-entities");

  try {
    const data = await db.collection(currentCollectionName).aggregate([
      {
        $match: {
          thema_code: { $in: req.query.thematics.split("|") },
          destination_code: { $ne: null },
          destination_name_en: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$destination_code",
          label_fr: { $first: "$destination_name_en" },
          label_en: { $first: "$destination_name_en" },
          id: { $first: "$destination_code" }
        }
      },
      {
        $project: {
          _id: 0,
          label_fr: 1,
          label_en: 1,
          id: 1
        }
      },
      {
        $sort: { 
          label_fr: 1
        }
      }
    ], {
      collation: { locale: "fr", strength: 1 }
    }).toArray();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
);

router.route("/european-projects/get-countries-with-data").get(async (req, res) => {
  const currentCollectionName = await getCurrentCollectionName("fr-esr-horizon-projects-entities");
  const defaultSort = { label_fr: 1 };

  try {
    const data = await db.collection(currentCollectionName).aggregate([
      {
        $match: {
          country_code: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$country_code",
          label_fr: { $first: "$country_name_fr" },
          label_en: { $first: "$country_name_en" },
          id: { $first: "$country_code" }
        }
      },
      {
        $project: {
          _id: 0,
          label_fr: 1,
          label_en: 1,
          id: 1
        }
      },
      {
        $sort: defaultSort
      }
    ], {
      collation: { locale: "fr", strength: 1 }
    }).toArray();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
);

export default router;