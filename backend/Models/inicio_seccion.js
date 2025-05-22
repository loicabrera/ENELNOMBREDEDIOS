import { DataTypes } from 'sequelize';
import conexion from '../db.js';

export const INICIO_SECCION = conexion.define('inicio_seccion', {
  id_login: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  password: {
    type: DataTypes.STRING(7),
    allowNull: false
  },
  user_name: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  PERSONA_id_persona: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'PERSONA_id_persona'
  }
}, {
  tableName: 'inicio_seccion',
  timestamps: false
});
