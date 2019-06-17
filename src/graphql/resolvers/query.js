import bcrypt from 'bcrypt';
import { generateToken, validateInput } from '../../helpers';

const Query = {
  user: (_, { id }, { client }) => client.getUserById(id),
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
