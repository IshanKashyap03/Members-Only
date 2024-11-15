const { Client } = require("pg");
require("dotenv").config();

const SQL1 = 
`
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    membership_status VARCHAR(50) NOT NULL
)
`

const SQL2 = 
`
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    content TEXT NOT NULL
)
`

async function main() {
    console.log("seeding...");
    const client = new Client({
      connectionString: `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
    });
    await client.connect();
    await client.query(SQL1);
    await client.query(SQL2);
    await client.end();
    console.log("done");
}
  
main();