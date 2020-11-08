const {
    Pool
} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'autos',
    password: 'bazepodataka',
    port: 5432,
});
