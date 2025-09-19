import { Component, inject, OnInit } from '@angular/core';
import { Producto } from '../modelo/producto';
import { ProductService } from '../service/producto.service';
import { CarritoService } from '../service/carrito.service';
import { CurrencyPipe} from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [RouterModule, CurrencyPipe],
  templateUrl: './producto.html', // o template: '...' si pones el HTML inline
  styleUrls: ['./producto.css']   // nota: era styleUrl → corregido a styleUrls
})
export class CatalogoComponent implements OnInit {
  private carritoService = inject(CarritoService);

  productos: Producto[] = [];

  constructor(private productoService: ProductService) {}

  agregar(producto: Producto) {
    this.carritoService.agregar(producto);
  }

  async ngOnInit() {
    this.productos = await this.productoService.getProducts();
    console.log('Productos cargados:', this.productos);
  }
}
