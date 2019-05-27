import PostgresAPI from './postgres';

const config = {
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
};

const dataSources = {
  PostgresAPI,
  config
};

export default dataSources;
