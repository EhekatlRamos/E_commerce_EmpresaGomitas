import { AfterViewInit, Component, computed, inject } from '@angular/core';
import { CarritoService } from '../service/carrito.service';
import { CurrencyPipe } from '@angular/common';

declare var paypal: any;
@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './carrito.html'
})
export class CarritoComponent implements AfterViewInit{
  
  
  private carritoService = inject(CarritoService);
  carrito = this.carritoService.productos;
  total = computed(() => this.carritoService.total());

  ngAfterViewInit(): void {
    const totalNumber = this.total();
    const totalString = totalNumber.toFixed(2);  
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalString, currency_code: 'MXN'
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            console.log('Pago completado', details);
            this.crearVentas();
            this.vaciar(); 
          });
        }
    }).render('#paypal-button-container');
  }

  quitar(id: number) {
    this.carritoService.quitar(id);
  }

  vaciar() {
    this.carritoService.vaciar();
  }
  
  exportarXML() {
  this.carritoService.exportarXML();
  }

  crearVentas() {
    this.carritoService.crearVenta();
  }
}

