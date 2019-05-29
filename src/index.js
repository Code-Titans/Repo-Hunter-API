import { ApolloServer } from 'apollo-server';
import config from './graphql';

const server = new ApolloServer(config);

module.exports = { server };
