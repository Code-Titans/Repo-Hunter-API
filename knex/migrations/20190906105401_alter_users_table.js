/* eslint-disable func-names, max-len */
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('users', (table) => {
      table.renameColumn('password', 'location');
      table.boolean('is_hireable');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('users', (table) => {
      table.renameColumn('location', 'password');
      table.dropColumn('is_hireable');
    }),
  ]);
};
