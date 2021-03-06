module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: `${__dirname}/knex/migrations`,
    },
    seeds: {
      directory: `${__dirname}/knex/seeds`,
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: `${__dirname}/knex/migrations`,
    },
    seeds: {
      directory: `${__dirname}/knex/seeds`,
    },
  },
};
