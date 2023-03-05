const mysql = require('mysql');

exports.handler = async (event) => {

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  connection.connect();
  let query;
  let results;
  const bodyObj = JSON.parse(event.body);
  
  query = 'SELECT * FROM delivery.cat_cp WHERE cp = "'+bodyObj.cp+'" LIMIT 1';
  
  results = await new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
  
  // Cierra la conexión
  connection.end();
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  }
  const body = JSON.stringify(results);
  return {
    headers,
    body,
  }
};