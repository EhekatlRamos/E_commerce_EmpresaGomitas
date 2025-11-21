import { Component, inject, OnInit } from '@angular/core';
import { Producto } from '../modelo/producto';
import { ProductService } from '../service/producto.service';
import { CarritoService } from '../service/carrito.service';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    CommonModule,       // ← NECESARIO para *ngIf
    RouterModule,
    CurrencyPipe,
    HttpClientModule
  ],
  providers: [ProductService],
  templateUrl: './producto.html',
  styleUrls: ['./producto.css']
})
export class CatalogoComponent implements OnInit {
  
  productos: Producto[] = [];

  // Servicios
  private carritoService = inject(CarritoService);
  public auth = inject(AuthService);   // ← NECESARIO PARA EL BOTÓN
  
  constructor(private productoService: ProductService) {}

  ngOnInit(): void {
    this.productoService.getProducts().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  agregar(producto: Producto) {
    this.carritoService.agregar(producto);
  }
}
