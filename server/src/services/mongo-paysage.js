import { MongoClient } from 'mongodb';

import logger from './logger';

const mongoDbName = process.env.MONGO_DB_NAME_PAYSAGE || 'datasupr';
const mongoUri = process.env.MONGO_URI_PAYSAGE || 'mongodb://localhost:27017/';

const clientPaysage = new MongoClient(mongoUri, { directConnection: true });

logger.info(`Try to connect to mongo... ${mongoUri}`);
await clientPaysage.connect().catch((e) => {
    logger.info(`Connexion to mongo instance failed... Terminating... ${e.message}`);
    process.kill(process.pid, 'SIGTERM');
});

logger.info(`Connected to mongo database... ${mongoDbName}`);
const dbPaysage = clientPaysage.db(mongoDbName);

export { clientPaysage, dbPaysage };
