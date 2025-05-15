// backend/db.js
import { Sequelize } from 'sequelize';

// Crea la instancia de Sequelize (esto maneja la conexión)
const conexion = new Sequelize('prueba', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql'
});

export default conexion;