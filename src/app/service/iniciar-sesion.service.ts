import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class iniciarSesionService{
    private apiUrl = 'http://localhost:4000/api/catalogo';
    
    async submit(username: string, password: string): Promise<boolean>{
    
        try{
            const response = await fetch(`${this.apiUrl}/iniciar-sesion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password}),
            });
            if(!response.ok) return false;
            const data = await response.json();
            // Devuelve true si el login fue exitoso
            return data.length > 0; // depende de cómo tu backend responda
        }catch (error){
            console.error(error);
            alert('Usuario o contraseña incorrectos');
            return false;
        }
    }
}