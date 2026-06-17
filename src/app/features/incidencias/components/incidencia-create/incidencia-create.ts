import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IncidenciaService } from '../../../../core/services/incidencia';

@Component({
  selector: 'app-incidencia-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incidencia-create.html',
  styleUrls: ['./incidencia-create.css']
})
export class IncidenciaCreateComponent implements OnInit {
  crearForm!: FormGroup;
  archivoCapturado: File | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private incidenciaService: IncidenciaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.crearForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.archivoCapturado = file;
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/incidencias']);
  }

  onSubmit(): void {
    if (this.crearForm.invalid || !this.archivoCapturado) {
      return;
    }

    this.isLoading = true;

    const incidenciaObjeto = {
      descripcion: this.crearForm.value.descripcion,
      estado: "PENDIENTE",
      detalles: []
    };

    const formData = new FormData();
    formData.append('incidencia', JSON.stringify(incidenciaObjeto));
    formData.append('image', this.archivoCapturado);

    this.incidenciaService.crear(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/incidencias']); 
      },
      error: (err) => {
        this.isLoading = false;
        alert('Hubo un error al guardar la incidencia.');
      }
    });
  }
}