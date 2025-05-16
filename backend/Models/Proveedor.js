// backend/Models/Proveedor.js
import { Sequelize, DataTypes } from 'sequelize';
import conexion from '../db.js';

export const Proveedor = conexion.define('provedor_negocio', {
  id_proveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_empresa: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email_empresa: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono_empresa: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo_servicio: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  redes_sociales: {
    type: DataTypes.STRING,
    allowNull: true
  },
  PERSONA_id_persona: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Persona',
      key: 'id_persona'
    }
  }
}, {
  tableName: 'provedor_negocio',
  timestamps: false
});