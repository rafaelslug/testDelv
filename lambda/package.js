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
  query = 'CREATE DATABASE IF NOT EXISTS delivery';
  
  results = await new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
  
  query = 'SHOW DATABASES';
  
  results = await new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });

  query = 'USE delivery';
  
  results = await new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });

  query = `CREATE TABLE IF NOT EXISTS user (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          email VARCHAR(100) NOT NULL
        )`;
  results = await new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });

  query = `INSERT INTO user (name, email)
          VALUES ("Juan", "juan@mail.com")`;
  results = await new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });

  query = `CREATE TABLE IF NOT EXISTS cat_cp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cp INT(50) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    colonia VARCHAR(100) NOT NULL
  )`;
  results = await new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });

  query = `INSERT INTO cat_cp (cp, estado, colonia)
          VALUES (23017, "Baja California Sur", "Paseos del Cortes"),
          (23000, "Baja California Sur", "Zona Centro"),
          (23010, "Baja California Sur", "Ciudad del Cielo"),
          (23010, "Baja California Sur", "Colina del Sol"),
          (23010, "Baja California Sur", "Lomas de Palmira"),
          (23000, "Baja California Sur", "Agustín Olachea")`;
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

  return results;
};