module.exports = {
  production: {
    username: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    database: 'one-lab',
    host: 'postgres',
    dialect: 'postgres',
  },
};
