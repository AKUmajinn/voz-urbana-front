import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciaResolve } from './incidencia-resolve';

describe('IncidenciaResolve', () => {
  let component: IncidenciaResolve;
  let fixture: ComponentFixture<IncidenciaResolve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidenciaResolve],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidenciaResolve);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
