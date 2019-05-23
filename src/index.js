import { ApolloServer } from 'apollo-server';
import config from './graphql';

const server = module.exports = {};

server.Apollo = new ApolloServer(config);
