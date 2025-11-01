import { Injectable, signal } from '@angular/core';
import { Producto } from '../modelo/producto';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private productosSignal = signal<Producto[]>([]);
  productos = this.productosSignal.asReadonly();

  private apiUrl = 'http://localhost:4000/api/catalogo';

  constructor() {}

  // usar fetch y devolver una Promise con el resultado JSON
  async crearVenta(): Promise<any> {
    const totalVenta = this.total();
    console.log('Total calculado:', totalVenta);

    // Validación básica en el frontend
    if (totalVenta === undefined || totalVenta === null) {
      alert('Error: no se pudo calcular el total.');
      throw new Error('Total indefinido');
    }
    if (totalVenta <= 0) {
      alert('El carrito está vacío o el total es 0. Agrega productos antes de comprar.');
      throw new Error('Total inválido (<= 0)');
    }

    const ventaData = { total: totalVenta };

    try {
      const response = await fetch(`${this.apiUrl}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const data = await response.json();
      this.vaciar();
      return data;
    } catch (err) {
      console.error('Error creando venta:', err);
      throw err;
    }
  }

  agregar(producto: Producto) {
    this.productosSignal.update(lista => [...lista, producto]);
  }

  quitar(id: number) {
    this.productosSignal.update(lista => lista.filter(p => p.id !== id));
  }

  vaciar() { this.productosSignal.set([]); }

  total() {
    return this.productosSignal().reduce((acc, p) => acc + p.precio, 0);
  }

  exportarXML() {
    const productos = this.productosSignal();

    // Generar estructura XML manualmente
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n`;

    for (const p of productos) {
      xml += `  <producto>\n`;
      xml += `    <id>${p.id}</id>\n`;
      xml += `    <nombre>${p.nombre}</nombre>\n`;
      xml += `    <precio>${p.precio}</precio>\n`;
      if (p.descripcion) {
        xml += `    <descripcion>${p.descripcion}</descripcion>\n`;
      }
      xml += `  </producto>\n`;
    }

    xml += `  <total>${this.total()}</total>\n`;
    xml += `</recibo>`;

    // Crear un Blob con el contenido XML
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    // Crear un enlace para forzar la descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    a.click();

    // Liberar memoria
    URL.revokeObjectURL(url);
  }
}