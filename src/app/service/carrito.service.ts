import { Injectable, signal, inject } from '@angular/core';
import { Producto } from '../modelo/producto';
import { iniciarSesionService } from './iniciar-sesion.service';
@Injectable({ providedIn: 'root' })
export class CarritoService {
  // Inicializamos la señal
  private productosSignal = signal<Producto[]>([]);
  productos = this.productosSignal.asReadonly();
  private sesionService = inject(iniciarSesionService);
  private apiUrl = 'http://localhost:4000/api/catalogo';
  constructor() {}
  agregar(producto: Producto) {
    this.productosSignal.update((lista) => {
      const existe = lista.find((p) => p.id === producto.id);
      if (existe) {
        return lista.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: (p.cantidad || 1) + 1 }
            : p
        );
      } else {
        return [...lista, { ...producto, cantidad: 1 }];
      }
    });
  }

  aumentar(id: number) {
    this.productosSignal.update((lista) =>
      lista.map((p) => {
        if (p.id === id) {
          return { ...p, cantidad: (p.cantidad || 1) + 1 };
        }
        return p;
      })
    );
  }

  disminuir(id: number) {
    this.productosSignal.update((lista) =>
      lista.map((p) => {
        if (p.id === id && (p.cantidad || 1) > 1) {
          return { ...p, cantidad: (p.cantidad || 1) - 1 };
        }
        return p;
      })
    );
  }

  actualizarCantidad(id: number, cantidad: number) {
    if (cantidad < 1) cantidad = 1;
    this.productosSignal.update((lista) =>
      lista.map((p) => (p.id === id ? { ...p, cantidad: cantidad } : p))
    );
  }

  quitar(id: number) {
    this.productosSignal.update((lista) => lista.filter((p) => p.id !== id));
  }

  vaciar() {
    this.productosSignal.set([]);
  }

  total() {

    return this.productosSignal().reduce(
      (acc, p) => acc + p.precio * (p.cantidad || 1),
      0
    );
  }

  async crearVenta(): Promise<any> {
    const totalVenta = this.total();
    const productosVenta = this.productosSignal();
    const usuario = this.sesionService.currentUser();
    console.log('Datos del usuario activo:', usuario);

    if (!usuario) {
      alert('Debes iniciar sesión para comprar');
      throw new Error('Usuario no autenticado');
    }

    const ventaData = { 
        total: totalVenta,
        clienteId: usuario.Id_Clie, 
        productos: productosVenta.map(p => ({ id: p.id, cantidad: p.cantidad || 1 }))
    };

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

  exportarXML() {
      // (Código existente...)
      // Nota: Si quieres que el XML refleje la cantidad, deberías agregar <cantidad>${p.cantidad}</cantidad> en tu bucle.
      const productos = this.productosSignal();
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n`;
      for (const p of productos) {
        xml += `  <producto>\n`;
        xml += `    <id>${p.id}</id>\n`;
        xml += `    <nombre>${p.nombre}</nombre>\n`;
        xml += `    <precio>${p.precio}</precio>\n`;
        xml += `    <cantidad>${p.cantidad || 1}</cantidad>\n`; // Agregado
        xml += `  </producto>\n`;
      }
      xml += `  <total>${this.total()}</total>\n`;
      xml += `</recibo>`;
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recibo.xml';
      a.click();
      URL.revokeObjectURL(url);
  }
}