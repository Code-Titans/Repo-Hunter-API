const { generateUsers } = require('../seed_data');

exports.seed = function(knex, Promise) {
  console.log('seeding users...');
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function() {
      // Inserts seed entries
      const users = generateUsers(20);
      return knex('users').insert(users);
    });
};
