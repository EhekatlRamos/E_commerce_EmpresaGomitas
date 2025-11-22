import db from '../config/db.js'
import nodemailer from 'nodemailer'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 1. CONFIGURACIÓN DE MULTER (Subida de imágenes) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Asegúrate de crear manualmente la carpeta 'uploads' en src/api/
        const rutaDestino = path.join(__dirname, '../uploads'); 
        cb(null, rutaDestino);
    },
    filename: function (req, file, cb) {
        const nombreLimpio = file.originalname.replace(/\s+/g, '-');
        cb(null, Date.now() + '-' + nombreLimpio);
    }
});

export const upload = multer({ storage: storage });

// --- 2. FUNCIONES DEL CRUD ---

// LEER (GET)
export const obtenerProducto = (req, res) => {
    const sql = 'SELECT * FROM gomita WHERE Vigencia = 1'; 
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener productos', err);
            return res.status(500).json({ error: 'Error al obtener productos' })
        }
        
        const productosMapeados = results.map(p => ({
            id: p.id,
            nombre: p.nombre,
            precio: p.precio,
            descripcion: p.descripcion,
            imagen: p.imagen,
            // Mapeamos la columna de la BD 'Stocks' a la propiedad del frontend 'stock'
            stock: p.Stocks, 
            imagenUrl: null // Dejamos que el frontend decida la ruta
        }));
        res.json(productosMapeados);
    });
};

// CREAR (POST)
export const crearProducto = (req, res) => {
    const { nombre, precio, descripcion, stock } = req.body;
    
    // LÓGICA DE IMAGEN POR DEFECTO:
    // Si req.file existe, usamos su nombre (se guardará en uploads/).
    // Si no existe, guardamos 'image'. Tu HTML detectará que no tiene extensión 
    // y buscará automáticamente 'assets/image.png'.
    const imagen = req.file ? req.file.filename : 'image';

    // Validación de datos básicos
    if (!nombre || !precio) {
        return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    const sql = 'INSERT INTO gomita (nombre, precio, descripcion, Stocks, imagen, Vigencia) VALUES (?, ?, ?, ?, ?, 1)';
    
    db.query(sql, [nombre, precio, descripcion, stock, imagen], (err, result) => {
        if (err) {
            console.error('Error al crear:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Creado con éxito', id: result.insertId });
    });
};

// EDITAR (PUT)
export const editarProducto = (req, res) => {
    const { id } = req.params;
    const { nombre, precio, descripcion, stock } = req.body;
    
    if (req.file) {
        // Si hay imagen nueva
        const nuevaImagen = req.file.filename;
        const sql = 'UPDATE gomita SET nombre = ?, precio = ?, descripcion = ?, Stocks = ?, imagen = ? WHERE id = ?';
        
        db.query(sql, [nombre, precio, descripcion, stock, nuevaImagen, id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Producto actualizado con imagen' });
        });
    } else {
        // Si no hay imagen nueva (solo texto)
        const sql = 'UPDATE gomita SET nombre = ?, precio = ?, descripcion = ?, Stocks = ? WHERE id = ?';
        
        db.query(sql, [nombre, precio, descripcion, stock, id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Producto actualizado sin imagen' });
        });
    }
};

// ELIMINAR LÓGICO (PUT)
export const darBajaProducto = (req, res) => {
    const { id } = req.params;
    const sql = 'UPDATE gomita SET Vigencia = 0 WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al dar de baja:', err);
            return res.status(500).json({ error: 'Error al eliminar' });
        }
        res.json({ message: 'Producto eliminado correctamente' });
    });
};
export const crearVentas = (req, res) => {
  const { total } = req.body;
  if (!total) return res.status(400).json({ error: 'Falta el total' });

  const subtotal = Number(total);
  const iva = +(subtotal * 0.16).toFixed(2);
  const metodoPago = 'Paypal';
  const clienteId = 1;

  const sql = `INSERT INTO venta (Subtotal, Iva, Hora, Fecha, Metodo_P, Cliente) VALUES (?, ?, CURTIME(), CURDATE(), ?, ?)`;

    db.query(sql, [subtotal, iva, metodoPago, clienteId], (err, result) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al crear la venta' });
    }
    res.json({ message: 'Venta creada correctamente', idVenta: result.insertId });
    });
};

export const iniciarSesion = (req, res) => {
    const {username, password} = req.body;
    const sql = `SELECT * FROM usuario WHERE Nombre = ? AND Contrasena = ? `;
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al iniciar sesion' });
        res.json(result);
    });
};

export const registrar = (req, res) => {
    const {username, password, email, rol} = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Faltan datos' });
    
    const sql1 = ` SELECT * from usuario WHERE Nombre = ?`;
    db.query(sql1, [username], (err, result1) => {
        if (err) return res.status(500).json({ error: 'Error al verificar usuario' });
        if (result1.length > 0) return res.status(409).json({ error: 'Usuario ya registrado' });

        const sql2 = `INSERT INTO usuario (Nombre, Contrasena, CorreoElectronico, Rol) VALUES (?, ?, ?, ?)`;
        db.query(sql2, [username, password, email, rol], (err2, result2) => {
            if (err2) return res.status(500).json({ error: 'Error al crear usuario' });
            return res.status(201).json({ message: 'Usuario creado', idUsuario: result2.insertId });
        });
    }); 
}

export const recuperarContrasena = async (req,res)=> {
    const {username, email} = req.body;
    if (!username || !email) return res.status(400).json({ error: 'Faltan datos' });

    const sql='SELECT Contrasena FROM usuario WHERE Nombre = ? AND CorreoElectronico = ?';
    try{
        const results = await new Promise((resolve, reject) => {
            db.query(sql,[username, email],(err,results)=>{
                if(err) return reject(err);
                resolve(results);
            });
        });
    
        if(!results || results.length === 0){
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        const password = results[0].Contrasena;
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "guapopreciososalameckel@gmail.com",
                pass: "ohqq dnqr njxj gsxr", 
            },
        });
        
        const info = await transporter.sendMail({
            from: 'Salameck <guapopreciososalameckel@gmail.com>',
            to: email,
            subject: "Recuperar contraseña",
            text: `Tu contraseña es: ${password}`,
            html: `<b>Tu contraseña es: ${password}</b>`,
        });

        console.log("Message sent:", info.messageId);
        res.json({ ok: true, messageId: info.messageId });

    }catch(error){
        console.error("Error en recuperarContrasena:", error);
        return res.status(500).json({ ok: false, error: error.message });
    }
}