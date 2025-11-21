import db from '../config/db.js'
import nodemailer from 'nodemailer'
import multer from 'multer'
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const obtenerProducto = (req,res)=>{
    const sql='SELECT * FROM gomita';
    db.query(sql,(err,results)=>{
        if(err){
            console.error('Error al obtener productos',err);
            return res.status(500).json({error: 'Error al obtener productos'})
        }
        res.json(results);
    });
};
export const crearVentas = (req, res) => {
  const { total } = req.body;

  if (!total) {
    return res.status(400).json({ error: 'Falta el total de la venta' });
  }

  const subtotal = Number(total);
  const iva = +(subtotal * 0.16).toFixed(2); // 16% IVA
  const metodoPago = 'Paypal';
  const clienteId = 1;

  const sql = `
    INSERT INTO venta (Subtotal, Iva, Hora, Fecha, Metodo_P, Cliente)
    VALUES (?, ?, CURTIME(), CURDATE(), ?, ?)
    `;

    db.query(sql, [subtotal, iva, metodoPago, clienteId], (err, result) => {
    if (err) {
        console.error(err); // Aquí verás el error real
        return res.status(500).json({ error: 'Error al crear la venta' });
    }
    res.json({ message: 'Venta creada correctamente', idVenta: result.insertId });
    });
};
export const iniciarSesion = (req, res) => {
    const {username, password} = req.body;
    const sql = `SELECT * FROM usuario WHERE Nombre = ? AND Contrasena = ? `;
    db.query(sql, [username, password], (err, result) => {
        if (err) {
        console.error(err); // Aquí verás el error real
        return res.status(500).json({ error: 'Error al iniciar sesion' });
    }
    res.json(result);
    
    });
};
export const registrar = (req, res) => {
    const {username, password, email, rol} = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    
    const sql1 = ` SELECT * from usuario WHERE Nombre = ?`;
    db.query(sql1, [username], (err, result1) => {
        if (err) {
            console.error('Error en validación:', err);
            return res.status(500).json({ error: 'Error al verificar usuario' });
        }

        if (result1.length > 0) {
            // Ya existe un usuario con ese nombre
            return res.status(409).json({ error: 'El nombre de usuario ya está registrado' });
        }

        const sql2 = `
        INSERT INTO usuario (Nombre, Contrasena, CorreoElectronico, Rol)
        VALUES (?, ?, ?, ?)`;

        db.query(sql2, [username, password, email, rol], (err2, result2) => {
            if (err2) {
            console.error(err2); // Aquí verás el error real
            return res.status(500).json({ error: 'Error al crear el usuario' });
            }
            return res.status(201).json({
                message: 'Usuario creado correctamente',
                idUsuario: result2.insertId
            });
        });
    }); 
}
export const recuperarContrasena = async (req,res)=> {
    const {username, email} = req.body;
    if (!username || !email) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
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
    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "guapopreciososalameckel@gmail.com",
            pass: "ohqq dnqr njxj gsxr", 
        },
    });
    try {
        const info = await transporter.sendMail({
            from: 'Salameck <guapopreciososalameckel@gmail.com>',
            to: email,
            subject: "Recuperar contraseña",
            text: `Tu contraseña es: ${password}`,
            html: `<b>Tu contraseña es: ${password}</b>`,
        });

        console.log("Message sent:", info.messageId);
        res.json({ ok: true, messageId: info.messageId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: error.message });
    }
    transporter.sendMail(info, (error, detalles) => {
        if (error) {
            console.log("Error al enviar el correo:", error);
        } else {
            console.log("Correo enviado para recuperación");
            console.log("Detalles:", detalles);
        }
    });
    }catch(error){
        console.error("Error en recuperarContrasena:", error);
        return res.status(500).json({ ok: false, error: error.message });
    }
}
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        const rutaDestino = path.join(process.cwd(), 'public/uploads');
        cb(null, rutaDestino);
    },
    filename: function (req, file, cb) {
        const nombreLimpio = file.originalname.replace(/\s+/g, '-');
        cb(null, Date.now() + '-' + nombreLimpio);
    }
});
export const upload = multer({ storage: storage });

export const actualizarImagenGomita = (req, res) => {
    const id = req.params.id;

    if(!req.file){
        return res.status(400).send({message: 'No se ha subido ninguna imagen'});
    }

    const nombreImagen = req.file.filename;

    const query = 'UPDATE gomita SET imagen = ? WHERE id = ?';


    db.query(query, [nombreImagen, id], (err, result) => {
        if(err){
            console.error('Error al actualizar la base de datos', err);
            return res.status(500).send({message: 'Error de base de datos'})
        }
        res.send({
            message: 'Imagen actualizada correctamente',
            imagen: nombreImagen, 
            rutaCompleta: `http://localhost:3000/uploads/${nombreImagen}`
        });
    });
}