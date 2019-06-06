require('babel-register');
require('babel-core/register');
require('babel-polyfill');
require('dotenv-safe').config({
  allowEmptyValues: true,
});

const bcrypt = require('bcrypt');
const path = require('path');
const { createHttpLink } = require('apollo-link-http');
const { ApolloLink } = require('apollo-link');
const { ApolloServer } = require('apollo-server');
const fetch = require('node-fetch');
const { importSchema } = require('graphql-import');
const {
  introspectSchema,
  makeRemoteExecutableSchema,
  mergeSchemas,
  makeExecutableSchema,
} = require('graphql-tools');
const { dataSources } = require('./context');
const { generateToken, validateInput } = require('../helpers');
const { GoogleAuthenticate, GitHubAuthenticate } = require('../Auth/passport');

const typeDefs = importSchema(path.join(__dirname, '/schema/schema.graphql'));
// retrieves GraphQl results;
const httpLink = createHttpLink({ uri: 'https://api.github.com/graphql', fetch });
// receive results from the remote schema by
// passing headers to the request
const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  });
  return forward(operation);
});
const link = middlewareLink.concat(httpLink);
const generateRemoteSchema = async () => {
  // get the schema of the remote server GitHub
  const schema = await introspectSchema(link);
  // create a schema that
  // uses the link to delegate requests to the underlying service
  const executableSchema = makeRemoteExecutableSchema({
    schema,
    link,
  });
  return executableSchema;
};
const generateAndMergeSchemas = async () => {
  const remoteSchema = await generateRemoteSchema();
  const localSchema = makeExecutableSchema({
    typeDefs,
  });
  return mergeSchemas({
    schemas: [remoteSchema, localSchema],
    resolvers: {
      Query: {
        users: () => dataSources.client.getAllUsers(),
        user: () => dataSources.client.getUser(id),
        comments: async (_, { repoId }) => {
          const comments = await dataSources.mongoClient.getAllComments(repoId)
            .then(results => results);
          const result = await comments.map(
            async ({
              _id, text, userId, repoId: id,
            }) => {
              const { author, repo } = await dataSources.client.getUserAndRepo(userId, id);
              return {
                _id, text, repo, author,
              };
            },
          );
          return result;
        },
      },
      Mutation: {
        googleAuth: async (_, { accessToken }, { request, response }) => {
          request.body = {
            ...request.body,
            access_token: accessToken,
          };
          try {
            const { data, info } = await GoogleAuthenticate(request, response);

            if (data) {
              console.log(data);
            }

            console.log({ info });
            return data;
          } catch (e) {
            return e;
          }
        },
        gitHubAuth: async (_, __, { request, response }) => {
          try {
            const { data } = await GitHubAuthenticate(request, response);
            return data;
          } catch (e) {
            return e;
          }
        },
        register: async (_, { email, password }) => {
          validateInput(email, password);
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(password, salt);
          const user = await dataSources.client.createUser(
            {
              email, password: hashedPassword,
            },
          );
          return user;
        },
        login: async (_, { email, password }) => {
          validateInput(email, password);
          const user = await dataSources.client.getUserByEmail(email);

          if (!user) throw Error('User not found');
          if (typeof user === 'string') throw Error(user);
          const match = await bcrypt.compare(password, user.password);

          if (!match) throw new Error('Incorrect password');
          const token = generateToken(user.email);
          return {
            token,
            user: {
              id: user.user_id,
              email: user.email,
            },
          };
        },
      },
    },
  });
};

generateAndMergeSchemas().then((schema) => {
  const server = new ApolloServer({
    schema,
  });

  server.listen(4000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});

