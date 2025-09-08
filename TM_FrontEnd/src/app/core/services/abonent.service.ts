import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAbonent, IUser } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AbonentService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  getAllAbonents(): Observable<IAbonent[]> {
    return this.http.get<IAbonent[]>(`${this.apiUrl}/abonents`);
  }

  createAbonent(abonentData: any): Observable<IAbonent> {
    return this.http.post<IAbonent>(`${this.apiUrl}/abonents`, abonentData);
  }
}