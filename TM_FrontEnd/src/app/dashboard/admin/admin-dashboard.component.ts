import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbonentService } from '../../core/services/abonent.service';
import { CityService } from '../../core/services/city.service';
import { AuthService } from '../../auth/services/auth.service';
import { IAbonent, ICity } from '../../core/models/interfaces';
import { CityFormComponent } from './city-form/city-form.component';
import { AbonentFormComponent } from './abonent-form/abonent-form.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CityFormComponent, AbonentFormComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  view: 'abonents' | 'cities' | 'add-city' | 'add-abonent' = 'abonents';
  abonents: IAbonent[] = [];
  cities: ICity[] = [];

  constructor(
    private authService: AuthService,
    private abonentService: AbonentService,
    private cityService: CityService
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

  setView(viewName: 'abonents' | 'cities' | 'add-city' | 'add-abonent') {
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
  
  
  onAbonentAdded() {
    this.loadAbonents();
    this.setView('abonents'); 
  }

  
  onCityAdded() {
    this.loadCities();
    this.setView('cities'); 
  }
}