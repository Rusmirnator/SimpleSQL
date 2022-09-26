const sqlClient = require('pg');
const sqlConfig = {
    user: "user",
    password: "password",
    database: "database_name",
    server: "server",
    pool: {
        max: 10,
        min: 0
    },
    options: {
        trustServerCertificate: true,
    }
}

async function sqlQueryAsync(query) {
    try {

        await sqlClient.connect(sqlConfig);

        console.log(query);

        return await sqlClient.query(query);

    } catch (err) {

        console.log(err);

        return await err;
    }
}

module.exports = { sqlClient, sqlQueryAsync };