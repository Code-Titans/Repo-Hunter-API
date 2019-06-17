const Subscription = {
  comment: {
    subscribe: (_, { repoId }, { client, pubsub }) => {
      const repository = client.getRepository(repoId);

      if (!repository) throw new Error('Post not found');

      return pubsub.asyncIterator(`COMMENT_${repoId}`);
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
