// System imports
import path from 'path';
// Node_modules imports
import { makeExecutableSchema } from "apollo-server";
import { importSchema } from "graphql-import";
// custom module imports
import resolvers from './resolvers';
import context from './context';

const typeDefs = importSchema(path.join(__dirname, `/schema/schema.graphql`));
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const config = { schema, context };

export default config;
