import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { CartService } from '../services/cart.service';
import { RouterLink } from '@angular/router';

interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css',
})
export class TiendaComponent implements OnInit {
  productos: Producto[] = [];
  cargando: boolean = true;
  productoAgregadoId: string | null = null; // Para mostrar feedback

  constructor(public api: ApiService, private cart: CartService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.api.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        // Datos de ejemplo por si falla el backend
        this.productos = [
          {
            _id: '1',
            nombre: 'Camiseta Oficial 25/26',
            descripcion: 'Primera equipación oficial UD Villalba.',
            precio: 30.0,
            imagen: 'camiseta-jugador.jpeg',
          },
          {
            _id: '2',
            nombre: 'Bufanda Oficial',
            descripcion: 'Bufanda de lana con el escudo bordado.',
            precio: 15.0,
            imagen: 'bufanda.jpeg',
          },
          {
            _id: '3',
            nombre: 'Camiseta portero',
            descripcion: 'Camiseta de portero.',
            precio: 30.0,
            imagen: 'camiseta-portero.jpeg',
          },
        ];
        this.cargando = false;
      },
    });
  }

  getImagenUrl(imagen: string): string {
    if (!imagen) return 'assets/no-image.png';
    if (imagen.startsWith('http')) return imagen;
    return `${this.api.URL_IMAGENES}${imagen}`;
  }

  comprar(producto: Producto) {
    this.cart.agregarProducto(producto);
    this.productoAgregadoId = producto._id;
  }
}
