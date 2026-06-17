import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IncidenciaService } from '../../../../core/services/incidencia';
import { MaterialService } from '../../../../core/services/material';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-incidencia-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './incidencia-list.html',
  styleUrls: ['./incidencia-list.css']
})
export class IncidenciaListComponent implements OnInit {
  incidencias: any[] = [];
  materiales: any[] = [];
  
  panelCierreAbierto: boolean = false;
  incidenciaSeleccionada: any | null = null;
  cierreForm!: FormGroup;
  buscarForm!: FormGroup;

  municipioActual = '';
  apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private incidenciaService: IncidenciaService,
    private materialService: MaterialService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.municipioActual = `ID: ${localStorage.getItem('municipalidadId')}`;
    this.initForm();
    this.cargarDatosReales();
  }

  get detalles(): FormArray {
    return this.cierreForm.get('detalles') as FormArray;
  }

  private initForm(): void {
    this.cierreForm = this.fb.group({
      descripcion: ['', Validators.required],
      estado: ['RESUELTO', Validators.required],
      detalles: this.fb.array([])
    });

    this.buscarForm = this.fb.group({
      idBuscado: ['']
    });
  }

  nuevoDetalle(): FormGroup {
    return this.fb.group({
      materialId: ['', Validators.required],
      cantidadUsada: [1, [Validators.required, Validators.min(1)]]
    });
  }

  agregarDetalle(): void {
    this.detalles.push(this.nuevoDetalle());
  }

  removerDetalle(index: number): void {
    this.detalles.removeAt(index);
  }

  private cargarDatosReales(): void {
    this.incidenciaService.getAll().subscribe({
      next: (data) => {
        this.incidencias = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });

    this.materialService.getAll().subscribe({
      next: (data) => {
        this.materiales = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  buscarIncidencia(): void {
    const id = this.buscarForm.value.idBuscado;
    
    if (!id) {
      this.cargarDatosReales();
      return;
    }

    this.incidenciaService.getById(id).subscribe({
      next: (data) => {
        this.incidencias = data ? [data] : [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.incidencias = [];
        this.cdr.detectChanges();
      }
    });
  }

  limpiarBusqueda(): void {
    this.buscarForm.reset();
    this.cargarDatosReales();
  }

  abrirPanelCierre(incidencia: any): void {
    this.incidenciaSeleccionada = incidencia;
    
    this.cierreForm.reset({
      descripcion: `${incidencia.descripcion} - Reparación completada`,
      estado: 'RESUELTO'
    });
    
    this.detalles.clear();
    this.agregarDetalle();
    
    this.panelCierreAbierto = true;
  }

  cerrarPanel(): void {
    this.panelCierreAbierto = false;
    this.incidenciaSeleccionada = null;
  }

  onSubmitCierre(): void {
    if (this.cierreForm.invalid || !this.incidenciaSeleccionada) return;

    const formValues = this.cierreForm.value;

    const payload = {
      descripcion: formValues.descripcion,
      estado: formValues.estado,
      detalles: formValues.detalles.map((detalle: any) => ({
        detalle_id: null,
        material_id: Number(detalle.materialId),
        cantidad: detalle.cantidadUsada
      }))
    };

    this.incidenciaService.updateEstado(this.incidenciaSeleccionada.incidencia_id, payload).subscribe({
      next: (res) => {
        this.incidenciaSeleccionada.estado = 'RESUELTO';
        this.incidenciaSeleccionada.descripcion = payload.descripcion;
        this.cerrarPanel();
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Hubo un error al cerrar el ticket');
      }
    });
  }

  eliminarIncidencia(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta incidencia?')) {
      this.incidenciaService.eliminar(id).subscribe({
        next: () => {
          this.cargarDatosReales();
        },
        error: (err) => {
          alert('Error al eliminar la incidencia');
        }
      });
    }
  }
}