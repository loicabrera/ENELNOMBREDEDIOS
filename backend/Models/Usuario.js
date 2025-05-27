import { DataTypes } from 'sequelize';
import conexion from '../db.js';

export const Usuario = conexion.define('Usuario', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  telefono: {
    type: DataTypes.CHAR(12),
    allowNull: false
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  provedor_negocio_id_provedor: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'usuario',
  timestamps: false
}); 