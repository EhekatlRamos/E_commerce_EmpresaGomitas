    import express from 'express';
    import { obtenerProducto, crearVentas, iniciarSesion, registrar, recuperarContrasena, upload, actualizarImagenGomita } from '../controllers/catalogoController.js';
    const router=express.Router();
    //Endpoints

    router.get('/productos',obtenerProducto);
    router.post('/ventas',crearVentas);
    router.post('/iniciar-sesion', iniciarSesion);
    router.post('/registro', registrar);
    router.post('/recuperar-contrasena', recuperarContrasena);
    router.post('/gomitas/upload/:id', upload.single('imagen'), actualizarImagenGomita);
    
    export default router;