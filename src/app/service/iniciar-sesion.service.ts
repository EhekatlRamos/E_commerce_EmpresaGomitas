import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class iniciarSesionService {
    private apiUrl = 'http://localhost:4000/api/catalogo';
    currentUser = signal<any>(null);

    constructor() {
        if (typeof localStorage !== 'undefined') {
            const storageUser = localStorage.getItem('usuario');
            if (storageUser) {
                this.currentUser.set(JSON.parse(storageUser));
            }
        }
    }
    
    async submit(username: string, password: string): Promise<boolean>{
        try{
            const response = await fetch(`${this.apiUrl}/iniciar-sesion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password}),
            });
            if(!response.ok) return false;
            
            const data = await response.json();
            
            if(data.length > 0) {
                const usuarioEncontrado = data[0]; 
                this.currentUser.set(usuarioEncontrado);
                localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
                
                return true; 
            }
            return false;
        } catch (error){
            console.error(error);
            return false;
        }
    }

    get esAdmin(): boolean {
        const user = this.currentUser();
        return user && (user.Rol === 'Admin' || user.Rol === 'admin');
    }

    cerrarSesion() {
        this.currentUser.set(null);
        localStorage.removeItem('usuario');
    }
    async actualizarUsuario(id: number, nombre: string, contrasena: string): Promise<boolean>{
        try {
            const response = await fetch(`${this.apiUrl}/usuario/${id}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, contrasena }),
            });
            if (!response.ok) return false;

            // Actualizamos la señal localmente para que se vea el cambio inmediato
            const usuarioActual = this.currentUser();
            if (usuarioActual) {
                const usuarioActualizado = { ...usuarioActual, Nombre: nombre, Contrasena: contrasena };
                this.currentUser.set(usuarioActualizado);
                localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
            }

            return true;
        }catch(err){
            console.error("Error al actualizar usuario:", err);
            return false;
        }
    }
}