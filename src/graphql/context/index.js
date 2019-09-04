import { PubSub } from 'apollo-server';
import { mongo, client } from '../../datasources';

const pubsub = new PubSub();
const context = ({ req, res }) => ({
  mongo,
  client,
  pubsub,
  req,
  res,
});

export default context;
