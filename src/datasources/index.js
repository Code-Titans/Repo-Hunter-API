import PostgresAPI from './postgres';
import mongoDbAPI from './mongodb'

const config = {
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
};

const mongoConfig = process.env.MONGO_URL;

export default { PostgresAPI, mongoDbAPI, config, mongoConfig };
