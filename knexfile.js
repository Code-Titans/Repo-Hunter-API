module.exports = {
  development: {
    client: 'pg',
    connection: {
      connection: process.env.DATABASE_URL,
      charset: 'utf8',
    },
    migrations: {
      directory: `${__dirname}/knex/migrations`,
    },
    seeds: {
      directory: `${__dirname}/knex/seeds`,
    },
  },
  production: {
    client: 'pg',
    connection: {
      connection: process.env.DATABASE_URL,
      charset: 'utf8',
    },
    migrations: {
      directory: `${__dirname}/knex/migrations`,
    },
    seeds: {
      directory: `${__dirname}/knex/seeds`,
    },
  },
};
