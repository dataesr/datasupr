export function checkQuery(query, mandatories = [], res) {
  const filters = {};
  mandatories.forEach((mandatory) => {
    if (!query[mandatory]) {
      res.status(400).send(`${mandatory} is required`);
      return;
    }
    filters[mandatory] = query[mandatory];
  });

  if (filters.country_code) {
    filters.country_code = filters.country_code.toUpperCase();
  }

  // specific case for extra_joint_organization format
  if (filters.extra_joint_organization === "null") {
    filters.extra_joint_organization = null;
  }
  return filters;
}

// Fonction utilitaire pour gérer les index
export async function recreateIndex(collection, indexSpec, indexName) {
  try {
    // Vérifier si des index existent avec les mêmes spécifications
    const existingIndexes = await collection.listIndexes().toArray();

    // Vérifier l'existence d'index similaires
    for (const index of existingIndexes) {
      // Comparer les spécifications de l'index
      const isSpecMatch = Object.entries(indexSpec).every(
        ([key, value]) => index.key[key] === value
      );

      if (isSpecMatch) {
        // Si l'index existe avec un nom différent, le supprimer
        await collection.dropIndex(index.name);
        console.log(`Index existant ${index.name} supprimé car spécifications identiques`);
      }
    }

    // Créer le nouvel index avec le nom souhaité
    await collection.createIndex(indexSpec, { name: indexName });
    console.log(`Index ${indexName} créé avec succès`);

    return true;
  } catch (error) {
    console.error(`Erreur lors de la gestion de l'index ${indexName}:`, error);
    throw error;
  }
}
