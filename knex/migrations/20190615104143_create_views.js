/* eslint-disable func-names, max-len */
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.raw(`
      CREATE OR REPLACE VIEW user_repo_info AS
      SELECT users.id AS user_id, users.username, posts.id AS repo_id, posts.repo_link
      FROM users 
      INNER JOIN posts 
      ON posts.author_id = users.id
    `),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.raw(`
      DROP VIEW IF EXISTS user_repo_info;
    `),
  ]);
};
