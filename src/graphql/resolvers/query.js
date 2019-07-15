const Query = {
  user: (_, { id }, { client }) => client.getUserById(id),
  comments: async (_, { repoId }, { client, mongo }) => {
    // FIXME pagination should be applied here
    const comments = await mongo
      .getAllComments(repoId)
      .then(results => results);
    const [
      { username, user_id: authorId, repo_link: repoLink },
    ] = await client.getPost(repoId);
    const result = await comments.map(
      async ({
        _id, text, userId,
      }) => {
        const [
          { username: commentAuthor, id: commentAuthorId },
        ] = await client.getUserDetails(userId);
        return {
          _id,
          text,
          commentAuthor: { id: commentAuthorId, username: commentAuthor },
          postAuthor: { id: authorId, username },
          repo: { id: repoId, repoLink },
        };
      },
    );
    return result;
  },
};

export default Query;
