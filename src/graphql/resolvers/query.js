const Query = {
  users: (_, __, { client }) => client.getAllUsers(),
  user: (_, { id }, { client }) => client.getUser(id),
  comments: (_, __, { mongoClient }) => mongoClient.getAllComments()
    .then(results => results),
};

export default Query;
