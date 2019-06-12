import { ApolloServer } from 'apollo-server';
import config from './graphql';

export const server = async () => new ApolloServer(await config());

