// backend/server.js
import express from 'express';
import cors from 'cors';
import conexion, { testConnection, dbConfig } from './db.js';
import { Proveedor } from './Models/Proveedor.js';
import { PERSONA } from './Models/Persona.js';
import stripe from './config/stripe.js';
import { Pago } from './Models/Pago.js';
import { Producto, ImagenProducto, Servicio, ImagenServicio } from './Models/Publicacion.js';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { Usuario } from './Models/Usuario.js';
import { Membresia } from './Models/Membresias.js';
import { Op } from 'sequelize';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Nuevo: memoryStorage para imágenes de servicios
const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage });

// Nuevo: memoryStorage para imágenes de productos
const memoryStorageProductos = multer.memoryStorage();
const uploadMemoryProductos = multer({ storage: memoryStorageProductos });

app.use('/uploads', express.static('uploads'));

const db = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port
});

// Rutas básicas
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Ruta para obtener todas las personas
app.get('/persona', async (req, res) => {
  try {
    const personas = await PERSONA.findAll();
    res.json(personas);
  } catch (error) {
    console.error('Error al obtener personas:', error);
    res.status(500).json({ error: 'Error al obtener las personas' });
  }
});

// Ruta para crear una nueva persona
app.post('/crear_persona', async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, cedula } = req.body;

    // Log de datos recibidos
    console.log('📝 Datos recibidos:', { id_persona: 0, nombre, apellido, telefono, email, cedula });

    // Validación de campos requeridos
    const camposFaltantes = [];
    if (!nombre) camposFaltantes.push('nombre');
    if (!apellido) camposFaltantes.push('apellido');
    if (!telefono) camposFaltantes.push('teléfono');
    if (!email) camposFaltantes.push('email');
    if (!cedula) camposFaltantes.push('cédula');

    if (camposFaltantes.length > 0) {
      console.log('❌ Campos faltantes:', camposFaltantes);
      return res.status(400).json({
        error: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`
      });
    }

    // Validación de formato de cédula (ejemplo: 000-0000000-0)
    const cedulaRegex = /^\d{3}-\d{7}-\d{1}$/;
    if (!cedulaRegex.test(cedula)) {
      console.log('❌ Formato de cédula inválido:', cedula);
      return res.status(400).json({
        error: 'El formato de la cédula debe ser: 000-0000000-0'
      });
    }

    // Validación de formato de teléfono (ejemplo: 000-000-0000)
    const telefonoRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!telefonoRegex.test(telefono)) {
      console.log('❌ Formato de teléfono inválido:', telefono);
      return res.status(400).json({
        error: 'El formato del teléfono debe ser: 000-000-0000'
      });
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Formato de email inválido:', email);
      return res.status(400).json({
        error: 'El formato del email es inválido'
      });
    }

    // Verificar si la cédula ya existe
    const personaExistente = await PERSONA.findOne({ where: { cedula } });
    if (personaExistente) {
      console.log('❌ Cédula ya registrada:', cedula);
      return res.status(400).json({
        error: 'La cédula ya está registrada en el sistema'
      });
    }

    // Crear la nueva persona con id_persona en 0
    const nuevaPersona = await PERSONA.create({
      id_persona: 0, // Esto permitirá que MySQL use auto-increment
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      telefono,
      email: email.trim(),
      cedula
    });

    console.log('✅ Persona creada exitosamente:', nuevaPersona.toJSON());
    res.status(201).json({
      message: 'Persona creada exitosamente',
      persona: nuevaPersona
    });

  } catch (error) {
    console.error('❌ Error al crear persona:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        detalles: error.errors.map(e => e.message)
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'La cédula ya existe en la base de datos'
      });
    }
    
    // Error general del servidor
    res.status(500).json({
      error: 'Error interno del servidor',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Ruta para obtener proveedores
app.get('/proveedores', async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.json(proveedores);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error al obtener los proveedores' });
  }
});

// Ruta para obtener un negocio por su id
app.get('/proveedores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('SELECT * FROM provedor_negocio WHERE id_provedor = ?', [id]);
    if (result.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el proveedor' });
  }
});

// Ruta para crear un nuevo proveedor
app.post('/crear_proveedores', async (req, res) => {
  try {
    const {
      nombre_empresa,
      email_empresa,
      telefono_empresa,
      tipo_servicio,
      fecha_creacion,
      direccion,
      descripcion,
      redes_sociales,
      p_e_r_s_o_n_a_id_persona,
      PERSONA_id_persona
    } = req.body;

    // Usar cualquiera de los dos nombres de campo que esté presente
    const personaId = PERSONA_id_persona || p_e_r_s_o_n_a_id_persona;

    // Log de datos recibidos
    console.log('📝 Datos recibidos:', req.body);

    // Validación de campos requeridos
    const camposFaltantes = [];
    if (!nombre_empresa) camposFaltantes.push('nombre de empresa');
    if (!email_empresa) camposFaltantes.push('email de empresa');
    if (!telefono_empresa) camposFaltantes.push('teléfono de empresa');
    if (!tipo_servicio) camposFaltantes.push('tipo de servicio');
    if (!direccion) camposFaltantes.push('dirección');
    if (!personaId) camposFaltantes.push('id de persona');

    if (camposFaltantes.length > 0) {
      console.log('❌ Campos faltantes:', camposFaltantes);
      return res.status(400).json({
        error: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`
      });
    }

    // Verificar si la persona existe
    const personaExistente = await PERSONA.findByPk(personaId);
    if (!personaExistente) {
      console.log('❌ Persona no encontrada:', personaId);
      return res.status(400).json({
        error: 'La persona asociada no existe'
      });
    }

    // Validación de formato de teléfono (ejemplo: 000-000-0000)
    const telefonoRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!telefonoRegex.test(telefono_empresa)) {
      console.log('❌ Formato de teléfono inválido:', telefono_empresa);
      return res.status(400).json({
        error: 'El formato del teléfono debe ser: 000-000-0000'
      });
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_empresa)) {
      console.log('❌ Formato de email inválido:', email_empresa);
      return res.status(400).json({
        error: 'El formato del email es inválido'
      });
    }

    // Verificar si la empresa ya existe con el mismo nombre
    const proveedorExistente = await Proveedor.findOne({ where: { nombre_empresa } });
    if (proveedorExistente) {
      console.log('❌ Empresa ya registrada:', nombre_empresa);
      return res.status(400).json({
        error: 'Ya existe una empresa registrada con este nombre'
      });
    }

    // Crear el nuevo proveedor
    const nuevoProveedor = await Proveedor.create({
      nombre_empresa: nombre_empresa.trim(),
      email_empresa: email_empresa.trim(),
      telefono_empresa,
      tipo_servicio: tipo_servicio.trim(),
      fecha_creacion: fecha_creacion ? new Date(fecha_creacion) : new Date(),
      direccion: direccion.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      redes_sociales: redes_sociales ? redes_sociales.trim() : null,
      PERSONA_id_persona: personaId
    });

    console.log('✅ Proveedor creado exitosamente:', nuevoProveedor.toJSON());
    res.status(201).json({
      message: 'Proveedor creado exitosamente',
      proveedor: nuevoProveedor
    });

  } catch (error) {
    console.error('❌ Error al crear proveedor:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        detalles: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Ruta para crear un intent de pago
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, planName } = req.body;

    // Crear un PaymentIntent con Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // El monto ya viene en centavos desde el frontend
      currency: 'usd',
      metadata: {
        planName: planName
      }
    });

    // Enviar el client secret al frontend
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error al crear el intent de pago:', error);
    res.status(500).json({
      error: 'Error al procesar el pago'
    });
  }
});

// Función para formatear fechas a 'YYYY-MM-DD HH:MM:SS'
function formatDateToMySQL(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function generarUsuarioAleatorio() {
  return 'user' + Math.random().toString(36).substring(2, 8);
}

function generarPasswordAleatorio() {
  return Math.random().toString(36).slice(-7);
}

// Ruta para registrar un pago
app.post('/registrar_pago', async (req, res) => {
  try {
    const {
      monto,
      fecha_pago,
      monto_pago,
      MEMBRESIA_id_membresia,
      provedor_negocio_id_provedor,
      PERSONA_id_persona
    } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!monto || !fecha_pago || !monto_pago || !MEMBRESIA_id_membresia || !provedor_negocio_id_provedor || !PERSONA_id_persona) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Crear el pago
    const nuevoPago = await Pago.create({
      monto,
      fecha_pago,
      monto_pago,
      MEMBRESIA_id_membresia,
      provedor_negocio_id_provedor
    });

    // Obtener la duración real del plan desde la tabla MEMBRESIA
    const [[membresia]] = await conexion.query(
      'SELECT duracion_dias FROM MEMBRESIA WHERE id_memebresia = ?',
      { replacements: [MEMBRESIA_id_membresia] }
    );
    const duracionDias = Number(membresia.duracion_dias) || 30;

    // Crear la membresía en PROVEDOR_MEMBRESIA
    const fechaInicio = new Date(fecha_pago);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + duracionDias); // Suma los días reales del plan

    const fechaInicioSQL = formatDateToMySQL(fechaInicio);
    const fechaFinSQL = formatDateToMySQL(fechaFin);
    const fechaPagoSQL = formatDateToMySQL(new Date(fecha_pago));

    await conexion.query(
      `INSERT INTO PROVEDOR_MEMBRESIA (fecha_inicio, fecha_fin, fecha_pago, MEMBRESIA_id_memebresia, id_provedor, estado)
       VALUES (?, ?, ?, ?, ?, 'activo')`,
      {
        replacements: [
          fechaInicioSQL,
          fechaFinSQL,
          fechaPagoSQL,
          MEMBRESIA_id_membresia,
          provedor_negocio_id_provedor
        ]
      }
    );

    // Generar usuario y contraseña aleatorios
    const user_name = generarUsuarioAleatorio();
    const password = generarPasswordAleatorio();

    // Log antes del insert en inicio_seccion
    console.log('Intentando insertar en inicio_seccion:', { user_name, password, PERSONA_id_persona });

    // Insertar en la tabla inicio_seccion
    await conexion.query(
      `INSERT INTO inicio_seccion (password, user_name, PERSONA_id_persona)
       VALUES (?, ?, ?)`,
      {
        replacements: [password, user_name, PERSONA_id_persona]
      }
    );

    // Log después del insert
    console.log('Insert en inicio_seccion exitoso para:', { user_name, PERSONA_id_persona });

    res.status(201).json({
      message: 'Pago, membresía y credenciales registrados exitosamente',
      credenciales: {
        user_name,
        password
      }
    });
  } catch (error) {
    console.error('Error al registrar el pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener todos los pagos con datos de proveedor y persona
app.get('/pagos', async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      include: [
        {
          model: Proveedor,
          as: 'proveedor',
          include: [
            {
              model: PERSONA,
              as: 'persona'
            }
          ]
        }
      ]
    });
    res.json(pagos);
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    res.status(500).json({ error: 'Error al obtener los pagos' });
  }
});

// Ruta para obtener la membresía actual de un proveedor
app.get('/membresia/:proveedorId', async (req, res) => {
  try {
    const { proveedorId } = req.params;
    // Usa el campo correcto id_provedor
    const [result] = await conexion.query(`
      SELECT pm.*, m.nombre_pla, m.precio, m.beneficios, m.duracion_dias
      FROM PROVEDOR_MEMBRESIA pm
      JOIN MEMBRESIA m ON pm.MEMBRESIA_id_memebresia = m.id_memebresia
      WHERE pm.id_provedor = ?
      ORDER BY pm.fecha_fin DESC
      LIMIT 1
    `, { replacements: [proveedorId] });

    if (!result.length) {
      return res.status(404).json({ error: 'No se encontró membresía para este proveedor' });
    }
    // Calcula días restantes y estado dinámicamente
    const membresia = result[0];
    const hoy = new Date();
    const fechaFin = new Date(membresia.fecha_fin);
    const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));

    if (diasRestantes > 7) {
      membresia.estado = 'activa';
    } else if (diasRestantes > 0) {
      membresia.estado = 'por vencer';
    } else {
      membresia.estado = 'vencida';
    }

    // Actualiza el estado en la base de datos si es necesario
    await conexion.query(
      'UPDATE PROVEDOR_MEMBRESIA SET estado = ? WHERE id_prov_membresia = ?',
      { replacements: [membresia.estado, membresia.id_prov_membresia] }
    );

    membresia.dias_restantes = Math.max(0, diasRestantes);

    res.json(membresia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la membresía' });
  }
});

// Ruta para obtener el historial de pagos de un proveedor
app.get('/pagos/:proveedorId', async (req, res) => {
  try {
    const { proveedorId } = req.params;
    // Busca los pagos de ese proveedor
    const [result] = await conexion.query(`
      SELECT p.*, m.nombre_pla
      FROM pago p
      JOIN MEMBRESIA m ON p.m_e_m_b_r_e_s_i_a_id_membresia = m.id_memebresia
      WHERE p.provedor_negocio_id_provedor = ?
      ORDER BY p.fecha_pago DESC
    `, { replacements: [proveedorId] });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pagos' });
  }
});

// Ruta para generar credenciales de acceso para un proveedor
app.post('/generar_credenciales', async (req, res) => {
  try {
    // Puedes obtener el id_persona si lo necesitas: const { id_persona } = req.body;
    // Aquí deberías generar credenciales reales, pero para pruebas devolvemos datos de ejemplo
    res.json({
      credentials: {
        username: 'usuario_ejemplo',
        password: 'contraseña123',
        email: 'ejemplo@email.com'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar credenciales' });
  }
});

// Función para obtener el límite de productos según la membresía activa
async function getLimiteProductos(proveedorId) {
  const [rows] = await conexion.query(`
    SELECT M.limite_productos
    FROM PROVEDOR_MEMBRESIA PM
    JOIN MEMBRESIA M ON PM.MEMBRESIA_id_memebresia = M.id_memebresia
    WHERE PM.id_provedor = ? AND PM.estado = 'activa'
    ORDER BY PM.fecha_inicio DESC LIMIT 1
  `, { replacements: [proveedorId] });
  return rows.length > 0 ? rows[0].limite_productos : 0;
}

// Endpoint para crear producto (con validación de membresía)
app.post('/api/productos', async (req, res) => {
  const { nombre, descripcion, precio, tipo_producto, provedor_negocio_id_provedor, categoria } = req.body;

  // 1. Obtener membresía activa y su límite de productos
  const [membresia] = await db.query(`
    SELECT M.limite_productos
    FROM PROVEDOR_MEMBRESIA PM
    JOIN MEMBRESIA M ON PM.MEMBRESIA_id_memebresia = M.id_memebresia
    WHERE PM.id_provedor = ? AND PM.estado = 'activa'
    ORDER BY PM.fecha_inicio DESC LIMIT 1
  `, [provedor_negocio_id_provedor]);

  if (!membresia.length) {
    return res.status(403).json({ error: 'No tienes una membresía activa.' });
  }

  // 2. Contar productos actuales
  const [productos] = await db.query(
    'SELECT COUNT(*) as total FROM productos WHERE provedor_negocio_id_provedor = ?',
    [provedor_negocio_id_provedor]
  );

  if (productos[0].total >= membresia[0].limite_productos) {
    return res.status(403).json({ error: 'Has alcanzado el límite de productos de tu membresía.' });
  }

  // 3. Si no ha alcanzado el límite, crear el producto
  try {
    const [result] = await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, tipo_producto, provedor_negocio_id_provedor, categoria) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, tipo_producto, provedor_negocio_id_provedor, categoria || null]
    );
    res.json({ id_producto: result.insertId });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error al crear el producto', details: err });
  }
});

// Ruta para login de proveedor
app.post('/login_proveedor', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar el usuario en la tabla inicio_seccion
    const [result] = await conexion.query(
      `SELECT * FROM inicio_seccion WHERE user_name = ? AND password = ?`,
      { replacements: [username, password] }
    );

    if (result.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Puedes traer más datos si lo necesitas, por ejemplo el id_persona
    const user = result[0];

    // Agregar el rol al objeto de usuario
    const userWithRole = {
      ...user,
      rol: 'proveedor'  // Agregamos el rol explícitamente
    };

    res.json({ 
      message: 'Login exitoso', 
      user: userWithRole 
    });
  } catch (error) {
    console.error('Error en login_proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para subir imagen de producto (con validación de membresía)
app.post('/api/imagenes_productos', uploadMemoryProductos.single('imagen'), async (req, res) => {
  try {
    const { productos_id_productos } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen.' });
    }

    // 1. Obtener el proveedor dueño del producto
    const [producto] = await db.query('SELECT provedor_negocio_id_provedor FROM productos WHERE id_productos = ?', [productos_id_productos]);
    if (!producto.length) return res.status(404).json({ error: 'Producto no encontrado.' });

    const provedorId = producto[0].provedor_negocio_id_provedor;

    // 2. Obtener membresía activa y su límite de fotos
    const [membresia] = await db.query(`
      SELECT M.limite_fotos
      FROM PROVEDOR_MEMBRESIA PM
      JOIN MEMBRESIA M ON PM.MEMBRESIA_id_memebresia = M.id_memebresia
      WHERE PM.id_provedor = ? AND PM.estado = 'activa'
      ORDER BY PM.fecha_inicio DESC LIMIT 1
    `, [provedorId]);

    if (!membresia.length) {
      return res.status(403).json({ error: 'No tienes una membresía activa.' });
    }

    // 3. Contar imágenes actuales
    const [imagenes] = await db.query(
      'SELECT COUNT(*) as total FROM IMAGENES_productos WHERE productos_id_productos = ?',
      [productos_id_productos]
    );

    if (imagenes[0].total >= membresia[0].limite_fotos) {
      return res.status(403).json({ error: 'Has alcanzado el límite de imágenes para este producto.' });
    }

    // 4. Si no ha alcanzado el límite, subir la imagen
    const url_imagen = `/uploads/${file.originalname}`;
    const imagen_blob = file.buffer;

    await db.query(
      'INSERT INTO IMAGENES_productos (url_imagen, cantidad, productos_id_productos, imagen_blob) VALUES (?, ?, ?, ?)',
      [url_imagen, 1, productos_id_productos, imagen_blob]
    );

    res.json({ success: true, url_imagen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir la imagen.' });
  }
});

// Endpoint para obtener productos de un proveedor
app.get('/api/productos', async (req, res) => {
  const { provedor_negocio_id_provedor } = req.query;
  if (!provedor_negocio_id_provedor) {
    return res.status(400).json({ error: 'Falta el id del proveedor' });
  }
  try {
    const [rows] = await db.query(
      'SELECT * FROM productos WHERE provedor_negocio_id_provedor = ?',
      [provedor_negocio_id_provedor]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Endpoint para obtener todos los productos
app.get('/api/productos-todos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener todos los productos:', err);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Endpoint para obtener todos los servicios publicados (MySQL directo)
app.get('/api/servicios', async (req, res) => {
  try {
    const [rows] = await conexion.query('SELECT * FROM SERVICIO');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
});

// Endpoint para obtener servicios con imágenes
app.get('/api/servicios-con-imagenes', async (req, res) => {
  try {
    const servicios = await Servicio.findAll({
      include: [{ model: ImagenServicio, required: false }]
    });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios con imágenes' });
  }
});

// Endpoint para crear servicio (con validación de membresía)
app.post('/api/servicios', async (req, res) => {
  const { nombre, descripcion, tipo_servicio, precio, provedor_negocio_id_provedor } = req.body;

  // 1. Obtener membresía activa y su límite de servicios
  const [membresia] = await db.query(`
    SELECT M.limite_servicios
    FROM PROVEDOR_MEMBRESIA PM
    JOIN MEMBRESIA M ON PM.MEMBRESIA_id_memebresia = M.id_memebresia
    WHERE PM.id_provedor = ? AND PM.estado = 'activa'
    ORDER BY PM.fecha_inicio DESC LIMIT 1
  `, [provedor_negocio_id_provedor]);

  if (!membresia.length) {
    return res.status(403).json({ error: 'No tienes una membresía activa.' });
  }

  // 2. Contar servicios actuales
  const [servicios] = await db.query(
    'SELECT COUNT(*) as total FROM SERVICIO WHERE provedor_negocio_id_provedor = ?',
    [provedor_negocio_id_provedor]
  );

  if (servicios[0].total >= membresia[0].limite_servicios) {
    return res.status(403).json({ error: 'Has alcanzado el límite de servicios de tu membresía.' });
  }

  // 3. Si no ha alcanzado el límite, crear el servicio
  try {
    const [result] = await db.query(
      'INSERT INTO SERVICIO (nombre, descripcion, tipo_servicio, precio, provedor_negocio_id_provedor) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, tipo_servicio, precio, provedor_negocio_id_provedor]
    );
    res.json({ id_servicio: result.insertId });
  } catch (err) {
    console.error('Error al crear servicio:', err);
    res.status(500).json({ error: 'Error al crear el servicio', details: err });
  }
});

// Endpoint para subir imagen de servicio (con validación de membresía)
app.post('/api/imagenes_servicio', uploadMemory.single('imagen'), async (req, res) => {
  try {
    const { SERVICIO_id_servicio } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen.' });
    }

    // 1. Obtener el proveedor dueño del servicio
    const [servicio] = await db.query('SELECT provedor_negocio_id_provedor FROM SERVICIO WHERE id_servicio = ?', [SERVICIO_id_servicio]);
    if (!servicio.length) return res.status(404).json({ error: 'Servicio no encontrado.' });

    const provedorId = servicio[0].provedor_negocio_id_provedor;

    // 2. Obtener membresía activa y su límite de fotos
    const [membresia] = await db.query(`
      SELECT M.limite_fotos
      FROM PROVEDOR_MEMBRESIA PM
      JOIN MEMBRESIA M ON PM.MEMBRESIA_id_memebresia = M.id_memebresia
      WHERE PM.id_provedor = ? AND PM.estado = 'activa'
      ORDER BY PM.fecha_inicio DESC LIMIT 1
    `, [provedorId]);

    if (!membresia.length) {
      return res.status(403).json({ error: 'No tienes una membresía activa.' });
    }

    // 3. Contar imágenes actuales
    const [imagenes] = await db.query(
      'SELECT COUNT(*) as total FROM IMAGENES_servicio WHERE SERVICIO_id_servicio = ?',
      [SERVICIO_id_servicio]
    );

    if (imagenes[0].total >= membresia[0].limite_fotos) {
      return res.status(403).json({ error: 'Has alcanzado el límite de imágenes para este servicio.' });
    }

    // 4. Si no ha alcanzado el límite, subir la imagen
    const url_imagen = file.originalname;
    const imagen_blob = file.buffer;

    await db.query(
      'INSERT INTO IMAGENES_servicio (url_imagen, cantidad, SERVICIO_id_servicio, imagen_blob) VALUES (?, ?, ?, ?)',
      [url_imagen, 1, SERVICIO_id_servicio, imagen_blob]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al guardar la imagen:', err);
    res.status(500).json({ error: 'Error al guardar la imagen', details: err });
  }
});

// Endpoint para obtener todas las imágenes de un servicio
app.get('/api/imagenes_servicio/por-servicio/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT id_imagenes FROM IMAGENES_servicio WHERE SERVICIO_id_servicio = ?',
      [id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las imágenes del servicio' });
  }
});

// Endpoint para servir imágenes
app.get('/api/imagenes_servicio/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query('SELECT imagen_blob FROM IMAGENES_servicio WHERE id_imagenes = ?', [id]);
  if (rows.length === 0) return res.status(404).send('No encontrada');
  res.set('Content-Type', 'image/jpeg');
  res.send(rows[0].imagen_blob);
});

// Endpoint para obtener todas las imágenes de un producto
app.get('/api/imagenes_productos/por-producto/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT id_imagenes, url_imagen FROM IMAGENES_productos WHERE productos_id_productos = ?',
      [id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las imágenes del producto' });
  }
});

// Endpoint para servir imagen blob de producto
app.get('/api/imagenes_productos/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query('SELECT imagen_blob FROM IMAGENES_productos WHERE id_imagenes = ?', [id]);
  if (rows.length === 0) return res.status(404).send('No encontrada');
  res.set('Content-Type', 'image/jpeg');
  res.send(rows[0].imagen_blob);
});

// Cambiar contraseña de proveedor
app.post('/api/cambiar-password', async (req, res) => {
  const { user_name, oldPassword, newPassword } = req.body;
  try {
    // Verifica usuario y contraseña actual
    const [result] = await conexion.query(
      `SELECT * FROM inicio_seccion WHERE user_name = ? AND password = ?`,
      { replacements: [user_name, oldPassword] }
    );
    if (result.length === 0) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta.' });
    }
    // Actualiza la contraseña
    await conexion.query(
      `UPDATE inicio_seccion SET password = ? WHERE user_name = ?`,
      { replacements: [newPassword, user_name] }
    );
    res.json({ success: true, message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar la contraseña.' });
  }
});

// Endpoint para eliminar servicio
app.delete('/api/servicios/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Intentando eliminar servicio con ID:', id);
  
  try {
    // Verificar si el servicio existe
    console.log('Verificando si el servicio existe...');
    const [servicio] = await db.query('SELECT * FROM SERVICIO WHERE id_servicio = ?', [id]);
    console.log('Resultado de búsqueda del servicio:', servicio);
    
    if (!servicio.length) {
      console.log('Servicio no encontrado');
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    console.log('Servicio encontrado, iniciando transacción...');
    // Iniciar una transacción
    await db.query('START TRANSACTION');

    try {
      // Primero eliminar las imágenes asociadas
      console.log('Eliminando imágenes asociadas...');
      const [resultImagenes] = await db.query('DELETE FROM IMAGENES_servicio WHERE SERVICIO_id_servicio = ?', [id]);
      console.log('Resultado de eliminación de imágenes:', resultImagenes);
      
      // Luego eliminar el servicio
      console.log('Eliminando el servicio...');
      const [resultServicio] = await db.query('DELETE FROM SERVICIO WHERE id_servicio = ?', [id]);
      console.log('Resultado de eliminación del servicio:', resultServicio);
      
      // Si todo salió bien, confirmar la transacción
      console.log('Confirmando transacción...');
      await db.query('COMMIT');
      
      console.log('Servicio eliminado exitosamente');
      res.json({ message: 'Servicio eliminado exitosamente' });
    } catch (error) {
      // Si algo salió mal, revertir la transacción
      console.error('Error durante la eliminación, haciendo rollback:', error);
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error detallado al eliminar servicio:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState
    });
    
    res.status(500).json({ 
      error: 'Error al eliminar el servicio',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage
      } : undefined
    });
  }
});

// Endpoint para crear un usuario/contacto desde el formulario de contacto
app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, email, telefono, comentario, provedor_negocio_id_provedor } = req.body;
    if (!nombre || !telefono || !comentario || !provedor_negocio_id_provedor) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }
    const [result] = await db.query(
      'INSERT INTO Usuario (nombre, email, telefono, comentario, provedor_negocio_id_provedor) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, telefono, comentario, provedor_negocio_id_provedor]
    );
    res.status(201).json({ message: 'Contacto guardado correctamente', id_user: result.insertId });
  } catch (error) {
    console.error('Error al guardar contacto:', error);
    res.status(500).json({ error: 'Error al guardar el contacto' });
  }
});

// Obtener mensajes de contacto para un proveedor específico
app.get('/usuarios', async (req, res) => {
  try {
    const { provedor_negocio_id_provedor } = req.query;
    if (!provedor_negocio_id_provedor) {
      return res.status(400).json({ error: 'Falta el ID del proveedor' });
    }
    const [result] = await db.query(
      'SELECT * FROM Usuario WHERE provedor_negocio_id_provedor = ? ORDER BY id_user DESC',
      [provedor_negocio_id_provedor]
    );
    res.json(result);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener los mensajes del proveedor' });
  }
});

// Endpoint para obtener el límite de fotos según la membresía activa del proveedor
app.get('/api/limite-fotos', async (req, res) => {
  const { provedor_negocio_id_provedor } = req.query;
  if (!provedor_negocio_id_provedor) {
    return res.status(400).json({ error: 'Falta el id del proveedor' });
  }
  try {
    const [rows] = await db.query(`
      SELECT M.limite_fotos
      FROM PROVEDOR_MEMBRESIA PM
      JOIN MEMBRESIA M ON PM.MEMBRESIA_id_memebresia = M.id_memebresia
      WHERE PM.id_provedor = ? AND PM.estado = 'activa'
      ORDER BY PM.fecha_inicio DESC LIMIT 1
    `, [provedor_negocio_id_provedor]);
    if (!rows.length) {
      return res.status(404).json({ error: 'No tienes membresía activa.' });
    }
    res.json({ limite_fotos: rows[0].limite_fotos });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el límite de fotos.' });
  }
});

app.get('/api/membresias/resumen', async (req, res) => {
  try {
    const activas = await Membresia.count({
      where: {
        estado: 'activa',
        fecha_fin: { [Op.gt]: new Date() }
      }
    });
    const vencidas = await Membresia.count({
      where: {
        fecha_fin: { [Op.lt]: new Date() }
      }
    });
    res.json({ activas, vencidas });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener resumen de membresías' });
  }
});

// Endpoint para editar producto
app.put('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, tipo_producto } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, tipo_producto = ? WHERE id_productos = ?',
      [nombre, descripcion, precio, tipo_producto, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Endpoint para editar servicio
app.put('/api/servicios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, tipo_servicio, precio } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE SERVICIO SET nombre = ?, descripcion = ?, tipo_servicio = ?, precio = ? WHERE id_servicio = ?',
      [nombre, descripcion, tipo_servicio, precio, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json({ message: 'Servicio actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar servicio:', err);
    res.status(500).json({ error: 'Error al actualizar el servicio' });
  }
});

// Iniciar el servidor
async function startServer() {
  try {
    // Probar conexión a la base de datos
    const connected = await testConnection();
    
    if (!connected) {
      console.error('❌ No se pudo establecer conexión con la base de datos. El servidor no se iniciará.');
      process.exit(1);
    }

    // Iniciar el servidor HTTP
    app.listen(PORT, () => {
      console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}


startServer();
