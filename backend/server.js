// backend/server.js
import express from 'express';
import conexion from './db.js';
import { Proveedor } from './Models/Proveedor.js';
import { Persona } from './Models/Persona.js';

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
    const personas = await Persona.findAll();
    res.json(personas);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error al obtener los proveedores' });
  }
});
app.post('/crear_proveedores', async (req, res) => {
    try {
        const {
            id_proveedor,
            nombre_empresa,
            email_empresa,
            telefono_empresa,
            tipo_servicio,
            fecha_creacion, // opcional
            direccion,
            redes_sociales,
            PERSONA_cedula
        } = req.body;

        // Validación básica (puedes agregar más según necesidades)
        if (!id_proveedor || !nombre_empresa || !email_empresa || !telefono_empresa || !tipo_servicio || !direccion || !PERSONA_cedula) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const nuevoProveedor = await Proveedor.create({
          id_proveedor,
            nombre_empresa,
            email_empresa,
            telefono_empresa,
            tipo_servicio,
            fecha_creacion: fecha_creacion ? new Date(fecha_creacion) : new Date(), // si no viene, se asigna la actual
            direccion,
            redes_sociales,
            PERSONA_cedula
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

    // Opcional: sincronizar modelos si quieres crear tablas automáticamente
    // await conexion.sync();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
}

startServer();