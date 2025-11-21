import { Component, OnInit, inject } from '@angular/core';
import { Producto } from '../modelo/producto';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CurrencyPipe} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { iniciarSesionService } from '../service/iniciar-sesion.service';
import { ProductService } from '../service/producto.service';
import { ɵInternalFormsSharedModule } from "@angular/forms";
@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [RouterModule, CommonModule, CurrencyPipe, HttpClientModule, ɵInternalFormsSharedModule],
  providers: [ProductService],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css'
})
export class InventarioComponent implements OnInit{
  public authService = inject(iniciarSesionService);
  productos: Producto[] = [];
  archivoSeleccionado: File | null = null; 
  idSeleccionado: number | null = null; 
  constructor(private productoService: ProductService){}

  alSeleccionarArchivo(event: any, idProducto:number){
    this.archivoSeleccionado = event.target.files[0];
    this.idSeleccionado = idProducto;
  }

  subirImagen(){
    if(this.archivoSeleccionado && this.idSeleccionado){
      this.productoService.actualizarImagen(this.idSeleccionado, this.archivoSeleccionado)
        .subscribe({
          next: (response) => {
            alert('Imagen actualizada');
            this.cargarProductos();
            this.archivoSeleccionado = null; 
            this.idSeleccionado = null; 
          }, 
          error: (err) => {
            console.error('Error subiendo imagnen', err);
            alert('Error al subir la imagen');
          }
        }) 
    }
  }

  cargarProductos(){
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
  ngOnInit(): void {
    this.cargarProductos();
  }
}
