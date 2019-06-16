const { updateTimestampTrigger } = require("../procedures");
/* eslint-disable max-lines-per-function,func-names */
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.bigIncrements('id').primary().unsigned();
      table.string('username').unique();
      table.string('email').unique();
      table.string('name');
      table.string('password');
      table.string('picture');
      table.string('company');
      table.string('bio');
      table.string('website');
      table.timestamps(false, true);
    }),

    knex.schema.createTable('posts', (table) => {
      table.bigIncrements('id').primary().unsigned();
      table.string('repo_link').unique();
      table.string('description');
      table.integer('author_id').unsigned().notNullable();
      table.timestamps(false, true);

      table.foreign('author_id')
        .references('id')
        .inTable('users');
    }),

    knex.schema.createTable('followers', (table) => {
      table.bigIncrements('id').primary().unsigned();
      table.integer('user_id').unsigned().notNullable();
      table.integer('follower_id').unsigned().notNullable();
      table.timestamps(false, true);

      table.foreign('user_id')
        .references('id')
        .inTable('users');
      table.foreign('follower_id')
        .references('id')
        .inTable('users');
    }),

    knex.schema.createTable('likes', (table) => {
      table.bigIncrements('id').primary().unsigned();
      table.integer('user_id').unsigned().notNullable();
      table.integer('repo_id').unsigned().notNullable();
      table.timestamps(false, true);

      table.foreign('user_id')
        .references('id')
        .inTable('users');
      table.foreign('repo_id')
        .references('id')
        .inTable('posts');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.raw('DROP TABLE users CASCADE'),
    knex.raw('DROP TABLE posts CASCADE'),
    knex.raw('DROP TABLE followers CASCADE'),
    knex.raw('DROP TABLE likes CASCADE'),
  ]);
};
