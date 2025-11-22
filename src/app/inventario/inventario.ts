import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../service/producto.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css'
})
export class InventarioComponent implements OnInit {
  productos: any[] = [];
  // Diccionario para guardar temporalmente las nuevas imágenes: { idProducto: Archivo }
  imagenesSeleccionadas: { [id: number]: File } = {};
  
  // Array para guardar los IDs que se eliminarán de la BD al guardar
  productosEliminados: number[] = [];

  constructor(private productoService: ProductService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  async cargarProductos() {
    try {
      this.productos = await this.productoService.getProducts();
      // Limpiamos la papelera al cargar de nuevo para evitar errores
      this.productosEliminados = []; 
    } catch (error) {
      console.error('Error cargando productos:', error);
      alert('No se pudo cargar el inventario. Revisa que el servidor esté encendido.');
    }
  }

  // Agrega una fila vacía al principio
  agregarFila() {
    const nuevoProducto = {
      id: 0, // El ID 0 indica que es un producto NUEVO
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      imagen: '', 
      imagenUrl: null 
    };
    this.productos.unshift(nuevoProducto);
  }

  // --- AQUÍ ESTÁ LA CORRECCIÓN DEL ERROR ---
  // Ahora aceptamos DOS parámetros: event y idProducto
  onFileSelected(event: any, idProducto: number) {
    const file = event.target.files[0];
    
    if (file) {
      // Guardamos el archivo real para enviarlo luego
      this.imagenesSeleccionadas[idProducto] = file;

      // Generamos la vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Buscamos el producto en la lista visual para mostrar la foto
        const producto = this.productos.find(p => p.id === idProducto);
        if (producto) {
          producto.imagenUrl = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Elimina el producto de la vista y lo marca para borrado en BD
  eliminarFila(index: number, id: number) {
    const confirmar = confirm('Este producto se marcará para eliminar al guardar los cambios. ¿Continuar?');
    if (!confirmar) return;

    // 1. Si el producto tiene ID real (>0), lo anotamos para borrarlo de la BD
    if (id > 0) {
        this.productosEliminados.push(id);
    } 
    
    // 2. Lo quitamos de la vista inmediatamente usando el índice
    this.productos.splice(index, 1);
  }

  // --- FUNCIÓN PRINCIPAL DE GUARDADO ---
  async guardarTodo() {
    // 1. VALIDACIÓN DE DATOS
    for (let i = 0; i < this.productos.length; i++) {
        const prod = this.productos[i];
        
        if (!prod.nombre || prod.nombre.toString().trim() === '') {
            alert(`⚠️ ERROR: El producto en la fila ${i + 1} no tiene NOMBRE.`);
            return;
        }
        if (prod.precio === null || prod.precio === undefined || prod.precio <= 0) {
            alert(`⚠️ ERROR: El producto "${prod.nombre}" tiene un PRECIO inválido.`);
            return;
        }
        if (prod.stock === null || prod.stock === undefined || prod.stock < 0) {
            alert(`⚠️ ERROR: El producto "${prod.nombre}" tiene un STOCK inválido.`);
            return;
        }
    }

    // 2. PROCESAMIENTO DE CAMBIOS
    const peticiones: Promise<any>[] = [];

    // A) BAJAS (Eliminados)
    this.productosEliminados.forEach(id => {
        peticiones.push(this.productoService.eliminarProducto(id));
    });

    // B) ALTAS Y CAMBIOS
    this.productos.forEach(prod => {
        const archivo = this.imagenesSeleccionadas[prod.id] || null;

        if (prod.id === 0) {
            // CREAR (POST)
            const formData = new FormData();
            formData.append('nombre', prod.nombre);
            formData.append('precio', (prod.precio || 0).toString());
            formData.append('descripcion', prod.descripcion || '');
            formData.append('stock', (prod.stock || 0).toString());
            
            if (archivo) formData.append('imagen', archivo);
            
            peticiones.push(this.productoService.crearProducto(formData));

        } else {
            // ACTUALIZAR (PUT)
            peticiones.push(this.productoService.actualizarProducto(prod.id, prod, archivo));
        }
    });

    // 3. ENVÍO AL SERVIDOR
    try {
        await Promise.all(peticiones);
        alert('✅ ¡Éxito! Todos los cambios se han guardado correctamente.');
        
        this.imagenesSeleccionadas = {}; 
        this.productosEliminados = [];
        this.cargarProductos(); 

    } catch (error) {
        console.error(error);
        alert('❌ Ocurrió un error al comunicarse con el servidor.');
    }
  }
}