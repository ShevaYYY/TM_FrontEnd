import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICall } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  startCall(abonentId: string, phoneNumber: string): Observable<ICall> {
    return this.http.post<ICall>(`${this.apiUrl}/calls`, { abonentId, phoneNumber });
  }

  endCall(callId: string): Observable<ICall> {
    return this.http.post<ICall>(`${this.apiUrl}/calls/${callId}/end`, {});
  }

  
  getCallsByAbonentId(abonentId: string): Observable<ICall[]> {
    return this.http.get<ICall[]>(`${this.apiUrl}/calls/abonent/${abonentId}`);
  }
}
