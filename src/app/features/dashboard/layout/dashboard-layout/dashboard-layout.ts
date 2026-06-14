import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css']
})
export class DashboardLayoutComponent implements OnInit {
  municipioNombre: string = '';
  usuarioUsername: string = '';
  usuarioRol: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.usuarioUsername = localStorage.getItem('username') || 'Usuario Desconocido';
    this.usuarioRol = localStorage.getItem('role') === 'ROLE_ADMIN' ? 'Administrador' : 'Coordinador Municipal';
    const muniId = localStorage.getItem('municipalidadId');
    this.municipioNombre = `Municipalidad (ID: ${muniId})`;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}