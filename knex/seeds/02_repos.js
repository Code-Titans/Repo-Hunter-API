const { generateRepos } = require('../seed_data');

exports.seed = function(knex, Promise) {
  console.log('seeding posts...');
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(function () {
      // Inserts seed entries
      const repos = generateRepos();
      return knex('posts').insert(repos);
    });
};
