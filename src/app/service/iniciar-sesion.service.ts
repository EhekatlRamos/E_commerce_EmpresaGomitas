import { Injectable } from '@angular/core';
import { AuthService, User } from './auth.service';

@Injectable({ providedIn: 'root' })
export class IniciarSesionService {
  private apiUrl = 'http://localhost:4000/api/catalogo';

  constructor(private auth: AuthService) {}

  async submit(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/iniciar-sesion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();

      if (data.success && data.user) {
        // Guardamos el usuario en AuthService
        const user: User = {
          id: data.user.id,
          nombre: data.user.nombre,
          rol: data.user.rol
        };
        this.auth.login(user);
        return true;
      }

      return false;

    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  }
}
