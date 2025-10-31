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
    const { total } = req.body; // datos que vienen del frontend

    if (!total) {
        return res.status(400).json({ error: 'Falta el total de la venta' });
    }
    const iva = total * 0.16; // calcula el IVA (ejemplo 16%)
    const metodoPago = 'Paypal';
    const clienteId = 1;
    const sql='INSERT INTO ventas (Subtotal, Iva, Hora, Fecha, Metodo_P, Cliente) VALUES (?, ?, CURTIME(), CURDATE(), ?, ?)';
    db.query(sql, [total], (err, result) => {
        if (err) {
            console.error('Error al crear venta', err);
            return res.status(500).json({ error: 'Error al crear la venta' });
        }
        res.json({ message: 'Venta creada correctamente', idVenta: result.insertId });
    });
};
