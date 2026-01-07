import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProductoCarrito {
  _id: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private carrito: ProductoCarrito[] = [];
  private _carritoSubject = new BehaviorSubject<ProductoCarrito[]>([]);
  carrito$ = this._carritoSubject.asObservable();

  constructor() {

    const saved = localStorage.getItem('carrito');
    if (saved) {
      this.carrito = JSON.parse(saved);
      this._carritoSubject.next(this.carrito);
    }
  }

  getProductos() {
    return this.carrito;
  }

  agregarProducto(producto: any) {
    const itemExistente = this.carrito.find((p) => p._id === producto._id);

    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.carrito.push({
        _id: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1,
      });
    }

    this.actualizarState();
  }

  eliminarProducto(id: string) {
    this.carrito = this.carrito.filter((p) => p._id !== id);
    this.actualizarState();
  }

  limpiarCarrito() {
    this.carrito = [];
    this.actualizarState();
  }

  getTotal() {
    return this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  private actualizarState() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this._carritoSubject.next(this.carrito);
  }
}
