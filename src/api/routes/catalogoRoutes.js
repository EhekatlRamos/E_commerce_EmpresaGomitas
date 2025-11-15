    import express from 'express';
    import { obtenerProducto, crearVentas, iniciarSesion, registrar, recuperarContrasena } from '../controllers/catalogoController.js';
    const router=express.Router();
    //Endpoints
    router.get('/productos',obtenerProducto);
    router.post('/ventas',crearVentas);
    router.post('/iniciar-sesion', iniciarSesion);
    router.post('/registro', registrar);
    router.post('/recuperar-contrasena', recuperarContrasena);
    export default router;