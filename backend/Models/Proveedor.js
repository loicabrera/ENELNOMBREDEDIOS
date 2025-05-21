// backend/Models/Proveedor.js
import { Sequelize, DataTypes } from 'sequelize';
import conexion from '../db.js';
import { PERSONA } from './Persona.js';

export const Proveedor = conexion.define('provedor_negocio', {
  id_provedor: {
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
    allowNull: false,
    field: 'PERSONA_id_persona',
    references: {
      model: PERSONA,
      key: 'id_persona'
    }
  }
}, {
  tableName: 'provedor_negocio',
  timestamps: false
});

// Definir la relación
Proveedor.belongsTo(PERSONA, {
  foreignKey: 'PERSONA_id_persona',
  as: 'persona'
});

// Método para crear un proveedor con la persona asociada
export const createProveedorWithPersona = async (proveedorData, personaId) => {
  try {
    const proveedor = await Proveedor.create({
      ...proveedorData,
      PERSONA_id_persona: personaId
    });
    return proveedor;
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    throw error;
  }
};

// Método para obtener un proveedor con su persona asociada
export const getProveedorWithPersona = async (proveedorId) => {
  try {
    const proveedor = await Proveedor.findByPk(proveedorId, {
      include: [{
        model: PERSONA,
        attributes: ['nombre', 'apellido', 'cedula', 'telefono', 'email']
      }]
    });
    return proveedor;
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    throw error;
  }
};