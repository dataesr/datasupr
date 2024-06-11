import { MongoClient } from "mongodb";

import logger from "./logger";

const mongoDbName = process.env.MONGO_DB_NAME_PAYSAGE || "paysage-prod-copy";
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/";

const clientPaysage = new MongoClient(mongoUri);

logger.info(`Try to connect to mongo Paysage... ${mongoUri}`);
await clientPaysage.connect().catch((e) => {
  logger.info(
    `Connexion to mongo Paysage instance failed... Terminating... ${e}`
  );
  process.kill(process.pid, "SIGTERM");
});

logger.info(`Connected to mongo database - Paysage... ${mongoDbName}`);
const dbPaysage = clientPaysage.db(mongoDbName);

export { clientPaysage, dbPaysage };
