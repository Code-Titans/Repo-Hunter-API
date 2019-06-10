import { ApolloServer } from 'apollo-server';
import createSchema from './graphql/schema';
import context from './graphql/context';
const config = async () => ({
  schema: await createSchema(),
  context,
});
export const server = async () => new ApolloServer(await config());

