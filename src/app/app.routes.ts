import { Routes } from '@angular/router';
import { CatalogoComponent} from "./producto/producto";
import { CarritoComponent } from './carrito/carrito';
export const routes: Routes = [
  { path: '', component: CatalogoComponent },
  { path: 'carrito', component: CarritoComponent }
];
