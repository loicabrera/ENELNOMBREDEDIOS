import { Sequelize, DataTypes } from 'sequelize';
import conexion from '../db.js';

export const Persona = conexion.define('persona', {
  id_persona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.DATE,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'persona',
  timestamps: false
});