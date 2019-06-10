const Query = {
  users: (_, __, { client }) => client.getAllUsers(),
  user: (_, { id }, { client }) => client.getUserById(id),
  comments: async (_, { repoId }, { client, mongo }) => {
    const comments = await mongo.getAllComments(repoId)
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
