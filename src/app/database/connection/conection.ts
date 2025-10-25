import 'dotenv/config';
import mysql from 'mysql2/promise';

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_DATABASE) {
  throw new Error("Variáveis de ambiente do banco de dados não estão configuradas.");
}

const connection = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  timezone: 'Z'
});

export default connection;
