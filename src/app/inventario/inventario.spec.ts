import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventarioComponent } from './inventario'; // 1. Importamos el nombre correcto
import { ProductService } from '../service/producto.service';

// 2. Creamos un "Mock" (servicio falso) para que la prueba no intente conectar al backend real
class MockProductService {
  getProducts() { 
    return Promise.resolve([]); // Devuelve una lista vacía
  }
  crearProducto() { 
    return Promise.resolve({}); 
  }
  actualizarProducto() { 
    return Promise.resolve({}); 
  }
  eliminarProducto() { 
    return Promise.resolve({}); 
  }
}

describe('InventarioComponent', () => {
  let component: InventarioComponent; // 3. Usamos el tipo correcto
  let fixture: ComponentFixture<InventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioComponent], // 4. Importamos el componente correcto
      // 5. Proveemos el servicio falso para evitar errores de inyección
      providers: [
        { provide: ProductService, useClass: MockProductService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioComponent); // 6. Creamos el componente correcto
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});