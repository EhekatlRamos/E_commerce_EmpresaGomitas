import db from '../config/db.js'
export const obtenerProducto = (req,res)=>{
    const sql='SELECT * FROM productos';
    db.query(sql,(err,results)=>{
        if(err){
            console.error('Error al obtener productos',err);
            return res.status(500).json({error: 'Error al obtener productos'})
        }
        res.json(results);
    });
};
db.connect((err)=>{
    if(err){
        console.error('Error al conectar',err);
    }else{
        console.log('Conectado correctamente');
    }
});
export default db;