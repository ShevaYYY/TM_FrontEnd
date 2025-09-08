import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICity } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  getAllCities(): Observable<ICity[]> {
    return this.http.get<ICity[]>(`${this.apiUrl}/cities`);
  }

  createCity(cityData: any): Observable<ICity> {
    return this.http.post<ICity>(`${this.apiUrl}/cities`, cityData);
  }
}