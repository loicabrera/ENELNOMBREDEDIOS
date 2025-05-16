// backend/Models/Proveedor.js
import { Sequelize, DataTypes } from 'sequelize';
import conexion from '../db.js';
import { PERSONA } from './Persona.js';

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
  p_e_r_s_o_n_a_id_persona: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'p_e_r_s_o_n_a_id_persona',
    references: {
      model: PERSONA,
      key: 'id_persona'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}, {
  tableName: 'provedor_negocio',
  timestamps: false
});

// Definir la relación
Proveedor.belongsTo(PERSONA, {
  foreignKey: 'p_e_r_s_o_n_a_id_persona',
  targetKey: 'id_persona',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});