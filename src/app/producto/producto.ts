import { Component, inject, OnInit } from '@angular/core';
import { Producto } from '../modelo/producto';
import { ProductService } from '../service/producto.service';
import { CarritoService } from '../service/carrito.service';
import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
// Eliminamos HttpClientModule de aquí
import { iniciarSesionService } from '../service/iniciar-sesion.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  // Quitamos HttpClientModule de los imports
  imports: [RouterModule, CurrencyPipe], 
  providers: [ProductService],
  templateUrl: './producto.html',
  styleUrls: ['./producto.css']
})
export class CatalogoComponent implements OnInit {
  private carritoService = inject(CarritoService);
  public authService = inject(iniciarSesionService); 

  productos: Producto[] = [];
  
  constructor(private productoService: ProductService) {}
  
  agregar(producto: Producto) {
    this.carritoService.agregar(producto);
  }

  // Usamos async/await para esperar los datos limpiamente
  async ngOnInit() {
    try {
      const data = await this.productoService.getProducts();
      this.productos = data;
      console.log('Productos cargados exitosamente:', this.productos);
    } catch (err) {
      console.error('Error al cargar productos:', err); 
      // Convertimos el error a string para que se vea en el alert
      alert('Error de conexión con el servidor: ' + err);
    }
  }
}