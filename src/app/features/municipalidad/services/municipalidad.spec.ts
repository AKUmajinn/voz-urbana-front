import { TestBed } from '@angular/core/testing';

import { Municipalidad } from './municipalidad';

describe('Municipalidad', () => {
  let service: Municipalidad;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Municipalidad);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
