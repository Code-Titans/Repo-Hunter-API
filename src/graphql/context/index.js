import databaseAPI from '../../datasources';

const  { PostgresAPI, mongoDbAPI, config, mongoConfig } =  databaseAPI;

const context = {
  client: new PostgresAPI(config),
  mongoClient: new mongoDbAPI (mongoConfig)
};

export default context;
