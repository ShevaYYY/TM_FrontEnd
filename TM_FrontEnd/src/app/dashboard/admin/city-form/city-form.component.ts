import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CityService } from '../../../core/services/city.service';

@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './city-form.component.html',
  styleUrl: './city-form.component.scss'
})
export class CityFormComponent {
  @Output() cityAdded = new EventEmitter<void>();

  cityForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    dayTariff: new FormControl(null, [Validators.required, Validators.min(0)]),
    nightTariff: new FormControl(null, [Validators.required, Validators.min(0)])
  });

  constructor(private cityService: CityService) { }

  onSubmit() {
    if (this.cityForm.valid) {
      this.cityService.createCity(this.cityForm.value).subscribe({
        next: (city) => {
          console.log('City added successfully', city);
          this.cityForm.reset();
          this.cityAdded.emit();
        },
        error: (err) => {
          console.error('Failed to add city', err);
        }
      });
    }
  }
}