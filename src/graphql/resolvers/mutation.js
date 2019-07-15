/* eslint-disable max-lines-per-function */
import { UserInputError, ApolloError } from 'apollo-server';
import bcrypt from 'bcrypt';
import { generateToken, validateInput, ValidateRepoLink } from '../../helpers';
import { GoogleAuthenticate, GitHubAuthenticate } from '../../Auth/passport';
import authenticateUser from '../../Auth/authorization';

const Mutation = {
  googleAuth: async (_, __, { req, res }) => {
    try {
      const { data, info } = await GoogleAuthenticate(req, res);

      if (data) {
        console.log(data);
      }

      console.log({ info });
      return data;
    } catch (e) {
      return e;
    }
  },
  gitHubAuth: async (_, __, { req, res }) => {
    try {
      const { data } = await GitHubAuthenticate(req, res);
      return data;
    } catch (e) {
      return e;
    }
  },
  login: async (_, { input: { email, password } }, { client }) => {
    validateInput(email);
    const user = await client.validateUser(email);

    if (!user) throw Error('User not found');
    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new Error('Incorrect password');
    const token = generateToken({ email: user.email, id: user.id });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  },
  register: async (_, { input: { email, password } }, { client }) => {
    validateInput(email, password);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await client.createUser({ email, password: hashedPassword });
    const token = generateToken({ email: user.email, id: user.id });
    return { user, token };
  },
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
    const { url } = await ValidateRepoLink(link);
    const repository = await client.postRepo({ link: url, description, id });
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
    const { url } = await ValidateRepoLink(link);

    let update;

    if (link && description) {
      [update] = await client.updatePost({
        repoId,
        link: url,
        description,
        id,
      });
    }
    if (description) {
      [update] = await client.updatePostDetails({ repoId, description, id });
    }
    if (link) {
      [update] = await client.updatePostDetails({ repoId, link: url, id });
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
      owner: {
        id: update.author_id,
      },
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
