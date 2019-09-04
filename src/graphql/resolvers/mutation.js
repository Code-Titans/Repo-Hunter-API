import { UserInputError, ApolloError } from 'apollo-server';
import authenticateUser from '../../auth/authorization';
// eslint-disable-next-line import/named
import { githubAuthMutation } from './types';

const Mutation = {
  gitHubAuth: githubAuthMutation,
  // eslint-disable-next-line max-lines-per-function
  postComment: async (
    _, { repoId, text: commentText },
    {
      client, mongo, pubsub, req,
    },
  ) => {
    if (!commentText.trim()) {
      throw new UserInputError('You can not post an empty comment');
    }
    const { id } = authenticateUser(req);
    const user = client.getUserDetails(id);
    const post = client.getPost(repoId);
    const commentDetails = mongo.postComment(repoId, id, commentText);
    const [
      [{ username: commentAuthor, id: userId }],
      [{ username, user_id: authorId, repo_link: repoLink }], { text, _id },
    ] = await Promise.all([user, post, commentDetails]);
    const comment = {
      _id,
      text,
      commentAuthor: { id: userId, username: commentAuthor },
      postAuthor: { id: authorId, username },
      repo: { id: repoId, repoLink },
    };

    pubsub.publish(`COMMENT_${repoId}`, { comment });
    return comment;
  },
  postRepo: async (_, { link, description }, { client, req }) => {
    if (!link) throw new UserInputError('Link not provided');
    const { id } = authenticateUser(req);
    const repository = await client.postRepo({ description, id });
    return repository;
  },
  likePost: async (_, { repoId }, { client, pubsub, req }) => {
    const { id } = authenticateUser(req);
    const { total_likes: totalLikes, liked } = await client.likePost({
      repoId,
      id,
    });
    const like = { repoId, totalLikes, liked };

    pubsub.publish(`LIKE_${repoId}`, { like });
    return like;
  },
  updatePost: async (
    _,
    { repoId, link, description },
    { client, req, pubsub },
  ) => {
    const { id } = authenticateUser(req);

    let update;
    if (link && description) {
      [update] = await client.updatePost({
        repoId,
        description,
        id,
      });
    }
    if (description) {
      [update] = await client.updatePostDetails({ repoId, description, id });
    }
    if (link) {
      [update] = await client.updatePostDetails({ repoId, id });
    }
    if (!update) {
      throw new ApolloError('You can only update your own post(s)! 😢');
    }

    pubsub.publish(`POST${repoId}`, {
      updatePost: {
        ...update,
        repoLink: update.repo_link,
        owner: {
          id: update.author_id,
        },
      },
    });

    return {
      ...update,
      repoLink: update.repo_link,
      owner: { id: update.author_id },
    };
  },
  deletePost: async (_, { repoId }, { client, req }) => {
    const { id } = authenticateUser(req);
    const response = await client.deletePost({ repoId, id });

    if (response === 0) {
      throw new ApolloError('You can not delete this post! 😢');
    }
  },
};

export default Mutation;
