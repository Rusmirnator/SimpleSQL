const mssqlClient = require('mssql');
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

async function executeQueryAsync(query) {
    try {

        await mssqlClient.connect(sqlConfig);

        console.log(query);

        return await mssqlClient.query(query);

    } catch (err) {

        console.log(err);

        return await err;
    }
}

function loadSettings(){
    console.log('mssqlSettingsLoaded');
}

module.exports = { loadSettings, executeQueryAsync };