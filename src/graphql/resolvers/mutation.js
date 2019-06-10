import { UserInputError } from 'apollo-server';
import bcrypt from 'bcrypt';
import { generateToken, validateInput } from '../../helpers';
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
  register: async (_, { email, password }, { client }) => {
    validateInput(email, password);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await client.createUser({ email, password: hashedPassword });
    return user;
  },
  login: async (_, { email, password }, { client }) => {
    validateInput(email);
    const user = await client.getUserByEmail(email);

    if (!user) throw Error('User not found');
    if (typeof user === 'string') throw Error(user);
    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new Error('Incorrect password');
    const token = generateToken(user.email);
    return {
      token,
      user: {
        id: user.user_id,
        email: user.email,
      },
    };
  },
  createComment: async (
    _,
    { repoId, userId, text: commentText },
    {
      client, mongo, pubsub, req,
    },
  ) => {
    if (!commentText.trim()) {
      throw new UserInputError('You can not post an empty comment');
    }

    authenticateUser(req);
    const { author, repo } = await client.getUserAndRepo(userId, repoId)
      .then(res => res);
    const {
      _id,
      text,
    } = await mongo.createComment(repoId, userId, commentText);
    const comment = {
      _id, text, author, repo,
    };

    pubsub.publish(`COMMENT_${repoId}`, { comment });
    return comment;
  },
};

export default Mutation;
