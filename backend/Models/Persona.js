import { Sequelize, DataTypes } from 'sequelize';
import conexion from '../db.js';

export const PERSONA = conexion.define('Persona', {
  id_persona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    defaultValue: 0
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
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
}, {
  tableName: 'PERSONA',
  timestamps: false,
  hooks: {
    beforeCreate: (persona, options) => {
      // Asegurarse de que no se envíe un id_persona
      persona.id_persona = null;
    }
  }
});