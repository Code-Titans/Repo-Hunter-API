import bcrypt from 'bcrypt';
import { generateToken, validateInput } from '../../helpers';

const Query = {
  user: (_, { id }, { client }) => client.getUserById(id),
  login: async (_, { input: { email, password } }, { client }) => {
    validateInput(email);
    const user = await client.validateUser(email);

    if (!user) throw Error('User not found');
    if (typeof user === 'string') throw Error(user);
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
