export const Query = {
  users: (_, __, { client }) => {
    return client.getAllUsers();
  },
  user: (_, { id }, { client }) => {
    return client.getUser(id)
  },
  comments: (_, __, { mongoClient }) => {
    return mongoClient.getAllComments().then(results => {
      return results;
    });
  }
};
