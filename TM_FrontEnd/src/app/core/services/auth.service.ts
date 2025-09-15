import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface IUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'client';
  isActivated: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api';
  private userSubject: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);
  public user$: Observable<IUser | null> = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userSubject.next(user);
    }
  }

  private setAuthData(data: AuthResponse) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.userSubject.next(data.user);
  }

  private clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  registration(registrationData: any): Observable<AuthResponse> {
    console.log('Відправляю запит на реєстрацію:', registrationData);
    return this.http.post<AuthResponse>(`${this.apiUrl}/registration`, registrationData)
      .pipe(
        tap(data => console.log('Успішна відповідь на реєстрацію:', data)),
        catchError(this.handleError)
      );
  }

  login(loginData: any): Observable<AuthResponse> {
    console.log('Відправляю запит на вхід:', loginData);
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(data => {
          console.log('Успішна відповідь на вхід:', data);
          this.setAuthData(data);
          this.router.navigate([data.user.role === 'admin' ? '/admin' : '/user']);
        }),
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    console.log('Відправляю запит на вихід');
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        console.log('Вихід успішний');
        this.clearAuthData();
      }),
      catchError(this.handleError)
    );
  }

  refresh(): Observable<AuthResponse> {
    console.log('Відправляю запит на оновлення токена');
    return this.http.get<AuthResponse>(`${this.apiUrl}/refresh`, { withCredentials: true })
      .pipe(
        tap(data => this.setAuthData(data)),
        catchError(this.handleError)
      );
  }

  getUsers(): Observable<IUser[]> {
    console.log('Відправляю запит на отримання користувачів');
    return this.http.get<IUser[]>(`${this.apiUrl}/users/getUsers`)
      .pipe(
        tap(data => console.log('Успішна відповідь на отримання користувачів:', data)),
        catchError(this.handleError)
      );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Сталася помилка HTTP:', error);
    return throwError(() => error);
  }

  get currentUser(): IUser | null {
    return this.userSubject.value;
  }
}