import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProximoPartidoComponent } from './proximo-partido.component';

describe('ProximoPartidoComponent', () => {
  let component: ProximoPartidoComponent;
  let fixture: ComponentFixture<ProximoPartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProximoPartidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProximoPartidoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
