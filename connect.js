const mysql = require('mysql2');
const { dbUser, dbPass, dbName } = require('./config.json');

const dbConnection = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',
    user: dbUser,
    password: dbPass,
    database: dbName
  });
  
  dbConnection.connect((err) => {
    if(err) throw err;
    console.log('connected to db...');
  });

module.exports = { dbConnection };