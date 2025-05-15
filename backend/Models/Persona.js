import { Sequelize, DataTypes } from 'sequelize';
import conexion from '../db.js';

export const PERSONA = conexion.define('Persona', {
  id_persona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'PERSONA',
  timestamps: false,
});