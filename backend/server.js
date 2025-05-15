// backend/server.js
import express from 'express';
import conexion from './db.js';
import { Proveedor } from './Models/Proveedor.js';
import { PERSONA } from './Models/Persona.js';

const app = express();
const PORT = 3000;

console.log('Conectando a la base de datos...');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

app.get('/proveedores', async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    res.json(proveedores);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error al obtener los proveedores' });
  }
});

app.get('/persona', async (req, res) => {
  try {
    const personas = await PERSONA.findAll();
    res.json(personas);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error al obtener los proveedores' });
  }
});

app.post('/crear_proveedores', async (req, res) => {
  try {
    const {
      nombre_empresa,
      email_empresa,
      telefono_empresa,
      tipo_servicio,
      fecha_creacion,
      direccion,
      redes_sociales,
      PERSONA_cedula,
    } = req.body;

    // Validación básica
    if (!nombre_empresa || !email_empresa || !telefono_empresa || !tipo_servicio || !direccion || !PERSONA_cedula) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevoProveedor = await Proveedor.create({
      nombre_empresa,
      email_empresa,
      telefono_empresa,
      tipo_servicio,
      fecha_creacion: fecha_creacion ? new Date(fecha_creacion) : new Date(), // Si no viene, se asigna la fecha actual
      direccion,
      redes_sociales,
      PERSONA_id_persona: PERSONA_cedula, // Asegúrate de que este campo coincida con el modelo
    });

    console.log('Proveedor creado:', nuevoProveedor);
    res.status(201).json({ message: 'Proveedor creado con éxito', proveedor: nuevoProveedor });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ error: 'Error al crear el proveedor' });
  }
});

async function startServer() {
  try {
    await conexion.authenticate();
    console.log('Conectado a la base de datos.');

    // Sincronizar modelos (opcional, solo si necesitas crear tablas automáticamente)
    await conexion.sync();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
}

startServer();