import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PlayerCardComponent, Player } from '../player-card/player-card.component';

@Component({
  selector: 'app-home',
  standalone: true,

  imports: [CommonModule, PlayerCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  jugadoras: Player[] = [
    {
      name: 'Carla Mora',
      position: 'Portera',
      number: 1,
      image: 'portera.png',
      video: 'video-portera.mp4',
    },
    {
      name: 'Ana García',
      position: 'Delantera',
      number: 9,
      image: 'jugadora1.png',
      video: 'video-jugadora1.mp4',
    },
    {
      name: 'Laura Ruiz',
      position: 'Centrocampista',
      number: 14,
      image: 'jugadora2.png',
      video: 'video-jugadora2.mp4',
    },
    {
      name: 'María López',
      position: 'Delantera',
      number: 4,
      image: 'jugadora3.png',
      video: 'video-jugadora3.mp4',
    },
    {
      name: 'Nerea Sánchez',
      position: 'Defensa',
      number: 12,
      image: 'jugadora4.png',
      video: 'video-jugadora4.mp4',
    },
    {
      name: 'Nerea Sánchez',
      position: 'Defensa',
      number: 15,
      image: 'jugadora5.png',
      video: 'video-jugadora5.mp4',
    },
    {
      name: 'Lorena Rodríguez',
      position: 'Delantera',
      number: 11,
      image: 'jugadora6.png',
      video: 'video-jugadora6.mp4',
    },
    {
      name: 'Alba García',
      position: 'Defensa',
      number: 3,
      image: 'jugadora4.png',
      video: 'video-jugadora4.2.mp4',
    },
    {
      name: 'Silvia Rivas',
      position: 'Mediocampista',
      number: 7,
      image: 'jugadora3.png',
      video: 'video-jugadora3.2.mp4',
    },
  ];

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
