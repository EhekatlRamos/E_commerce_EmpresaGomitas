import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { iniciarSesionService } from '../service/iniciar-sesion.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent {
  public authService = inject(iniciarSesionService);
}