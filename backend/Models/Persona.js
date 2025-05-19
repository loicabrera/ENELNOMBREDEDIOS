import { Sequelize, DataTypes } from 'sequelize';
import conexion from '../db.js';

export const PERSONA = conexion.define('Persona', {
  id_persona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  timestamps: false
});

// Método para obtener el último ID de persona
export const getLastPersonaId = async () => {
  try {
    const lastPersona = await PERSONA.findOne({
      order: [['id_persona', 'DESC']]
    });
    return lastPersona ? lastPersona.id_persona : null;
  } catch (error) {
    console.error('Error al obtener el último ID de persona:', error);
    return null;
  }
};