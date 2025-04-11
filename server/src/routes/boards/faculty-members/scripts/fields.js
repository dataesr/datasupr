import { MongoClient } from "mongodb";

// SCRIPT POUR CREER UNE NOUVELLE COLLECTION "teaching-staff-fields" A PARTIR DE LA COLLECTION "teaching-staff-general-indicators"
// ON A DEDANS LES DISCIPLINES ET LEUR REPARTITION PAR ANNEE
async function processAndCreateCollection() {
  try {
    const client = new MongoClient("mongodb://localhost:27017/");

    await client.connect();
    console.log("Connecté à la base de données");

    const database = client.db("datasupr");
    const sourceCollection = database.collection(
      "teaching-staff-general-indicators"
    );

    const newCollectionName = "teaching-staff-fields";

    const collections = await database
      .listCollections({ name: newCollectionName })
      .toArray();
    if (collections.length > 0) {
      console.log(
        `La collection ${newCollectionName} existe déjà. Suppression...`
      );
      await database.collection(newCollectionName).drop();
    }

    await database.createCollection(newCollectionName);
    console.log(`Nouvelle collection créée: ${newCollectionName}`);

    const newCollection = database.collection(newCollectionName);

    const documents = await sourceCollection.find({}).toArray();

    const subjectData = {};

    console.log(`Traitement de ${documents.length} documents...`);

    documents.forEach((doc) => {
      const annee = doc.annee_universitaire;
      const hommesTotal = doc.headcountMan || 0;
      const femmesTotal = doc.headcountWoman || 0;
      const inconnusTotal = doc.headcountUnknown || 0;
      const total = hommesTotal + femmesTotal + inconnusTotal;

      if (!doc.subject || total === 0) return;

      doc.subject.forEach((subject) => {
        if (!subject.label_fr) return;

        const label = subject.label_fr;
        const part = subject.headcount / total;

        const hommes = Math.round(part * hommesTotal);
        const femmes = Math.round(part * femmesTotal);
        const inconnus = Math.round(part * inconnusTotal);

        // Initialiser l'objet pour ce sujet s'il n'existe pas
        if (!subjectData[label]) {
          subjectData[label] = {};
        }

        // Agréger les données par année pour éviter les doublons
        if (!subjectData[label][annee]) {
          subjectData[label][annee] = {
            hommes: 0,
            femmes: 0,
            inconnus: 0,
          };
        }

        // Ajouter les valeurs (au cas où il y aurait plusieurs entrées pour la même année)
        subjectData[label][annee].hommes += hommes;
        subjectData[label][annee].femmes += femmes;
        subjectData[label][annee].inconnus += inconnus;
      });
    });

    // Convertir l'objet en format approprié pour MongoDB
    const groupedSubjects = Object.entries(subjectData).map(
      ([subject, years]) => {
        // Convertir l'objet années en tableau
        const yearsArray = Object.entries(years).map(([annee, data]) => ({
          annee: parseInt(annee),
          hommes: data.hommes,
          femmes: data.femmes,
          inconnus: data.inconnus,
        }));

        // Trier par année (décroissant)
        yearsArray.sort((a, b) => b.annee - a.annee);

        return {
          subject,
          years: yearsArray,
        };
      }
    );

    // Insérer les données dans la nouvelle collection
    if (groupedSubjects.length > 0) {
      const result = await newCollection.insertMany(groupedSubjects);
      console.log(
        `${result.insertedCount} documents insérés dans la collection ${newCollectionName}`
      );
    } else {
      console.log("Aucune donnée à insérer");
    }

    console.log("Opération terminée avec succès");
    await client.close();
  } catch (error) {
    console.error("Une erreur s'est produite:", error);
  }
}

processAndCreateCollection();
