// backend/server.js
import express from 'express';
import conexion from './db.js';
import { Proveedor } from './Models/Proveedor.js';

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