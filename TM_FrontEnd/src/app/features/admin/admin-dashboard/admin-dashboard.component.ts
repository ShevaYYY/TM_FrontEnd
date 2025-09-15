import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbonentService } from '../../../shared/services/abonent.service';
import { CityService } from '../../../shared/services/city.service';
import { AuthService } from '../../../core/services/auth.service';
import { CallService } from '../../../shared/services/call.service';
import { IAbonent, ICity, ICall } from '../../../shared/models/interfaces';
import { CityFormComponent } from '../components/city-form/city-form.component';
import { AbonentFormComponent } from '../components/abonent-form/abonent-form.component';
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
  callHistory: ICall[] = []; 
  selectedAbonent: IAbonent | null = null; 

  constructor(
    private authService: AuthService,
    private abonentService: AbonentService,
    private cityService: CityService,
    private callService: CallService 
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

  
  viewAbonentHistory(abonent: IAbonent) {
    if (!abonent._id) return;
    this.selectedAbonent = abonent; 
    this.callService.getCallsByAbonentId(abonent._id).subscribe({
      next: (calls) => {
        this.callHistory = calls;
        this.setView('call-history'); 
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