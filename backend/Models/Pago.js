import { DataTypes } from 'sequelize';
import conexion from '../db.js';
import { Proveedor } from './Proveedor.js';

export const Pago = conexion.define('pago', {
  id_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  monto: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false
  },
  fecha_pago: {
    type: DataTypes.DATE,
    allowNull: false
  },
  monto_pago: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false
  },
  MEMBRESIA_id_membresia: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  provedor_negocio_id_provedor: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'pago',
  timestamps: false
});

Pago.belongsTo(Proveedor, {
  foreignKey: 'provedor_negocio_id_provedor',
  as: 'proveedor'
}); 