import { ApolloServer } from 'apollo-server';
import { createConfig } from './graphql';

export const server = async () => new ApolloServer(await createConfig());

