import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventarioComponent } from './inventario';
import { ProductService } from '../service/producto.service';

class MockProductService {
  getProducts() { 
    return Promise.resolve([]); 
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
  let component: InventarioComponent; 
  let fixture: ComponentFixture<InventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioComponent],
      providers: [
        { provide: ProductService, useClass: MockProductService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioComponent); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});