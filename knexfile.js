module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PGHOST || '127.0.0.1',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
      database: process.env.PGDATABASE || 'repohunter',
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
