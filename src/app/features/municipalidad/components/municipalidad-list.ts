import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MunicipalidadService } from '../../../core/services/municipalidad';

@Component({
  selector: 'app-municipalidad-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './municipalidad-list.html',
  styleUrls: ['./municipalidad-list.css']
})
export class MunicipalidadListComponent implements OnInit {
  municipalidades: any[] = [];
  municipioActual = '';
  
  panelAbierto = false;
  modoEdicion = false;
  municipalidadSeleccionada: any | null = null;
  
  municipalidadForm!: FormGroup;
  buscarForm!: FormGroup;

  constructor(
    private municipalidadService: MunicipalidadService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.municipioActual = `ID: ${localStorage.getItem('municipalidadId')}`;
    this.initForm();
    this.cargarMunicipalidades();
  }

  private initForm(): void {
    this.municipalidadForm = this.fb.group({
      nombre_municipio: ['', Validators.required],
      municipalidad_id: [''],
    });

    this.buscarForm = this.fb.group({
      idBuscado: ['']
    });
  }

  private cargarMunicipalidades(): void {
    this.municipalidadService.getAll().subscribe({
      next: (data) => {
        this.municipalidades = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  buscarMunicipalidad(): void {
    const id = this.buscarForm.value.idBuscado;
    
    if (!id) {
      this.cargarMunicipalidades();
      return;
    }

    this.municipalidadService.getById(id).subscribe({
      next: (data) => {
        this.municipalidades = data ? [data] : [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.municipalidades = [];
        this.cdr.detectChanges();
      }
    });
  }

  limpiarBusqueda(): void {
    this.buscarForm.reset();
    this.cargarMunicipalidades();
  }

  esStockCritico(stock: number): boolean {
    return stock < 20;
  }

  abrirPanel(municipalidad?: any): void {
    if (municipalidad) {
      this.modoEdicion = true;
      this.municipalidadSeleccionada = municipalidad;
      this.municipalidadForm.patchValue({
        nombre_municipio: municipalidad.nombre_municipio,
        municipalidad_id: municipalidad.municipalidad_id
      });
    } else {
      this.modoEdicion = false;
      this.municipalidadSeleccionada = null;
      this.municipalidadForm.reset({ stock: 0 });
    }
    
    this.panelAbierto = true;
  }

  cerrarPanel(): void {
    this.panelAbierto = false;
    this.municipalidadSeleccionada = null;
    this.modoEdicion = false;
  }

  onSubmitMunicipalidad(): void {
    if (this.municipalidadForm.invalid) return;

    const formValues = this.municipalidadForm.value;

    if (this.modoEdicion && this.municipalidadSeleccionada) {
      const payloadUpdate = {
        codigo_municipalidad: formValues.codigo_municipalidad,
        nombre_municipio: formValues.nombre_municipio
      };

      this.municipalidadService.update(this.municipalidadSeleccionada.municipalidad_id, payloadUpdate).subscribe({
        next: () => {
          this.cargarMunicipalidades();
          this.cerrarPanel();
        },
        error: (err) => {
          alert('Error al actualizar el material');
        }
      });
    } else {
      const payloadCreate = {
        nombre_municipio: formValues.nombre_municipio
      };
      this.municipalidadService.crear(payloadCreate).subscribe({
        next: () => {
          this.cargarMunicipalidades();
          this.cerrarPanel();
        },
        error: (err) => {
          alert('Error al registrar el material');
        }
      });
      };

  }

  eliminarMaterial(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este material?')) {
      this.municipalidadService.eliminar(id).subscribe({
        next: () => {
          this.cargarMunicipalidades();
        },
        error: (err) => {
          alert('Error al eliminar el material');
        }
      });
    }
  }
}