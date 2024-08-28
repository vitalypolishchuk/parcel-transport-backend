require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      ssl: { rejectUnauthorized: false } // Add this line if SSL is required
    },
    migrations: {
      directory: './migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    migrations: {
      directory: './migrations'
    }
  }
};
