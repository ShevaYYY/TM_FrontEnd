import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let authReq = req;
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      });
    }

    
    return next.handle(authReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.authService.refresh().pipe(
            switchMap((authResponse) => {
              
              localStorage.setItem('accessToken', authResponse.accessToken);
              // Повторно відправляємо оригінальний запит з новим токеном
              const newAuthReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${authResponse.accessToken}`)
              });
              return next.handle(newAuthReq);
            }),
            catchError(refreshError => {
              
              
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}