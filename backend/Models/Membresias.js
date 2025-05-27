
import { DataTypes } from 'sequelize';
import conexion from '../db.js';


export const Membresia = conexion.define('PROVEDOR_MEMBRESIA', {
  id_prov_membresia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_inicio: DataTypes.DATE,
  fecha_fin: DataTypes.DATE,
  fecha_pago: DataTypes.DATE,
  MEMBRESIA_id_membresia: DataTypes.INTEGER,
  id_provedor: DataTypes.INTEGER,
  estado: DataTypes.STRING
}, {
  tableName: 'PROVEDOR_MEMBRESIA',
  timestamps: false
});


