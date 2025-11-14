import { Routes } from '@angular/router';
import { CatalogoComponent} from "./producto/producto";
import { CarritoComponent } from './carrito/carrito';
import { MenuComponent } from './menu/menu';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion';
import { RegistroComponent } from './registro/registro';
export const routes: Routes = [
  {path: '', component: MenuComponent},
  { path: 'inicio-sesion', component: InicioSesionComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'carrito', component: CarritoComponent },
];
