import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialService } from '../../../../core/services/material';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './material-list.html',
  styleUrls: ['./material-list.css']
})
export class MaterialListComponent implements OnInit {
  materiales: any[] = [];
  municipioActual = '';
  
  panelAbierto = false;
  modoEdicion = false;
  materialSeleccionado: any | null = null;
  
  materialForm!: FormGroup;
  buscarForm!: FormGroup;

  constructor(
    private materialService: MaterialService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.municipioActual = `ID: ${localStorage.getItem('municipalidadId')}`;
    this.initForm();
    this.cargarMateriales();
  }

  private initForm(): void {
    this.materialForm = this.fb.group({
      nombre_material: ['', Validators.required],
      codigo_material: [''],
      stock: [0, [Validators.required, Validators.min(0)]]
    });

    this.buscarForm = this.fb.group({
      idBuscado: ['']
    });
  }

  private cargarMateriales(): void {
    this.materialService.getAll().subscribe({
      next: (data) => {
        this.materiales = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  buscarMaterial(): void {
    const id = this.buscarForm.value.idBuscado;
    
    if (!id) {
      this.cargarMateriales();
      return;
    }

    this.materialService.getById(id).subscribe({
      next: (data) => {
        this.materiales = data ? [data] : [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.materiales = [];
        this.cdr.detectChanges();
      }
    });
  }

  limpiarBusqueda(): void {
    this.buscarForm.reset();
    this.cargarMateriales();
  }

  esStockCritico(stock: number): boolean {
    return stock < 20;
  }

  abrirPanel(material?: any): void {
    if (material) {
      this.modoEdicion = true;
      this.materialSeleccionado = material;
      this.materialForm.patchValue({
        nombre_material: material.nombre_material,
        codigo_material: material.codigo_material,
        stock: material.stock
      });
    } else {
      this.modoEdicion = false;
      this.materialSeleccionado = null;
      this.materialForm.reset({ stock: 0 });
    }
    
    this.panelAbierto = true;
  }

  cerrarPanel(): void {
    this.panelAbierto = false;
    this.materialSeleccionado = null;
    this.modoEdicion = false;
  }

  onSubmitMaterial(): void {
    if (this.materialForm.invalid) return;

    const formValues = this.materialForm.value;

    if (this.modoEdicion && this.materialSeleccionado) {
      const payloadUpdate = {
        codigo_material: formValues.codigo_material,
        nombre_material: formValues.nombre_material,
        stock: formValues.stock
      };

      this.materialService.update(this.materialSeleccionado.material_id, payloadUpdate).subscribe({
        next: () => {
          this.cargarMateriales();
          this.cerrarPanel();
        },
        error: (err) => {
          alert('Error al actualizar el material');
        }
      });
    } else {
      const payloadCreate = {
        nombre_material: formValues.nombre_material,
        stock: formValues.stock
      };

      this.materialService.crear(payloadCreate).subscribe({
        next: () => {
          this.cargarMateriales();
          this.cerrarPanel();
        },
        error: (err) => {
          alert('Error al registrar el material');
        }
      });
    }
  }

  eliminarMaterial(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este material?')) {
      this.materialService.eliminar(id).subscribe({
        next: () => {
          this.cargarMateriales();
        },
        error: (err) => {
          alert('Error al eliminar el material');
        }
      });
    }
  }
}