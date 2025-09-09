// src/app/dashboard/admin/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbonentService } from '../../core/services/abonent.service';
import { CityService } from '../../core/services/city.service';
import { AuthService } from '../../auth/services/auth.service';
import { CallService } from '../../core/services/call.service';
import { IAbonent, ICity, ICall } from '../../core/models/interfaces';
import { CityFormComponent } from './city-form/city-form.component';
import { AbonentFormComponent } from './abonent-form/abonent-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
 imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    CityFormComponent,
    AbonentFormComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  view: 'abonents' | 'cities' | 'add-city' | 'add-abonent' | 'call-history' = 'abonents';
  abonents: IAbonent[] = [];
  cities: ICity[] = [];
  callHistory: ICall[] = []; // New field for call history
  selectedAbonent: IAbonent | null = null; // New field for the selected abonent

  constructor(
    private authService: AuthService,
    private abonentService: AbonentService,
    private cityService: CityService,
    private callService: CallService // Inject CallService
  ) { }

  ngOnInit(): void {
    this.loadAbonents();
    this.loadCities();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => console.log('Logout successful'),
      error: (err) => console.error('Logout failed', err)
    });
  }

  setView(viewName: 'abonents' | 'cities' | 'add-city' | 'add-abonent' | 'call-history') {
    this.view = viewName;
  }

  loadAbonents() {
    this.abonentService.getAllAbonents().subscribe({
      next: (data) => {
        this.abonents = data;
      },
      error: (err) => {
        console.error('Failed to load abonents', err);
      }
    });
  }

  loadCities() {
    this.cityService.getAllCities().subscribe({
      next: (data) => {
        this.cities = data;
      },
      error: (err) => {
        console.error('Failed to load cities', err);
      }
    });
  }

  // New method to load abonent's call history
  viewAbonentHistory(abonent: IAbonent) {
    if (!abonent._id) return;
    this.selectedAbonent = abonent; // Store the selected abonent
    this.callService.getCallsByAbonentId(abonent._id).subscribe({
      next: (calls) => {
        this.callHistory = calls;
        this.setView('call-history'); // Change view to show history
      },
      error: (err) => {
        console.error('Failed to load call history', err);
      }
    });
  }

  onAbonentAdded() {
    this.loadAbonents();
    this.setView('abonents');
  }

  onCityAdded() {
    this.loadCities();
    this.setView('cities');
  }

  deleteAbonent(id: string) {
    this.abonentService.deleteAbonent(id).subscribe({
      next: () => {
        console.log('Abonent deleted successfully');
        this.loadAbonents();
      },
      error: (err) => {
        console.error('Failed to delete abonent', err);
      }
    });
  }

  deleteCity(id: string) {
    this.cityService.deleteCity(id).subscribe({
      next: () => {
        console.log('City deleted successfully');
        this.loadCities();
      },
      error: (err) => {
        console.error('Failed to delete city', err);
      }
    });
  }

  // Method to format duration
  formatDuration(seconds?: number): string {
    if (seconds === undefined || seconds === null) return '—';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} хв ${remainingSeconds} сек`;
  }
}