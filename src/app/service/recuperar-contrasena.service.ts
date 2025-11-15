import { Injectable, signal } from '@angular/core';
import { Producto } from '../modelo/producto';

@Injectable({ providedIn: 'root' })
export class RecuperarContrasenaService {
  private apiUrl = 'http://localhost:4000/api/catalogo';

  async submit(username: string, email: string): Promise<boolean>{
    try{
      const response = await fetch(`${this.apiUrl}/recuperar-contrasena`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, email}),
      });
      return response != null;
    }catch(error){
      console.error(error);
      alert('Usuario o email incorrectos');
      return false;
    }
  }
}