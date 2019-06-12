import path from 'path';
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { importSchema } from 'graphql-import';
import {
  introspectSchema,
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  mergeSchemas,
  transformSchema,
  RenameTypes,
} from 'graphql-tools';
import resolvers from '../resolvers';

const typeDefs = importSchema(path.join(__dirname, '/schema.graphql'));
const http = createHttpLink({ uri: 'https://api.github.com/graphql', fetch });
const link = setContext(() => ({
  headers: {
    authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  },
})).concat(http);
const createSchema = async () => {
  // Introspect remote schema
  const schema = await introspectSchema(link);
  // Make remote schema executable
  const remoteExecutableSchema = await makeRemoteExecutableSchema({
    schema,
    link,
  });
  // Make local schema executable
  const localExecutableSchema = await makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  // Transform the schema to avoid name collisions
  const localTransformedSchema = transformSchema(localExecutableSchema, [
    new RenameTypes(name => `RepoHunter_${name}`),
  ]);
  // Merge the local and remote schema
  return mergeSchemas({
    schemas: [remoteExecutableSchema, localTransformedSchema],
  });
};

export default createSchema;
