// backend/server.js
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

import conexion, { testConnection } from './db.js';
import { Proveedor } from './Models/Proveedor.js';
import { PERSONA } from './Models/Persona.js';

const app = express();
const PORT = process.env.PORT || 3000;
const stripe = Stripe('sk_test_51RPQBGH99ZRyC1yofIHLx7g4x9qQV9fPoRNC8bAlxM2kIrUSKvDO5lcuHPINVUQ1PrknbXMbgcZ1CB6aWjYunOIC00PhriOz2t');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});


app.post('/create-checkout-session', async (req, res) => {
  const { plan, email } = req.body;

  // Reemplaza estos IDs por los de tus productos/precios reales en Stripe
  const prices = {
    basico: 'price_xxx',      // <-- Cambia esto por el ID real de tu precio en Stripe
    destacado: 'price_yyy',
    premium: 'price_zzz'
  };

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: prices[plan], // El ID del precio de Stripe
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: 'http://localhost:5173/pago-exitoso',
      cancel_url: 'http://localhost:5173/pago-cancelado',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
      PERSONA_id_persona
    } = req.body;

    // Log de datos recibidos
    console.log('📝 Datos recibidos:', req.body);

    // Validación de campos requeridos
    const camposFaltantes = [];
    if (!nombre_empresa) camposFaltantes.push('nombre de empresa');
    if (!email_empresa) camposFaltantes.push('email de empresa');
    if (!telefono_empresa) camposFaltantes.push('teléfono de empresa');
    if (!tipo_servicio) camposFaltantes.push('tipo de servicio');
    if (!direccion) camposFaltantes.push('dirección');
    if (!PERSONA_id_persona) camposFaltantes.push('id de persona');

    if (camposFaltantes.length > 0) {
      console.log('❌ Campos faltantes:', camposFaltantes);
      return res.status(400).json({
        error: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`
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

    // Verificar si la persona existe
    const personaExistente = await PERSONA.findByPk(PERSONA_id_persona);
    if (!personaExistente) {
      console.log('❌ Persona no encontrada:', PERSONA_id_persona);
      return res.status(400).json({
        error: 'La persona asociada no existe'
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
      p_e_r_s_o_n_a_id_persona: PERSONA_id_persona
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
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Ya existe una empresa con estos datos'
      });
    }
    
    // Error general del servidor
    res.status(500).json({
      error: 'Error interno del servidor',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
