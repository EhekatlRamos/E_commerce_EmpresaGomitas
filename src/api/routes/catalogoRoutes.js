import express from 'express';
import { 
    obtenerProducto, 
    crearProducto, 
    editarProducto, 
    darBajaProducto, 
    crearVentas, 
    iniciarSesion, 
    registrar, 
    recuperarContrasena, 
    upload, // Importamos el middleware de carga
    editarUser,
} from '../controllers/catalogoController.js';

const router = express.Router();

// --- Rutas de Productos ---
router.get('/productos', obtenerProducto);
router.post('/productos', upload.single('imagen'), crearProducto); // Crear
router.put('/productos/:id', upload.single('imagen'), editarProducto); // Editar
router.put('/productos/baja/:id', darBajaProducto); // Eliminar
// --- Otras Rutas ---
router.post('/ventas', crearVentas);
router.post('/iniciar-sesion', iniciarSesion);
router.post('/registro', registrar);
router.post('/recuperar-contrasena', recuperarContrasena);
router.put('/usuario/:id', editarUser);

export default router;