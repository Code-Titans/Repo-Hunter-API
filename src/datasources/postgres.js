/* eslint-disable camelcase */
import knex from '../../knex';
// eslint-disable-next-line import/named
import {
  createUser,
  getUserById,
  getUserDetails,
} from './queries/usersTableQueries';

const socialAuthCreateUser = async ({ picture, email, name }) => {
  const user = await knex
    .insert({ picture, email, name }, ['id', 'email'])
    .into('users');
  return user;
};
const postRepo = async ({ link, description, id }) => {
  const repo = await knex
    .insert(
      { repo_link: link, description, author_id: id },
      ['id ', 'repo_link as repo', 'author_id as author'],
    )
    .into('posts')
    .catch(() => {
      throw new Error('Post already exists');
    });
  return repo[0];
};
const validateUser = async (email) => {
  const user = await knex
    .select('id', 'email', 'password')
    .from('users')
    .where('email', email);
  return user[0];
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
const getPost = async (repoId) => {
  const post = await knex
    .select('*')
    .from('user_repo_info')
    .where({ repo_id: repoId });
  return post;
};
const likePost = async ({ repoId, id }) => {
  const likes = await knex.raw(
    `
    SELECT total_likes, liked
    FROM toggle_like(?, ?)
    AS (total_likes BIGINT, liked BOOL)
    `,
    [id, repoId],
  );
  return likes.rows[0];
};
const updatePostDetails = async (
  {
    repoId: id,
    description,
    link: repo_link,
    id: author_id,
  }) => {
  let repo;
  if (description) {
    repo = await knex('posts')
      .where({ id, author_id })
      .update({ description })
      .returning('*');
  }
  if (repo_link) {
    repo = await knex('posts')
      .where({ id, author_id })
      .update({ repo_link })
      .returning('*');
  }

  console.log({ repo });
  return repo;
};
const updatePost = async (
  {
    repoId: id,
    description,
    link: repo_link,
    id: author_id,
  }) => {
  const repo = await knex('posts')
    .where({ id, author_id })
    .update({ description, repo_link })
    .returning('*');
  return repo;
};
const deletePost = async ({ repoId: id, id: author_id }) => {
  const repo = await knex('posts')
    .where({ id, author_id })
    .del();
  return repo;
};

export default {
  createUser,
  getRepository,
  getUserDetails,
  getUserById,
  getPost,
  likePost,
  postRepo,
  socialAuthCreateUser,
  validateUser,
  updatePost,
  updatePostDetails,
  deletePost,
};
