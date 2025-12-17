import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, ProductoCarrito } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent implements OnInit {
  items: ProductoCarrito[] = [];
  total: number = 0;

  constructor(public cart: CartService, public api: ApiService) {}

  ngOnInit(): void {
    this.cart.carrito$.subscribe((items) => {
      this.items = items;
      this.total = this.cart.getTotal();
    });
  }

  eliminar(id: string) {
    this.cart.eliminarProducto(id);
  }

  vaciar() {
    this.cart.limpiarCarrito();
  }

  getImagenUrl(imagen: string): string {
    if (!imagen) return 'assets/no-image.png';
    if (imagen.startsWith('http')) return imagen;
    return `${this.api.URL_IMAGENES}${imagen}`;
  }

  checkout() {
    alert('¡Funcionalidad de pago próximamente!');
  }
}
