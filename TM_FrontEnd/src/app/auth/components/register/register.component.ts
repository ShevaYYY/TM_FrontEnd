import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)])
  });

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.registration(this.registerForm.value).subscribe({
        next: (data) => {
          console.log('Registration successful', data);
          this.router.navigate(['/']); // Перенаправлення на головну сторінку після успішної реєстрації
        },
        error: (err) => {
          console.error('Registration failed', err);
          
        }
      });
    }
  }
}