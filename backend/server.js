// backend/server.js
import express from 'express';
import cors from 'cors';
import conexion, { testConnection } from './db.js';
import { Proveedor } from './Models/Proveedor.js';
import { PERSONA } from './Models/Persona.js';
import stripe from './config/stripe.js';
import { Pago } from './Models/Pago.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

    // Crear la membresía en PROVEDOR_MEMBRESIA
    const fechaInicio = new Date(fecha_pago);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 30); // Puedes ajustar según la duración real del plan

    const fechaInicioSQL = formatDateToMySQL(fechaInicio);
    const fechaFinSQL = formatDateToMySQL(fechaFin);
    const fechaPagoSQL = formatDateToMySQL(new Date(fecha_pago));

    await conexion.query(
      `INSERT INTO PROVEDOR_MEMBRESIA (fecha_inicio, fecha_fin, fecha_pago, MEMBRESIA_id_memebresia, id_provedor)
       VALUES (?, ?, ?, ?, ?)`,
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
    WHERE PM.id_provedor = ? AND PM.estado = 'activo'
    ORDER BY PM.fecha_inicio DESC LIMIT 1
  `, { replacements: [proveedorId] });
  return rows.length > 0 ? rows[0].limite_productos : 0;
}

// Endpoint para crear producto
app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, descripcion, precio, tipo_producto, provedor_negocio_id_provedor, categoria } = req.body;

    // 1. Verifica cuántos productos tiene el proveedor
    const [productos] = await conexion.query(
      'SELECT COUNT(*) as total FROM productos WHERE provedor_negocio_id_provedor = ?',
      { replacements: [provedor_negocio_id_provedor] }
    );
    const totalProductos = productos[0].total;

    // 2. Obtén el límite según la membresía
    const limite = await getLimiteProductos(provedor_negocio_id_provedor);

    if (limite > 0 && totalProductos >= limite) {
      return res.status(403).json({ error: 'Has alcanzado el límite de productos según tu membresía.' });
    }

    // 3. Inserta el producto
    const [result] = await conexion.query(
      'INSERT INTO productos (nombre, descripcion, precio, tipo_producto, provedor_negocio_id_provedor, categoria) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, tipo_producto, provedor_negocio_id_provedor, categoria]
    );
    
    res.json({ success: true, id_producto: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el producto.' });
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

    res.json({ message: 'Login exitoso', user });
  } catch (error) {
    console.error('Error en login_proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
