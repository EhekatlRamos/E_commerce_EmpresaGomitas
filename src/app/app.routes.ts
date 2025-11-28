import { Routes } from '@angular/router';
import { CatalogoComponent} from "./producto/producto";
import { CarritoComponent } from './carrito/carrito';
import { MenuComponent } from './menu/menu';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion';
import { RegistroComponent } from './registro/registro';
import { RecuperarContrasenaComponent } from './recuperar-contrasena/recuperar-contrasena';
import { InventarioComponent } from './inventario/inventario';
import { UsuarioComponent } from './usuario/usuario';
import { AvisoPrivacidad } from './aviso-privacidad/aviso-privacidad';
import { TerminosCondiciones } from './terminos-condiciones/terminos-condiciones';
export const routes: Routes = [
  {path: '', component: MenuComponent},
  { path: 'inicio-sesion', component: InicioSesionComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent},
  { path: 'inventario', component: InventarioComponent},
  { path: 'usuario', component: UsuarioComponent},
  { path: 'aviso-privacidad', component: AvisoPrivacidad},
  { path: 'terminos-condiciones', component: TerminosCondiciones},
];
