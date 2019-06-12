import knex from '../../knex';

const getUserDetails = async (ids) => {
  const user = await knex
    .select('*')
    .from('users')
    .whereIn('id', [ids]);
  return user;
};
const socialAuthCreateUser = async ({ picture, email, name }) => {
  const user = await knex
    .insert({ picture, email, name }, ['id', 'email'])
    .into('users');
  return user;
};
const createUser = async ({ email, password } = {}) => {
  const user = await knex
    .insert({ email, password }, ['id', 'email'])
    .into('users');
  return user[0];
};
const postRepo = async ({ link, description, id }) => {
  const repo = await knex
    .insert(
      { repo_link: link, description, author_id: id },
      ['id ', 'repo_link as repo', 'author_id as author'],
    )
    .into('posts');
  return repo[0];
};
const validateUser = async (email) => {
  const user = await knex
    .select('id', 'email', 'password')
    .from('users')
    .where('email', email);
  return user[0];
};
const getUserById = async (ids) => {
  const user = await knex
    .select('*')
    .from('users')
    .whereIn('id', [ids]);
  return user;
};
const getRepository = async (repoId) => {
  const repo = await knex
    .select(
      'repo_link as repo', 'description',
      'author_id as id',
      'created_at', 'updated_at',
    )
    .from('posts')
    .where('id', repoId);
  return repo;
};
const getUserAndRepo = async (userId, repoId) => {
  const user = knex
    .select('id', 'username')
    .from('users')
    .where('id', userId);
  const repository = knex
    .select('id')
    .from('posts')
    .where('id', repoId);
  const [author, repo] = await Promise.all([user, repository]);
  return { author: author[0], repo: repo[0] };
};

export default {
  createUser,
  getRepository,
  getUserDetails,
  getUserById,
  getUserAndRepo,
  validateUser,
  postRepo,
  socialAuthCreateUser,
};
