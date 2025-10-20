import {Injectable} from '@angular/core';
import {Producto} from '../modelo/producto';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { CatalogoComponent } from '../producto/producto';

@Injectable({
    providedIn:'root'
})

export class ProductService{
    private apiUrl = 'http://localhost:4000/api/catalogo';
    constructor (private http: HttpClient){}
    getProducts(): Observable<any>{
        return this.http.get<any>(`${this.apiUrl}/productos`);
    }
    /*async getProducts(): Promise<Producto[]>{
        try {
            const response = await fetch('assets/productos.xml');
            const xmlText = await response.text();
            //Parsear XML con DOM parser
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
            const productos: Producto[] = [];
            const nodos = xmlDoc.getElementsByTagName('producto');

            for(let i = 0; i < nodos.length; i++){
                const nodo = nodos[i];
                productos.push({
                    id: Number(nodo.getElementsByTagName('id')[0]?.textContent||  '0'), 
                    nombre: nodo.getElementsByTagName('nombre')[0]?.textContent || 'sin nombre',
                    precio: Number(nodo.getElementsByTagName('precio')[0]?.textContent||  '0'),
                    descripcion: nodo.getElementsByTagName('descripcion')[0]?.textContent || 'Sin descripcion',
                    imagen: nodo.getElementsByTagName('imagen')[0]?.textContent || ''
                });
            }
            console.log('Productos cargados:', productos);
            return productos;
        } catch (err) {
        console.error('Error cargando XML:', err);
        return [];
        }
    }*/
}