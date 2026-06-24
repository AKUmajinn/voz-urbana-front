import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipalidadList } from './municipalidad-list';

describe('MunicipalidadList', () => {
  let component: MunicipalidadList;
  let fixture: ComponentFixture<MunicipalidadList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunicipalidadList],
    }).compileComponents();

    fixture = TestBed.createComponent(MunicipalidadList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
