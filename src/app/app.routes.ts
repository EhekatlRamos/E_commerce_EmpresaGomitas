import { Routes } from '@angular/router';
import { producto} from "./producto/producto";
export const routes: Routes = [
    {path:'product-list', component:producto},
    {path:'', redirectTo: '/product-list', pathMatch:'full'}
];