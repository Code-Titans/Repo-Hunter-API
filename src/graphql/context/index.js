import databaseAPI from '../../datasources';

const {
  PostgresAPI, MongoDbAPI, config, mongoConfig,
} = databaseAPI;

// TODO add a user object for authentication

const dataSources = {
  client: new PostgresAPI(config),
  mongoClient: new MongoDbAPI(mongoConfig),
};

const context = ({ req, res }) => {
  dataSources.request = req;
  dataSources.response = res;
  return dataSources;
};

export default context;
