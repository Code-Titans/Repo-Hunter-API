import { PubSub } from 'apollo-server';
import { mongo, client } from '../../datasources';

// TODO add a user object for authentication
const pubsub = new PubSub();

const context = ({ req }) => ({
  mongo,
  client,
  pubsub,
  req,
});

export default context;
