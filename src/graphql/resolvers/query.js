const Query = {
  users: (_, __, { client }) => client.getAllUsers(),
  user: (_, { id }, { client }) => client.getUser(id),
  comments: async (_, { repoId }, { client, mongoClient }) => {
    const comments = await mongoClient.getAllComments(repoId)
      .then(results => results);
    const result = await comments.map(
      async ({
        _id, text, userId, repoId: id,
      }) => {
        const { author, repo } = await client.getUserAndRepo(userId, id);
        return {
          _id, text, repo, author,
        };
      },
    );
    return result;
  },
};

export default Query;
