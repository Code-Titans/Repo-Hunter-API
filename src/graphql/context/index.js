import databaseAPI from '../../datasources';

const {
  PostgresAPI, MongoDbAPI, config, mongoConfig,
} = databaseAPI;

// TODO add a user object for authentication

const context = {
  client: new PostgresAPI(config),
  mongoClient: new MongoDbAPI(mongoConfig),
};

export default context;
