const Subscription = {
  comment: {
    subscribe: (_, { repoId }, { client, pubsub }) => {
      const repository = client.getRepository(repoId);

      if (!repository) throw new Error('Post not found');

      return pubsub.asyncIterator(`COMMENT_${repoId}`);
    },
  },
  updatePost: {
    subscribe: async (_, { repoId }, { client, pubsub }) => {
      const [repo] = await client.getRepository(repoId);

      if (!repo) throw new Error('Post not found');

      return pubsub.asyncIterator(`POST${repoId}`);
    },
  },
  like: {
    subscribe: (_, { repoId }, { client, pubsub }) => {
      const repository = client.getRepository(repoId);

      if (!repository) throw new Error('Post not found');

      return pubsub.asyncIterator(`LIKE_${repoId}`);
    },
  },
};

export default Subscription;
