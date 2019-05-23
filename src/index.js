import { ApolloServer } from 'apollo-server';
import schema from './graphql';

const server = module.exports = {};

server.Apollo = new ApolloServer(schema);
