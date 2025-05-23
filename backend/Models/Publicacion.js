import { DataTypes } from 'sequelize';
import conexion from '../db.js';

// Modelo Producto
export const Producto = conexion.define('productos', {
  id_productos: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  descripcion: DataTypes.TEXT,
  precio: DataTypes.DECIMAL(10, 0),
  tipo_producto: DataTypes.STRING,
  provedor_negocio_id_provedor: DataTypes.INTEGER,
  categoria: DataTypes.STRING,
  fecha_publicacion: DataTypes.DATE
}, {
  tableName: 'productos',
  timestamps: false
});

// Modelo Imagen de Producto
export const ImagenProducto = conexion.define('IMAGENES_productos', {
  id_imagenes: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url_imagen: DataTypes.STRING,
  cantidad: DataTypes.STRING,
  productos_id_productos: DataTypes.INTEGER
}, {
  tableName: 'IMAGENES_productos',
  timestamps: false
});

// Relación Producto - ImagenProducto
Producto.hasMany(ImagenProducto, { foreignKey: 'productos_id_productos' });
ImagenProducto.belongsTo(Producto, { foreignKey: 'productos_id_productos' });

// Modelo Servicio
export const Servicio = conexion.define('SERVICIO', {
  id_servicio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  descripcion: DataTypes.TEXT,
  tipo_servicio: DataTypes.STRING,
  precio: DataTypes.DECIMAL(10, 0),
  provedor_negocio_id_provedor: DataTypes.INTEGER
}, {
  tableName: 'SERVICIO',
  timestamps: false
});

// Modelo Imagen de Servicio
export const ImagenServicio = conexion.define('IMAGENES_servicio', {
  id_imagenes: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url_imagen: DataTypes.STRING,
  cantidad: DataTypes.STRING,
  SERVICIO_id_servicio: DataTypes.INTEGER
}, {
  tableName: 'IMAGENES_servicio',
  timestamps: false
});

// Relación Servicio - ImagenServicio
Servicio.hasMany(ImagenServicio, { foreignKey: 'SERVICIO_id_servicio' });
ImagenServicio.belongsTo(Servicio, { foreignKey: 'SERVICIO_id_servicio' }); 