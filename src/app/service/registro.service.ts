import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class registroService{
    private apiUrl = 'http://localhost:4000/api/catalogo';

    async submit(username: string, password: string, email: string, rol:string): Promise<boolean>{
        try{
            const response = await fetch(`${this.apiUrl}/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password, email, rol}),
            });
            // Manejo de códigos HTTP útiles
            if (response.status === 201) {
                // creado correctamente
                return true;
            }

            // Si la API devuelve 409 (conflict) -> usuario ya existe
            if (response.status === 409) {
                const err = await response.json().catch(() => null);
                const msg = err?.error || 'El nombre de usuario ya está registrado';
                alert(msg);
                return false;
            }

            // Si la API devuelve 400 -> datos faltantes
            if (response.status === 400) {
                const err = await response.json().catch(() => null);
                const msg = err?.error || 'Faltan datos obligatorios';
                alert(msg);
                return false;
            }

            // Otros errores: intenta leer JSON, si no, lee texto
            if (!response.ok) {
                let detail: any = null;
                try {
                detail = await response.json();
                } catch {
                detail = await response.text();
                }
                console.error('Registro fallido:', response.status, detail);
                alert('Error al registrar. Intente más tarde.');
                return false;
            }

            // En caso de que la API devuelva 200 con objeto (por compatibilidad)
            const data = await response.json().catch(() => null);
            if (data && (data.idUsuario || data.success)) {
                return true;
            }

            // Si llegamos aquí, no sabemos interpretar la respuesta -> fallo seguro
            return false;
        }catch (error){
                console.error(error);
                alert('Vuelva a intentarlo');
                return false;
        }
    }
}