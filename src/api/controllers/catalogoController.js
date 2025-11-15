import db from '../config/db.js'

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

// controllers/catalogoController.js (simplificado)
export const iniciarSesion = (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM usuario WHERE Nombre = ? LIMIT 1`;
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Error en servidor' });
    if (!results || results.length === 0) return res.status(401).json({ success: false, message: 'Usuario no encontrado' });

    const user = results[0];
    // si usas bcrypt:
    const ok = /* await bcrypt.compare(password, user.Contrasena) */ (password === user.Contrasena);
    if (!ok) return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });

    // devuelve datos mínimos (sin contraseña)
    return res.json({
      success: true,
      user: { id: user.idUsuario, nombre: user.Nombre, rol: user.Rol }
    });
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
