import { Component,OnInit } from '@angular/core';
import { Producto } from '../modelo/producto';
import{ProductService}from '../service/producto.service'
@Component({
  selector: 'app-producto',
  templateUrl: './producto.html',
  styleUrl: './producto.css'
})
export class producto implements OnInit{
  productos:Producto[]=[];
  constructor(private productoService:ProductService){}
  async ngOnInit(){
    this.productos=await this.productoService.getProducts();
    console.log('Productos cargados:', this.productos);
  }
}
