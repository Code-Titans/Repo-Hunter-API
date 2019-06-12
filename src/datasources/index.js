import pgClient from './postgres';
import MongoDbAPI from './mongodb';

const mongoConfig = process.env.MONGO_URL;

export const mongo = new MongoDbAPI(mongoConfig);
export const client = pgClient;
