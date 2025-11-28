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
    upload 
} from '../controllers/catalogoController.js';

const router = express.Router();

router.get('/productos', obtenerProducto);
router.post('/productos', upload.single('imagen'), crearProducto); 
router.put('/productos/:id', upload.single('imagen'), editarProducto); 
router.put('/productos/baja/:id', darBajaProducto);

router.post('/ventas', crearVentas);
router.post('/iniciar-sesion', iniciarSesion);
router.post('/registro', registrar);
router.post('/recuperar-contrasena', recuperarContrasena);

export default router;