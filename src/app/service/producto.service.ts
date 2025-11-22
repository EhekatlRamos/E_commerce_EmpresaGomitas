import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    // Asegúrate de que el puerto sea 4000
    private apiUrl = 'http://localhost:4000/api/catalogo';

    constructor() {}

    // GET
    async getProducts(): Promise<any> {
        const response = await fetch(`${this.apiUrl}/productos`);
        if (!response.ok) throw new Error('Error al obtener productos');
        return await response.json();
    }

    // PUT (Editar) - CORREGIDO PARA EVITAR ERRORES
    async actualizarProducto(id: number, data: any, archivo: File | null): Promise<any> {
        const formData = new FormData();
        formData.append('nombre', data.nombre);
        // Protegemos con || 0 para evitar errores si el dato es nulo
        formData.append('precio', (data.precio || 0).toString());
        formData.append('descripcion', data.descripcion || '');
        formData.append('stock', (data.stock || 0).toString()); 
        
        if (archivo) {
            formData.append('imagen', archivo);
        }

        const response = await fetch(`${this.apiUrl}/productos/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) throw new Error('Error al actualizar producto');
        return await response.json();
    }
    
    // POST (Crear) - CORREGIDO
    async crearProducto(producto: FormData): Promise<any> {
        // No necesitamos procesar el FormData aquí porque ya viene listo del componente
        // pero asegurate de que el componente lo envíe bien.
        const response = await fetch(`${this.apiUrl}/productos`, {
            method: 'POST',
            body: producto
        });
        
        if (!response.ok) throw new Error('Error al crear producto');
        return await response.json();
    }

    // DELETE (Baja lógica)
    async eliminarProducto(id: number): Promise<any> {
        const response = await fetch(`${this.apiUrl}/productos/baja/${id}`, {
            method: 'PUT'
        });

        if (!response.ok) throw new Error('Error al eliminar el producto');
        return await response.json();
    }
}