import { Component, computed, inject } from '@angular/core';
import { CarritoService } from '../service/carrito.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './carrito.html'
})
export class CarritoComponent {
  private carritoService = inject(CarritoService);

  carrito = this.carritoService.productos;
  total = computed(() => this.carritoService.total());

  quitar(id: number) {
    this.carritoService.quitar(id);
  }

  vaciar() {
    this.carritoService.vaciar();
  }
  exportarXML() {
  this.carritoService.exportarXML();
}

}
