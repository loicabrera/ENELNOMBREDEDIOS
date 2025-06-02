import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

const conexion = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mysql',
    logging: console.log, // Activamos logging para ver las consultas SQL
    pool: {
      max: 5, // Máximo de conexiones en el pool
      min: 0, // Mínimo de conexiones en el pool
      acquire: 30000, // Tiempo máximo en ms que el pool tratará de obtener una conexión antes de lanzar error
      idle: 10000 // Tiempo máximo en ms que una conexión puede estar inactiva antes de ser liberada
    },
    define: {
      timestamps: false, // Por defecto, no agregar timestamps
      freezeTableName: true, // Usar exactamente el nombre de modelo que definimos
      underscored: true // Usar snake_case en lugar de camelCase para los nombres de columnas
    }
  }
);

// Función para probar la conexión
export const testConnection = async () => {
  try {
    await conexion.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    
    // Solo sincronizar si las tablas no existen
    await conexion.sync({ 
      alter: false, // No alterar tablas existentes
      force: false, // No forzar recreación de tablas
      logging: console.log
    });
    console.log('✅ Modelos sincronizados con la base de datos.');
    
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    return false;
  }
};

export { dbConfig };
export default conexion;
