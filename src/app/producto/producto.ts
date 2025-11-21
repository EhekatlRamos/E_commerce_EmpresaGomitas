import { Component, inject, OnInit } from '@angular/core';
import { Producto } from '../modelo/producto';
import { ProductService } from '../service/producto.service';
import { CarritoService } from '../service/carrito.service';
import { CurrencyPipe} from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { iniciarSesionService } from '../service/iniciar-sesion.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterModule, CurrencyPipe, HttpClientModule],
  providers: [ProductService],
  templateUrl: './producto.html', // o template: '...' si pones el HTML inline
  styleUrls: ['./producto.css']   // nota: era styleUrl → corregido a styleUrls
  
})
export class CatalogoComponent implements OnInit {
  private carritoService = inject(CarritoService);
  public authService = inject(iniciarSesionService); 

  productos: Producto[] = [];
  constructor(private productoService: ProductService) {}
  agregar(producto: Producto) {
    this.carritoService.agregar(producto);
  }

  ngOnInit(): void {
    this.productoService.getProducts().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        console.log('Productos cargados:', this.productos);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err); 
        alert('Error al cargar productos: ' + JSON.stringify(err));}
    });
  }
}
