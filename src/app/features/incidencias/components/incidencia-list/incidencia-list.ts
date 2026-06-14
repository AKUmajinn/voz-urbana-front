import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IncidenciaService } from '../../../../core/services/incidencia';
import { MaterialService } from '../../../../core/services/material';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-incidencia-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incidencia-list.html',
  styleUrls: ['./incidencia-list.css']
})
export class IncidenciaListComponent implements OnInit {
  incidencias: any[] = [];
  materiales: any[] = [];
  
  panelCierreAbierto: boolean = false;
  incidenciaSeleccionada: any | null = null;
  cierreForm!: FormGroup;

  municipioActual = '';
  apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private incidenciaService: IncidenciaService,
    private materialService: MaterialService
  ) {}

  ngOnInit(): void {
    this.municipioActual = `ID: ${localStorage.getItem('municipalidadId')}`;
    this.initForm();
    this.cargarDatosReales();
  }

  private initForm(): void {
    this.cierreForm = this.fb.group({
      estado: ['RESUELTO', Validators.required],
      materialId: ['', Validators.required],
      cantidadUsada: [1, [Validators.required, Validators.min(1)]]
    });
  }

  private cargarDatosReales(): void {
    this.incidenciaService.getAll().subscribe({
      next: (data) => {
        this.incidencias = data;
      },
      error: (err) => console.error('Error cargando incidencias', err)
    });

    this.materialService.getAll().subscribe({
      next: (data) => {
        this.materiales = data;
      },
      error: (err) => console.error('Error cargando materiales', err)
    });
  }

  getEvidenciaUrl(fotoPath: string): string {
    if (!fotoPath) return 'assets/placeholder.jpg';
    return `${this.apiUrl}/images/${fotoPath}`;
  }

  abrirPanelCierre(incidencia: any): void {
    this.incidenciaSeleccionada = incidencia;
    this.cierreForm.reset({ estado: 'RESUELTO', materialId: '', cantidadUsada: 1 });
    this.panelCierreAbierto = true;
  }

  cerrarPanel(): void {
    this.panelCierreAbierto = false;
    this.incidenciaSeleccionada = null;
  }

  onSubmitCierre(): void {
    if (this.cierreForm.invalid || !this.incidenciaSeleccionada) return;

    const payload = {
      estado: this.cierreForm.value.estado
    };

    this.incidenciaService.updateEstado(this.incidenciaSeleccionada.id, payload).subscribe({
      next: (res) => {
        this.incidenciaSeleccionada.estado = 'RESUELTO';
        this.cerrarPanel();
      },
      error: (err) => {
        console.error('Error al actualizar el estado', err);
        alert('Hubo un error al cerrar el ticket');
      }
    });
  }
}