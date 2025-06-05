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
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_para_jwt'; // Deberías usar una clave segura y guardarla en .env

// Configuración de CORS más permisiva para desarrollo y producción
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://spectacular-recreation-production.up.railway.app',
    'https://enelnombrededios-production.up.railway.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  exposedHeaders: ['Set-Cookie']
}));

// Middleware para parsear cookies
app.use(cookieParser());

// Middleware para manejar errores de CORS
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'https://spectacular-recreation-production.up.railway.app',
    'https://enelnombrededios-production.up.railway.app'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  next();
});

// Middleware para logging de solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Ruta para verificar el estado del servidor
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

// Middleware
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

// Middleware para verificar JWT (ejemplo)
const authenticateJWT = (req, res, next) => {
  console.log('=== authenticateJWT Debug ===');
  console.log('Cookies recibidas:', req.cookies);
  const token = req.cookies.token; // Intentar obtener el token de las cookies

  console.log('Token extraído:', token);

  if (!token) {
    console.log('No se encontró token, enviando 401.');
    return res.sendStatus(401); // Si no hay token, no autorizado
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Error al verificar JWT:', err);
      console.log('Token inválido, enviando 403.');
      return res.sendStatus(403); // Si el token no es válido, prohibido
    }
    req.user = user; // Agregar los datos del usuario decodificados a la solicitud
    console.log('Token verificado, usuario:', user);
    next(); // Continuar con la siguiente función middleware o ruta
  });
};

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

// Ruta para obtener un negocio por su id (proteger con JWT)
app.get('/proveedores/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { personaId } = req.user;
    const [result] = await db.query('SELECT * FROM provedor_negocio WHERE id_provedor = ?', [id]);
    if (result.length === 0) return res.status(404).json({ error: 'No encontrado' });
    // Permitir acceso si el negocio pertenece a la persona autenticada
    if (result[0].PERSONA_id_persona !== personaId) {
      return res.sendStatus(403);
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error al obtener proveedor autenticado:', error);
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

    // Validar datos requeridos
    if (!amount || !planName) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: amount y planName son obligatorios'
      });
    }

    // Validar que el monto sea un número positivo
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        error: 'El monto debe ser un número positivo'
      });
    }

    console.log('Creando PaymentIntent con:', { amount, planName });

    // Crear un PaymentIntent con Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // El monto ya viene en centavos desde el frontend
      currency: 'usd',
      metadata: {
        planName: planName
      }
    });

    console.log('PaymentIntent creado exitosamente:', paymentIntent.id);

    // Enviar el client secret al frontend
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error al crear el intent de pago:', error);
    
    // Manejar errores específicos de Stripe
    if (error.type === 'StripeCardError') {
      return res.status(400).json({
        error: 'Error con la tarjeta: ' + error.message
      });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        error: 'Error en la solicitud: ' + error.message
      });
    }

    res.status(500).json({
      error: 'Error al procesar el pago',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
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
      PERSONA_id_persona,
      esRegistroInicial // Nueva bandera
    } = req.body;

    // Log para depuración
    console.log('Valor de esRegistroInicial recibido:', esRegistroInicial);

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
    console.log('Insertando membresía para negocio:', provedor_negocio_id_provedor);
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

    // Solo generar credenciales si es el registro inicial (true o 'true')
    if (esRegistroInicial === true || esRegistroInicial === 'true') {
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

      return res.status(201).json({
        message: 'Pago, membresía y credenciales registrados exitosamente',
        credenciales: {
          user_name,
          password
        }
      });
    } else {
      // No generar credenciales
      return res.status(201).json({
        message: 'Pago y membresía registrados exitosamente'
      });
    }
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
    const { id_persona } = req.body;

    if (!id_persona) {
      return res.status(400).json({ error: 'ID de persona no proporcionado.' });
    }

    console.log('Recibida solicitud para generar credenciales para personaId:', id_persona);

    // Verificar si ya existen credenciales para esta persona
    const [existingUser] = await conexion.query(
      `SELECT user_name, password FROM inicio_seccion WHERE PERSONA_id_persona = ?`,
      { replacements: [id_persona] }
    );

    if (existingUser.length > 0) {
      console.log('Credenciales ya existen para personaId', id_persona, '. Devolviendo existentes.');
      // Si ya existen, devolvemos las credenciales existentes
      return res.status(200).json({
        message: 'Credenciales ya existen.',
        credentials: {
          username: existingUser[0].user_name,
          password: existingUser[0].password,
          email: null // No almacenamos email en inicio_seccion según el esquema actual
        }
      });
    }

    // Generar usuario y contraseña aleatorios
    const user_name = generarUsuarioAleatorio(); // Asegúrate de que esta función esté definida
    const password = generarPasswordAleatorio(); // Asegúrate de que esta función esté definida

    // Insertar en la tabla inicio_seccion
    console.log('Insertando nuevas credenciales para personaId:', id_persona, 'Usuario:', user_name);
    await conexion.query(
      `INSERT INTO inicio_seccion (password, user_name, PERSONA_id_persona)
       VALUES (?, ?, ?)`,
      { replacements: [password, user_name, id_persona] }
    );
    console.log('Inserción en inicio_seccion exitosa.');

    // Devolver las credenciales generadas
    res.status(201).json({
      message: 'Credenciales generadas y registradas exitosamente',
      credentials: {
        username: user_name,
        password: password,
        email: null // No almacenamos email en inicio_seccion según el esquema actual
      }
    });

  } catch (error) {
    console.error('❌ Error al generar credenciales:', error);
    res.status(500).json({ error: 'Error interno del servidor al generar credenciales.' });
  }
});

// Función para obtener el límite de productos según la membresía activa
async function getLimiteProductos(proveedorId) {
  const [rows] = await conexion.query(`
    SELECT M.limite_productos
    FROM PROVEDOR_MEMBRESIA PM
    JOIN MEMBRESIA M ON PM.MEMBRESIA_id_memebresia = M.id_memebresia
    WHERE PM.id_provedor = ? AND PM.estado = 'activa'
    ORDER BY PM.fecha_fin DESC LIMIT 1
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
      'INSERT INTO productos (nombre, descripcion, precio, tipo_producto, provedor_negocio_id_provedor, categoria, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [nombre, descripcion, precio, tipo_producto, provedor_negocio_id_provedor, categoria || null]
    );
    res.json({ id_producto: result.insertId });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error al crear el producto', details: err });
  }
});

// Ruta para login de proveedor (modificar para emitir JWT)
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

    const user = result[0];

    // Buscar el provedor_negocio_id_provedor asociado a esta persona
    const [proveedorResult] = await conexion.query(
      `SELECT id_provedor FROM provedor_negocio WHERE PERSONA_id_persona = ?`,
      { replacements: [user.PERSONA_id_persona] }
    );

    if (proveedorResult.length === 0) {
       console.warn('No se encontró proveedor asociado para la persona:', user.PERSONA_id_persona);
       return res.status(401).json({ error: 'No se encontró un proveedor asociado a este usuario.' });
    }

    const provedorId = proveedorResult[0].id_provedor;

    // Generar JWT
    const token = jwt.sign(
        { userId: user.id_login, personaId: user.PERSONA_id_persona, provedorId: provedorId },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Configurar la cookie con opciones seguras
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure solo en producción para pruebas locales
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // None en producción, Lax en desarrollo
      maxAge: 3600000, // 1 hora en milisegundos
      path: '/', // Accesible en todas las rutas
      domain: process.env.NODE_ENV === 'production' ? '.up.railway.app' : undefined // Dominio padre en producción para compartir entre subdominios
    };

    console.log('Estableciendo cookie con opciones:', cookieOptions);

    // Enviar el token en una HttpOnly cookie
    res.cookie('token', token, cookieOptions);

    // Enviar respuesta exitosa con datos básicos del usuario
    res.json({ 
      message: 'Login exitoso',
      user: {
        userId: user.id_login,
        personaId: user.PERSONA_id_persona,
        provedorId: provedorId
      }
    });

  } catch (error) {
    console.error('Error en login_proveedor con JWT:', error);
    res.status(500).json({ error: 'Error interno del servidor durante el login' });
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

// Endpoint para obtener productos de un proveedor SOLO si la membresía está activa (proteger con JWT)
app.get('/api/productos', authenticateJWT, async (req, res) => {
  const { provedor_negocio_id_provedor } = req.query;
  // Opcional: Verificar que el provedor_negocio_id_provedor solicitado coincide con el id en el token
  if (req.user.provedorId && req.user.provedorId !== parseInt(provedor_negocio_id_provedor)) {
     return res.sendStatus(403); // Prohibido
  }
  if (!provedor_negocio_id_provedor) {
    return res.status(400).json({ error: 'Falta el id del proveedor' });
  }
  try {
    // Verifica membresía activa
    const [membresia] = await db.query(
      `SELECT * FROM PROVEDOR_MEMBRESIA WHERE id_provedor = ? AND estado = 'activa' ORDER BY fecha_fin DESC LIMIT 1`,
      [provedor_negocio_id_provedor]
    );
    if (!membresia.length) {
      return res.status(403).json({ error: 'No tienes una membresía activa.' });
    }
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

// Endpoint para obtener todos los servicios publicados SOLO si la membresía está activa
app.get('/api/servicios', async (req, res) => {
  try {
    const { provedor_negocio_id_provedor } = req.query;

    let query = `
      SELECT s.* FROM SERVICIO s
      JOIN provedor_negocio pn ON s.provedor_negocio_id_provedor = pn.id_provedor
      JOIN PROVEDOR_MEMBRESIA pm ON pm.id_provedor = pn.id_provedor
      WHERE pm.estado = 'activa'
    `;
    const replacements = [];

    // Si se proporciona provedorId, añadir la condición de filtro
    if (provedor_negocio_id_provedor) {
      query += ' AND s.provedor_negocio_id_provedor = ?';
      replacements.push(provedor_negocio_id_provedor);
       console.log('✅ Solicitud GET /api/servicios filtrada por provedorId:', provedor_negocio_id_provedor);
    } else {
       // Si no se proporciona provedorId, podrías querer devolver un error o todos los servicios activos (depende de la necesidad)
       // Por ahora, mantenemos la lógica anterior de devolver todos los activos si no hay filtro.
       console.log('✅ Solicitud GET /api/servicios (todos los activos)');
    }
     query += ' ORDER BY s.fecha_creacion DESC'; // O algún otro criterio de ordenación

    const [rows] = await conexion.query(query, { replacements });

    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener los servicios:', error);
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
      'INSERT INTO SERVICIO (nombre, descripcion, tipo_servicio, precio, provedor_negocio_id_provedor, fecha_creacion) VALUES (?, ?, ?, ?, ?, NOW())',
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

// Endpoint para eliminar una imagen de producto
app.delete('/api/imagenes_productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Elimina primero las imágenes asociadas al producto
    await db.query('DELETE FROM IMAGENES_productos WHERE productos_id_productos = ?', [id]);
    // Luego elimina el producto
    const [result] = await db.query('DELETE FROM productos WHERE id_productos = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// Endpoint para eliminar una imagen de servicio
app.delete('/api/imagenes_servicio/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM IMAGENES_servicio WHERE id_imagenes = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Imagen de servicio no encontrada' });
    }
    res.json({ message: 'Imagen de servicio eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar imagen de servicio:', error);
    res.status(500).json({ error: 'Error al eliminar la imagen de servicio' });
  }
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

    // Primero intentamos insertar sin la columna leido
    try {
      const [result] = await db.query(
        'INSERT INTO Usuario (nombre, email, telefono, comentario, provedor_negocio_id_provedor) VALUES (?, ?, ?, ?, ?)',
        [nombre, email, telefono, comentario, provedor_negocio_id_provedor]
      );
      res.status(201).json({ message: 'Contacto guardado correctamente', id_user: result.insertId });
    } catch (error) {
      // Si falla, intentamos agregar la columna leido y volver a insertar
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        console.log('Agregando columna leido a la tabla Usuario...');
        await db.query('ALTER TABLE Usuario ADD COLUMN IF NOT EXISTS leido TINYINT(1) DEFAULT 0');
        
        const [result] = await db.query(
          'INSERT INTO Usuario (nombre, email, telefono, comentario, provedor_negocio_id_provedor, leido) VALUES (?, ?, ?, ?, ?, 0)',
          [nombre, email, telefono, comentario, provedor_negocio_id_provedor]
        );
        res.status(201).json({ message: 'Contacto guardado correctamente', id_user: result.insertId });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error detallado al guardar contacto:', error);
    res.status(500).json({ 
      error: 'Error al guardar el contacto',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

// Endpoint para obtener el límite de fotos según la membresía activa del proveedor (proteger con JWT)
app.get('/api/limite-fotos', authenticateJWT, async (req, res) => {
  const { provedor_negocio_id_provedor } = req.query;
  if (!provedor_negocio_id_provedor) {
    return res.status(400).json({ error: 'Falta el id del proveedor' });
  }
  try {
    // Verificar que el negocio pertenece a la persona autenticada
    const [negocios] = await db.query(
      'SELECT id_provedor FROM provedor_negocio WHERE id_provedor = ? AND PERSONA_id_persona = ?',
      [provedor_negocio_id_provedor, req.user.personaId]
    );
    if (!negocios.length) {
      return res.sendStatus(403); // Prohibido
    }
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

// Endpoint para verificar notificaciones no leídas (proteger con JWT)
app.get('/api/notificaciones/nuevas', authenticateJWT, async (req, res) => {
  const { proveedor_id } = req.query;
   // Opcional: Verificar que el proveedor_id solicitado coincide con el id en el token
  if (req.user.provedorId && req.user.provedorId !== parseInt(proveedor_id)) {
     return res.sendStatus(403); // Prohibido
  }
  if (!proveedor_id) {
    return res.status(400).json({ error: 'Falta el ID del proveedor' });
  }
  try {
    // Contar mensajes no leídos del proveedor
    const [result] = await db.query(
      'SELECT COUNT(*) as total FROM Usuario WHERE provedor_negocio_id_provedor = ? AND leido = 0',
      [proveedor_id]
    );
    res.json({ nuevas: result[0].total > 0 });
  } catch (error) {
    console.error('Error al verificar notificaciones:', error);
    res.status(500).json({ error: 'Error al verificar notificaciones' });
  }
});

// Endpoint para marcar mensajes como leídos (proteger con JWT)
app.put('/api/notificaciones/leer', authenticateJWT, async (req, res) => {
  const { proveedor_id } = req.body;
  // Opcional: Verificar que el proveedor_id solicitado coincide con el id en el token
  if (req.user.provedorId && req.user.provedorId !== parseInt(proveedor_id)) {
     return res.sendStatus(403); // Prohibido
  }
  if (!proveedor_id) {
    return res.status(400).json({ error: 'Falta el ID del proveedor' });
  }
  try {
    await db.query(
      'UPDATE Usuario SET leido = 1 WHERE provedor_negocio_id_provedor = ?',
      [proveedor_id]
    );
    res.json({ message: 'Mensajes marcados como leídos' });
  } catch (error) {
    console.error('Error al marcar mensajes como leídos:', error);
    res.status(500).json({ error: 'Error al marcar mensajes como leídos' });
  }
});

// Endpoint para eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Elimina primero las imágenes asociadas al producto
    await db.query('DELETE FROM IMAGENES_productos WHERE productos_id_productos = ?', [id]);
    // Luego elimina el producto
    const [result] = await db.query('DELETE FROM productos WHERE id_productos = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// Cambiar estado de membresía (activar/inactivar)
app.put('/api/membresias/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // 'activa', 'inactiva', 'vencida'
  if (!['activa', 'inactiva', 'vencida'].includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }
  try {
    const [result] = await conexion.query(
      'UPDATE PROVEDOR_MEMBRESIA SET estado = ? WHERE id_prov_membresia = ?',
      { replacements: [estado, id] }
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Membresía no encontrada' });
    }
    res.json({ message: `Membresía actualizada a ${estado}` });
  } catch (error) {
    console.error('Error al actualizar el estado de la membresía:', error);
    res.status(500).json({ error: 'Error al actualizar el estado de la membresía', details: error.message });
  }
});

// Endpoint para obtener todas las membresías para el panel admin
app.get('/api/membresias/admin', async (req, res) => {
  try {
    const [rows] = await conexion.query(`
      SELECT pm.*, m.nombre_pla, p.nombre_empresa, per.nombre, per.apellido
      FROM PROVEDOR_MEMBRESIA pm
      JOIN MEMBRESIA m ON pm.MEMBRESIA_id_memebresia = m.id_memebresia
      JOIN provedor_negocio p ON pm.id_provedor = p.id_provedor
      JOIN PERSONA per ON p.PERSONA_id_persona = per.id_persona
      ORDER BY pm.id_provedor, pm.fecha_fin DESC
    `);
    const hoy = new Date();
    // Solo la membresía más reciente por proveedor
    const ultimaPorProveedor = new Map();
    for (const m of rows) {
      if (!ultimaPorProveedor.has(m.id_provedor)) {
        ultimaPorProveedor.set(m.id_provedor, m);
      }
    }
    const activas = [], proximasVencer = [], vencidas = [], inactivas = [];
    for (const m of ultimaPorProveedor.values()) {
      const fechaFin = new Date(m.fecha_fin);
      const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));
      let estadoActual = (m.estado || '').toLowerCase();
      if (estadoActual === 'activo') estadoActual = 'activa';
      if (estadoActual === 'inactiva' || estadoActual === 'inactivo') {
        inactivas.push(m);
        continue;
      }
      if (diasRestantes > 7) {
        activas.push(m);
      } else if (diasRestantes > 0) {
        proximasVencer.push(m);
      } else {
        vencidas.push(m);
      }
    }
    res.json({ activas, proximasVencer, vencidas, inactivas });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener membresías' });
  }
});

// Ruta para login de administrador
app.post('/login_admin', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar que se proporcionaron las credenciales
    if (!username || !password) {
      return res.status(400).json({
        error: 'Se requieren nombre de usuario y contraseña'
      });
    }

    // Verificar credenciales fijas
    if (username === 'admin2024' && password === 'admin2024') {
      // Enviar respuesta exitosa
      res.json({
        message: 'Login exitoso',
        user: {
          id: 1,
          username: 'admin2024',
          nombre: 'Administrador',
          email: 'admin@example.com'
        }
      });
    } else {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

  } catch (error) {
    console.error('Error en login de admin:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

// Cambiar el plan de membresía de un proveedor
app.post('/cambiar_plan', async (req, res) => {
  const { proveedorId, planId } = req.body;
  try {
    // Finalizar la membresía activa actual
    await conexion.query(
      `UPDATE PROVEDOR_MEMBRESIA SET estado = 'vencida', fecha_fin = NOW() WHERE id_provedor = ? AND estado = 'activa'`,
      { replacements: [proveedorId] }
    );

    // Obtener la duración real del nuevo plan
    const [[membresia]] = await conexion.query(
      'SELECT duracion_dias FROM MEMBRESIA WHERE id_memebresia = ?',
      { replacements: [planId] }
    );
    const duracionDias = Number(membresia.duracion_dias) || 30;

    // Calcular fechas
    const fechaInicio = new Date();
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + duracionDias);
    const formatDateToMySQL = (date) => date.toISOString().slice(0, 19).replace('T', ' ');
    const fechaInicioSQL = formatDateToMySQL(fechaInicio);
    const fechaFinSQL = formatDateToMySQL(fechaFin);
    const fechaPagoSQL = formatDateToMySQL(new Date());

    // Crear la nueva membresía
    await conexion.query(
      `INSERT INTO PROVEDOR_MEMBRESIA (fecha_inicio, fecha_fin, fecha_pago, MEMBRESIA_id_memebresia, id_provedor, estado)
       VALUES (?, ?, ?, ?, ?, 'activa')`,
      { replacements: [fechaInicioSQL, fechaFinSQL, fechaPagoSQL, planId, proveedorId] }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error al cambiar el plan:', error);
    res.status(500).json({ error: 'Error al cambiar el plan' });
  }
});

// Eliminar un negocio (proveedor) y sus datos relacionados (proteger con JWT)
app.delete('/proveedores/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
   // Opcional: Verificar que el id del proveedor solicitado coincide con el id en el token
  if (req.user.provedorId && req.user.provedorId !== parseInt(id)) {
     return res.sendStatus(403); // Prohibido
  }
  try {
    // Eliminar membresías asociadas
    await conexion.query('DELETE FROM PROVEDOR_MEMBRESIA WHERE id_provedor = ?', { replacements: [id] });
    // Eliminar productos asociados
    await conexion.query('DELETE FROM productos WHERE provedor_negocio_id_provedor = ?', { replacements: [id] });
    // Eliminar servicios asociados
    await conexion.query('DELETE FROM SERVICIO WHERE provedor_negocio_id_provedor = ?', { replacements: [id] });
    // Eliminar el proveedor (negocio)
    await conexion.query('DELETE FROM provedor_negocio WHERE id_provedor = ?', { replacements: [id] });

    res.json({ message: 'Negocio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar negocio:', error);
    res.status(500).json({ error: 'Error al eliminar el negocio' });
  }
});

// Endpoint para registrar el pago de cambio de plan (proteger con JWT)
app.post('/registrar_pago_cambio_plan', async (req, res) => {
  // Esta ruta ahora manejará todo el flujo de pago y cambio de plan
  try {
    const { paymentMethodId, amount, planName, proveedorId } = req.body; // Asegúrate de que estos datos se envían desde el frontend

    console.log('✅ Solicitud de pago de cambio de plan recibida:', { paymentMethodId, amount, planName, proveedorId });

    // 1. Validar los datos recibidos
    if (!paymentMethodId || !amount || !planName || !proveedorId) {
      console.log('❌ Datos incompletos para registro de pago de cambio de plan.');
      return res.status(400).json({ success: false, error: 'Datos incompletos para procesar el cambio de plan.' });
    }

    // Asegurarse de que el monto es un número válido y positivo (Stripe espera centavos)
    const amountInCents = Math.round(amount * 100);
     if (typeof amountInCents !== 'number' || amountInCents <= 0) {
         console.log('❌ Monto inválido para cambio de plan.');
         return res.status(400).json({ success: false, error: 'Monto de pago inválido para el cambio de plan.' });
    }

    // 2. Buscar la nueva membresía por nombre del plan
    const [membresia] = await conexion.query(
        'SELECT id_memebresia, duracion_dias FROM MEMBRESIA WHERE nombre_pla = ?',
        { replacements: [planName] }
    );

    if (membresia.length === 0) {
      console.log('❌ Nueva membresía no encontrada para plan:', planName);
      return res.status(404).json({ success: false, error: 'Plan de membresía de destino no encontrado.' });
    }

    const nuevaMembresiaId = membresia[0].id_memebresia;
    const duracionDias = membresia[0].duracion_dias;
    console.log('Nueva membresía encontrada para cambio de plan:', { nuevaMembresiaId, duracionDias });

    // 3. Procesar el pago con Stripe (similar a /api/pago)
    try {
        console.log('Intentando procesar pago de cambio de plan con Stripe...');
         const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd', // Asegúrate de que esta sea la moneda correcta
            payment_method: paymentMethodId,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            },
            metadata: {
                proveedorId: proveedorId,
                planName: planName,
                nuevaMembresiaId: nuevaMembresiaId,
                tipoPago: 'cambio_plan'
            },
        });

        const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
             paymentIntent.id,
             { payment_method: paymentMethodId }
         );

        console.log('PaymentIntent de cambio de plan confirmado. Estado:', confirmedPaymentIntent.status);

        // 4. Si el pago en Stripe es exitoso (status === 'succeeded')
        if (confirmedPaymentIntent.status === 'succeeded') {
            console.log('Pago de cambio de plan en Stripe exitoso. Actualizando membresía y registrando pago...');

            // Finalizar la membresía activa actual del proveedor
            await conexion.query(
              'UPDATE PROVEDOR_MEMBRESIA SET estado = \'vencida\' WHERE id_provedor = ? AND estado = \'activa\'',
              { replacements: [proveedorId] }
            );
            console.log('Finalizada membresía activa anterior (si existía) para provedorId:', proveedorId);

            // Calcular fechas para la nueva membresía
            const fechaInicio = new Date();
            const fechaFin = new Date(fechaInicio);
            fechaFin.setDate(fechaFin.getDate() + duracionDias);

            const fechaInicioSQL = formatDateToMySQL(fechaInicio);
            const fechaFinSQL = formatDateToMySQL(fechaFin);
            const fechaPagoSQL = formatDateToMySQL(new Date()); // Fecha actual del pago

            // Crear la nueva membresía en PROVEDOR_MEMBRESIA
            await conexion.query(
              `INSERT INTO PROVEDOR_MEMBRESIA (fecha_inicio, fecha_fin, fecha_pago, MEMBRESIA_id_memebresia, id_provedor, estado)
               VALUES (?, ?, ?, ?, ?, 'activa')`,
              { replacements: [fechaInicioSQL, fechaFinSQL, fechaPagoSQL, nuevaMembresiaId, proveedorId, 'activa'] }
            );
            console.log('Nueva membresía registrada para provedorId:', proveedorId, 'MembresiaId:', nuevaMembresiaId);

            // Registrar el pago en la tabla pago
             await conexion.query(
                'INSERT INTO pago (monto, fecha_pago, monto_pago, m_e_m_b_r_e_s_i_a_id_membresia, provedor_negocio_id_provedor) VALUES (?, ?, ?, ?, ?)',
                 { replacements: [amount, fechaPagoSQL, amount, nuevaMembresiaId, proveedorId] }
            );
            console.log('Registro de pago de cambio de plan guardado en tabla pago.');

            // 5. Devolver respuesta de éxito al frontend.
            res.status(200).json({ success: true, message: 'Plan cambiado y pago registrado exitosamente.' });

        } else {
            // Pago en Stripe no exitoso (por ejemplo, requiere autenticación adicional)
            console.log('Pago de cambio de plan en Stripe no exitoso. Estado:', confirmedPaymentIntent.status);
             // Dependiendo del estado, podrías necesitar enviar información adicional al frontend para manejar 3D Secure, etc.
            res.status(400).json({ success: false, error: 'El pago de cambio de plan requiere pasos adicionales o falló.', paymentIntent: confirmedPaymentIntent });
        }

    } catch (stripeError) {
        console.error('❌ Error en la interacción con Stripe para cambio de plan:', stripeError);
        let userFacingMessage = 'Error en el procesamiento del pago de cambio de plan. Por favor, intente con otra tarjeta o contacte soporte.';
        if (stripeError.type === 'StripeCardError') {
          userFacingMessage = 'Error con la tarjeta: ' + stripeError.message;
        } else if (stripeError.type === 'StripeInvalidRequestError') {
           userFacingMessage = 'Error en la solicitud de pago: ' + stripeError.message;
        }
        res.status(500).json({ success: false, error: userFacingMessage });
    }

  } catch (error) {
    console.error('❌ Error general al registrar pago de cambio de plan:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor al registrar pago de cambio de plan.' });
  }
});

// Ruta para verificar autenticación
app.get('/api/verify-auth', authenticateJWT, (req, res) => {
  // Si el middleware authenticateJWT no lanzó un error, el usuario está autenticado
  res.json({
    isAuthenticated: true,
    user: {
      userId: req.user.userId,
      personaId: req.user.personaId,
      provedorId: req.user.provedorId
    }
  });
});

// Ruta para procesar pagos (Stripe)
app.post('/api/pago', async (req, res) => {
  try {
    const { paymentMethodId, amount, planName, personaId, provedor_negocio_id_provedor } = req.body; // Aceptar provedor_negocio_id_provedor opcionalmente

    console.log('✅ Solicitud de pago recibida para procesamiento:', { paymentMethodId, amount, planName, personaId, provedor_negocio_id_provedor });

    // 1. Validar los datos recibidos.
    // Ahora provedor_negocio_id_provedor es opcional, pero se valida más abajo
    if (!paymentMethodId || !amount || !planName || !personaId) {
      console.log('❌ Datos de pago incompletos (faltan campos obligatorios).');
      return res.status(400).json({ success: false, error: 'Datos de pago incompletos (faltan campos obligatorios).' });
    }

    // Asegurarse de que el monto es un número válido y positivo (Stripe espera centavos)
    const amountInCents = Math.round(amount * 100); // Asegúrate de que amount viene en la unidad correcta (ej. USD)
    if (typeof amountInCents !== 'number' || amountInCents <= 0) {
         console.log('❌ Monto inválido.');
         return res.status(400).json({ success: false, error: 'Monto de pago inválido.' });
    }

    // 2. Determinar el provedor_negocio_id_provedor.
    let targetProvedorId = provedor_negocio_id_provedor; // Usar el proporcionado si existe

    if (!targetProvedorId) {
      // Si no se proporcionó un ID de proveedor, buscarlo usando personaId (flujo de registro inicial)
      console.log('Provedor_negocio_id_provedor no proporcionado. Buscando por personaId:', personaId);
      const [proveedor] = await conexion.query(
        `SELECT id_provedor FROM provedor_negocio WHERE PERSONA_id_persona = ?`,
        { replacements: [personaId] }
      );

      if (proveedor.length === 0) {
        console.log('❌ Proveedor no encontrado para personaId:', personaId, '. No se pudo determinar el negocio objetivo.');
        return res.status(404).json({ success: false, error: 'Proveedor no encontrado para el usuario o negocio no especificado.' });
      }

      // En este caso (registro inicial), asumimos el primer negocio encontrado (puede ser problemático si una persona tiene varios negocios desde el inicio)
      targetProvedorId = proveedor[0].id_provedor;
      console.log('Provedor_negocio_id_provedor encontrado a través de personaId:', targetProvedorId);
    } else {
        // Verificar que el proveedorId proporcionado realmente existe y está asociado a la personaId (seguridad)
        console.log('Provedor_negocio_id_provedor proporcionado:', targetProvedorId, '. Verificando asociación con personaId:', personaId);
         const [existingProveedor] = await conexion.query(
             `SELECT id_provedor FROM provedor_negocio WHERE id_provedor = ? AND PERSONA_id_persona = ?`,
             { replacements: [targetProvedorId, personaId] }
         );

         if (existingProveedor.length === 0) {
             console.log('❌ ProvedorId proporcionado (', targetProvedorId, ') no encontrado o no coincide con personaId (', personaId, ').');
             return res.status(403).json({ success: false, error: 'Provedor especificado no válido o no pertenece al usuario autenticado.' });
         }
        console.log('ProvedorId proporcionado verificado.');
    }

    // Validar que tenemos un provedorNegocioId válido antes de continuar
    if (!targetProvedorId) {
         console.log('❌ No se pudo determinar un Provedor_negocio_id_provedor válido.');
         return res.status(400).json({ success: false, error: 'No se pudo determinar el negocio al que se asociará el pago.' });
    }

    const provedorNegocioId = targetProvedorId; // Usar el ID determinado
    console.log('Provedor Negocio ID final para el pago:', provedorNegocioId);

    // 3. Buscar el MEMBRESIA_id_memebresia basado en el planName.
    const [membresia] = await conexion.query(
        `SELECT id_memebresia, duracion_dias FROM MEMBRESIA WHERE nombre_pla = ?`,
        { replacements: [planName] }
    );

    if (membresia.length === 0) {
      console.log('❌ Membresía no encontrada para plan:', planName);
      return res.status(404).json({ success: false, error: 'Plan de membresía no encontrado.' });
    }

    const membresiaId = membresia[0].id_memebresia;
    const duracionDias = membresia[0].duracion_dias;
    console.log('Membresía encontrada:', { membresiaId, duracionDias });

    // 4. Crear y confirmar un PaymentIntent con Stripe usando el paymentMethodId.
    try {
        console.log('Intentando crear PaymentIntent con PaymentMethod:', paymentMethodId, 'y monto:', amountInCents);
        // Primero, crea un PaymentIntent sin confirmarlo automáticamente
         const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd', // Asegúrate de que esta sea la moneda correcta
            payment_method: paymentMethodId,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            },
            metadata: {
                personaId: personaId,
                provedorNegocioId: provedorNegocioId,
                planName: planName,
                membresiaId: membresiaId
            },
             // Opcional: agregar un customer si manejas usuarios en Stripe
            // customer: 'cus_XXXXXXXXXXXX',
        });

        console.log('PaymentIntent creado:', paymentIntent.id);

         // Luego, confirma el PaymentIntent usando el PaymentMethod
         const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
             paymentIntent.id,
             { payment_method: paymentMethodId }
         );

        console.log('PaymentIntent confirmado. Estado:', confirmedPaymentIntent.status);

        // 5. Si el pago en Stripe es exitoso (status === 'succeeded').
        if (confirmedPaymentIntent.status === 'succeeded') {
            console.log('Pago en Stripe exitoso. Guardando en BD...');

            // Guardar registro en la tabla `pago`
            const fechaActual = new Date();
            const fechaPagoSQL = formatDateToMySQL(fechaActual); // Asegúrate de que formatDateToMySQL esté definida y disponible

            await conexion.query(
                `INSERT INTO pago (monto, fecha_pago, monto_pago, m_e_m_b_r_e_s_i_a_id_membresia, provedor_negocio_id_provedor)
                 VALUES (?, ?, ?, ?, ?)`,
                { replacements: [amount, fechaPagoSQL, amount, membresiaId, provedorNegocioId] } // Usar provedorNegocioId determinado
            );
            console.log('Registro de pago guardado con provedorNegocioId:', provedorNegocioId);

            // Guardar registro en la tabla `PROVEDOR_MEMBRESIA`
            const fechaInicio = new Date();
            const fechaFin = new Date(fechaInicio);
            fechaFin.setDate(fechaFin.getDate() + duracionDias); // Suma los días reales del plan

            const fechaInicioSQL = formatDateToMySQL(fechaInicio);
            const fechaFinSQL = formatDateToMySQL(fechaFin);

             // Opcional: Finalizar membresía activa anterior si existe
             await conexion.query(
                `UPDATE PROVEDOR_MEMBRESIA SET estado = 'vencida' WHERE id_provedor = ? AND estado = 'activa'`,
                { replacements: [provedorNegocioId] }
             );
             console.log('Finalizada membresía activa anterior (si existía).');

            await conexion.query(
                `INSERT INTO PROVEDOR_MEMBRESIA (fecha_inicio, fecha_fin, fecha_pago, MEMBRESIA_id_memebresia, id_provedor, estado)
                 VALUES (?, ?, ?, ?, ?, 'activa')`,
                { replacements: [fechaInicioSQL, fechaFinSQL, fechaPagoSQL, membresiaId, provedorNegocioId, 'activa'] } // Usar provedorNegocioId determinado
            );
             console.log('Registro de membresía guardado con provedorNegocioId:', provedorNegocioId);

            // 6. Devolver respuesta de éxito al frontend.
            // Redirigir a la página de confirmación específica para nuevo negocio
            res.status(200).json({ success: true, message: 'Pago procesado y registrado exitosamente.', redirectTo: '/confirmacion-nuevo-negocio' }); // Indicar al frontend a dónde redirigir

        } else {
            // Pago en Stripe no exitoso (por ejemplo, requiere autenticación adicional)
            console.log('Pago en Stripe no exitoso. Estado:', confirmedPaymentIntent.status);
            // Dependiendo del estado, podrías necesitar enviar información adicional al frontend para manejar 3D Secure, etc.
            res.status(400).json({ success: false, error: 'El pago requiere pasos adicionales o falló.', paymentIntent: confirmedPaymentIntent });
        }

    } catch (stripeError) {
        console.error('❌ Error en la interacción con Stripe:', stripeError);
        let userFacingMessage = 'Error en el procesamiento del pago. Por favor, intente con otra tarjeta o contacte soporte.';
        if (stripeError.type === 'StripeCardError') {
          userFacingMessage = 'Error con la tarjeta: ' + stripeError.message;
        } else if (stripeError.type === 'StripeInvalidRequestError') {
           userFacingMessage = 'Error en la solicitud de pago: ' + stripeError.message;
        }
        res.status(500).json({ success: false, error: userFacingMessage });
    }

  } catch (error) {
    console.error('❌ Error general al procesar pago en /api/pago:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor al procesar el pago.' });
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

    // Verificar y agregar columna leido si no existe (compatible con MySQL)
    try {
      const [columns] = await db.query(`SHOW COLUMNS FROM Usuario LIKE 'leido'`);
      if (columns.length === 0) {
        await db.query(`ALTER TABLE Usuario ADD COLUMN leido TINYINT(1) DEFAULT 0`);
        console.log('✅ Columna leido agregada correctamente');
      } else {
        console.log('✅ Columna leido ya existe');
      }
    } catch (error) {
      console.error('❌ Error al verificar/agregar columna leido:', error);
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

// Endpoint para obtener el conteo de publicaciones (productos y servicios) por proveedor
app.get('/api/publicaciones-count', async (req, res) => {
  try {
    const { provedorId } = req.query;

    if (!provedorId) {
      console.log('❌ ID de proveedor no proporcionado en /api/publicaciones-count');
      return res.status(400).json({ error: 'ID de proveedor es requerido.' });
    }

    console.log('✅ Solicitud de conteo de publicaciones para provedorId:', provedorId);

    // Contar productos para este proveedor
    const [productosResult] = await conexion.query(
      'SELECT COUNT(*) as total FROM productos WHERE provedor_negocio_id_provedor = ?',
      { replacements: [provedorId] }
    );
    const totalProductos = productosResult[0].total;

    // Contar servicios para este proveedor
    const [serviciosResult] = await conexion.query(
      'SELECT COUNT(*) as total FROM SERVICIO WHERE provedor_negocio_id_provedor = ?',
      { replacements: [provedorId] }
    );
    const totalServicios = serviciosResult[0].total;

    // Obtener límites de membresía
     let limiteProductos = 0;
     let limiteServicios = 0;
     try {
       const [membresia] = await conexion.query(`
         SELECT M.limite_productos, M.limite_servicios
         FROM PROVEDOR_MEMBRESIA PM
         JOIN MEMBRESIA M ON PM.MEMBRESIA_id_memebresia = M.id_memebresia
         WHERE PM.id_provedor = ? AND PM.estado = 'activa'
         ORDER BY PM.fecha_fin DESC LIMIT 1
       `, { replacements: [provedorId] });

       if (membresia.length > 0) {
         limiteProductos = membresia[0].limite_productos || 0;
         limiteServicios = membresia[0].limite_servicios || 0;
       }
     } catch(membresiaError) {
        console.error('Error al obtener límites de membresía en conteo de publicaciones:', membresiaError);
        // Continuar aunque no se puedan obtener límites
     }

    console.log('Resultados de conteo para provedorId', provedorId, ':', { productos: totalProductos, servicios: totalServicios, limite_productos: limiteProductos, limite_servicios: limiteServicios });

    // Devolver los conteos como JSON
    res.status(200).json({
      productos: totalProductos,
      servicios: totalServicios,
      limite_productos: limiteProductos,
      limite_servicios: limiteServicios
    });

  } catch (error) {
    console.error('❌ Error al obtener conteo de publicaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener conteo de publicaciones.' });
  }
});

// Ruta para obtener negocios por ID de Persona (para la sección "Mis Negocios")
app.get('/api/persona/:personaId/negocios', authenticateJWT, async (req, res) => {
  try {
    const { personaId } = req.params;

    // Opcional: Verificar que el personaId solicitado coincide con el id en el token (para seguridad)
    if (req.user.personaId && req.user.personaId !== parseInt(personaId)) {
       return res.sendStatus(403); // Prohibido si el token no corresponde a esta persona
    }

    console.log('✅ Solicitud GET /api/persona/:personaId/negocios recibida para personaId:', personaId);

    const [negocios] = await conexion.query(
      'SELECT * FROM provedor_negocio WHERE PERSONA_id_persona = ?',
      { replacements: [personaId] }
    );

    console.log(`✅ Encontrados ${negocios.length} negocios para personaId ${personaId}`);

    // Devolver la lista de negocios (puede ser vacía si no hay ninguno)
    res.json(negocios);

  } catch (error) {
    console.error('❌ Error al obtener negocios por personaId:', error);
    res.status(500).json({ error: 'Error al obtener los negocios de la persona' });
  }
});

startServer();
