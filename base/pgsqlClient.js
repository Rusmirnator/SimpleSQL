const { Client } = require('pg');
const { app } = require('electron')

const credentials = {
    user: "postgres",
    host: "localhost",
    database: "nodedemo",
    password: "yourpassword",
    port: 5432,
};

async function executeQueryAsync(query) {
    const sqlClient = new Client(credentials);

    try {

        await sqlClient.connect();

        console.log(query);

        return await sqlClient.query(query);

    } catch (err) {

        console.log(err);

        return await err;
    }
    finally {
        await sqlClient.end();
    }
}


module.exports = { loadSettings, executeQueryAsync };