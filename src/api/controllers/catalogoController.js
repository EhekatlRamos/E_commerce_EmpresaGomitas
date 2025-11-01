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

