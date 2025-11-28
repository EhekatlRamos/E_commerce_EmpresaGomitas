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
  imagenesSeleccionadas: { [id: number]: File } = {};
  
  productosEliminados: number[] = [];

  constructor(private productoService: ProductService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  async cargarProductos() {
    try {
      this.productos = await this.productoService.getProducts();
      this.productosEliminados = []; 
    } catch (error) {
      console.error('Error cargando productos:', error);
      alert('No se pudo cargar el inventario. Revisa que el servidor esté encendido.');
    }
  }

  agregarFila() {
    const nuevoProducto = {
      id: 0, 
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      imagen: '', 
      imagenUrl: null 
    };
    this.productos.unshift(nuevoProducto);
  }
  onFileSelected(event: any, idProducto: number) {
    const file = event.target.files[0];
    
    if (file) {
      this.imagenesSeleccionadas[idProducto] = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const producto = this.productos.find(p => p.id === idProducto);
        if (producto) {
          producto.imagenUrl = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  eliminarFila(index: number, id: number) {
    const confirmar = confirm('Este producto se marcará para eliminar al guardar los cambios. ¿Continuar?');
    if (!confirmar) return;

    if (id > 0) {
        this.productosEliminados.push(id);
    } 
    
    this.productos.splice(index, 1);
  }

  async guardarTodo() {
    for (let i = 0; i < this.productos.length; i++) {
        const prod = this.productos[i];
        
        if (!prod.nombre || prod.nombre.toString().trim() === '') {
            alert(`ERROR: El producto en la fila ${i + 1} no tiene NOMBRE.`);
            return;
        }
        if (prod.precio === null || prod.precio === undefined || prod.precio <= 0) {
            alert(`ERROR: El producto "${prod.nombre}" tiene un PRECIO inválido.`);
            return;
        }
        if (prod.stock === null || prod.stock === undefined || prod.stock < 0) {
            alert(`ERROR: El producto "${prod.nombre}" tiene un STOCK inválido.`);
            return;
        }
    }

    const peticiones: Promise<any>[] = [];

    this.productosEliminados.forEach(id => {
        peticiones.push(this.productoService.eliminarProducto(id));
    });

    this.productos.forEach(prod => {
        const archivo = this.imagenesSeleccionadas[prod.id] || null;

        if (prod.id === 0) {
            const formData = new FormData();
            formData.append('nombre', prod.nombre);
            formData.append('precio', (prod.precio || 0).toString());
            formData.append('descripcion', prod.descripcion || '');
            formData.append('stock', (prod.stock || 0).toString());
            
            if (archivo) formData.append('imagen', archivo);
            
            peticiones.push(this.productoService.crearProducto(formData));

        } else {
            peticiones.push(this.productoService.actualizarProducto(prod.id, prod, archivo));
        }
    });

    try {
        await Promise.all(peticiones);
        alert('¡Éxito! Todos los cambios se han guardado correctamente.');
        
        this.imagenesSeleccionadas = {}; 
        this.productosEliminados = [];
        this.cargarProductos(); 

    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al comunicarse con el servidor.');
    }
  }
}