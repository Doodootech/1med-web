require('dotenv').config;

const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === "production";

const conString =`postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}${process.env.PGDATABASE}`;

const pool = new Pool({
    conString: isProduction ? process.env.DATABASE_URL : conString
});

module.exports={ pool};