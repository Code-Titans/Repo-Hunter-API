import { UserInputError, ApolloError } from 'apollo-server';
import bcrypt from 'bcrypt';
import { validateInput, ValidateRepoLink } from '../../helpers';
import { GoogleAuthenticate, GitHubAuthenticate } from '../../Auth/passport';
import authenticateUser from '../../Auth/authorization';

const Mutation = {
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
  register: async (_, { input: { email, password } }, { client }) => {
    validateInput(email, password);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await client.createUser({ email, password: hashedPassword });
    return user;
  },
  postComment: async (
    _,
    { repoId, text: commentText },
    {
      client, mongo, pubsub, req,
    },
  ) => {
    if (!commentText.trim()) {
      throw new UserInputError('You can not post an empty comment');
    }
    const { id } = authenticateUser(req);
    const userAndRepo = client.getUserAndRepo(id, repoId);
    const commentDetails = mongo.postComment(repoId, id, commentText);
    const [
      { username, repo_link: repoLink },
      { text, _id },
    ] = await Promise.all([userAndRepo, commentDetails]);
    const comment = {
      _id,
      text,
      author: {
        id,
        username,
      },
      repo: {
        id: repoId,
        repoLink,
      },
    };

    pubsub.publish(`COMMENT_${repoId}`, { comment });
    return comment;
  },
  postRepo: async (_, { link, description }, { client, req }) => {
    if (!link) throw UserInputError('Link not provided');
    const { id } = authenticateUser(req);
    const resource = await ValidateRepoLink(link);

    if (resource) {
      const repository = await client.postRepo({ link, description, id });
      return repository;
    }
  },
  likePost: async (_, { repoId }, { client, req }) => {
    const { id } = authenticateUser(req);
    const { total_likes: totalLikes, liked } = await client.likePost({
      repoId,
      id,
    });
    return {
      repoId,
      totalLikes,
      liked,
    };
  },
  editPostDescription: async (_, { repoId, description }, { client, req }) => {
    const { id } = authenticateUser(req);
    const [update] = await client.updateRepoDescription({
      repoId,
      description,
      id,
    });

    if (!update) {
      throw new ApolloError('You can not update this post! 😢');
    }

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
