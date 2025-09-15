import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbonentService } from '../../../../shared/services/abonent.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CityService } from '../../../../shared/services/city.service';
import { ICity, IUser } from '../../../../shared/models/interfaces';



@Component({
  selector: 'app-abonent-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './abonent-form.component.html',
  styleUrl: './abonent-form.component.scss'
})
export class AbonentFormComponent implements OnInit {
  @Output() abonentAdded = new EventEmitter<void>();

  abonentForm = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    codeEDRPOU: new FormControl('', [Validators.required]),
    cityId: new FormControl('', [Validators.required])
  });

  users: IUser[] = [];
  cities: ICity[] = [];

  constructor(
    private abonentService: AbonentService,
    private authService: AuthService,
    private cityService: CityService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadCities();
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Failed to load users', err);
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

  onSubmit() {
    if (this.abonentForm.valid) {
      this.abonentService.createAbonent(this.abonentForm.value).subscribe({
        next: (abonent) => {
          console.log('Abonent added successfully', abonent);
          this.abonentForm.reset();
          this.abonentAdded.emit();
        },
        error: (err) => {
          console.error('Failed to add abonent', err);
        }
      });
    }
  }
}