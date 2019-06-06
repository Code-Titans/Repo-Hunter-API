import { PubSub } from 'apollo-server';
import databaseAPI from '../../datasources';

const {
  PostgresAPI, MongoDbAPI, config, mongoConfig,
} = databaseAPI;
// TODO add a user object for authentication
const pubsub = new PubSub();

export const dataSources = {
  client: new PostgresAPI(config),
  mongoClient: new MongoDbAPI(mongoConfig),
};
const context = ({ req }) => ({
  ...dataSources,
  pubsub,
  req,
});

export default context;
