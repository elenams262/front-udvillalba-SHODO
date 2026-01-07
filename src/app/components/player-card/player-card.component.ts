import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';


export interface Player {
  name: string;
  position: string;
  number: number;
  image: string;
  video: string;
}

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.css'],
})
export class PlayerCardComponent {
  @Input({ required: true }) player!: Player;
  

  @ViewChild('videoPlayer') videoElement!: ElementRef<HTMLVideoElement>;


  constructor(public api: ApiService) {}

  onMouseEnter() {
    if (this.videoElement && this.videoElement.nativeElement) {
      const video = this.videoElement.nativeElement;

      if (video.src) {
        video.muted = true;
        video.play().catch(err => console.warn('Autoplay bloqueado:', err));
      }
    }
  }

  onMouseLeave() {
    if (this.videoElement && this.videoElement.nativeElement) {
      const video = this.videoElement.nativeElement;
      video.pause();
      video.currentTime = 0;
    }
  }
}