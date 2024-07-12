const { Pool } = require("pg")
require("dotenv").config();


const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
})

pool.on('connect', () => {
    console.log('connected to database');
});

pool.on('error', (error) => {
    console.log(error);
    process.emit(-1);
});
module.exports = pool;