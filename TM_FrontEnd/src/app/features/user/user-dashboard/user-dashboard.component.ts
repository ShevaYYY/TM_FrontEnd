import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CallService } from '../../../shared/services/call.service';
import { AbonentService } from '../../../shared/services/abonent.service';
import { ICall, IUser, IAbonent } from '../../../shared/models/interfaces';
import { timer, Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule

   ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  currentUser: IUser | null = null;
  abonent: IAbonent | null = null;
  callHistory: ICall[] = [];
  phoneNumber: string = '';
  isCalling: boolean = false;
  currentCall: ICall | null = null;
  timerSubscription: Subscription | null = null;
  callDuration: number = 0;

  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private callService: CallService,
    private abonentService: AbonentService
  ) { }

  ngOnInit(): void {
    console.log('NGONINIT: Початок ініціалізації компонента.');
    this.userSubscription = this.authService.user$.subscribe(user => {
      console.log('AUTH SERVICE: Отримано нового користувача:', user);
      this.currentUser = user;
      if (this.currentUser && this.currentUser.id) {
        console.log('NGONINIT: Користувач завантажений. Запускаю завантаження даних абонента.');
        this.loadAbonentData();
      } else {
        console.log('NGONINIT: Користувач не завантажений або відсутній _id.');
      }
    });
  }

  ngOnDestroy(): void {
    console.log('NGONDESTROY: Компонент знищується. Відписка від Observables.');
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      console.log('NGONDESTROY: Відписка від таймера.');
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
      console.log('NGONDESTROY: Відписка від підписки на користувача.');
    }
  }

  loadAbonentData() {
    console.log('LOAD ABONENT DATA: Запуск завантаження даних абонента.');
    const userId = this.currentUser!.id;
    console.log('LOAD ABONENT DATA: Відправляю запит на завантаження абонента для userId:', userId);

    this.abonentService.getAbonentByUserId(userId).subscribe({
      next: (data) => {
        console.log('LOAD ABONENT DATA: Успішна відповідь. Отримано дані абонента:', data);
        this.abonent = data;
        if (this.abonent) {
          console.log('LOAD ABONENT DATA: Абонент знайдений. Завантажую історію дзвінків.');
          this.loadCallHistory();
        } else {
          console.log('LOAD ABONENT DATA: Абонент не знайдений.');
        }
      },
      error: (err) => {
        console.error('LOAD ABONENT DATA: Помилка завантаження даних абонента', err);
      }
    });
  }

  loadCallHistory() {
    console.log('LOAD CALL HISTORY: Запуск завантаження історії дзвінків.');
    if (!this.abonent) {
      console.warn('LOAD CALL HISTORY: Дані абонента відсутні. Перериваю запит.');
      this.callHistory = [];
      return;
    }

    const abonentId = this.abonent._id;
    console.log('LOAD CALL HISTORY: Відправляю запит на історію дзвінків для abonentId:', abonentId);

    this.callService.getCallsByAbonentId(abonentId).subscribe({
      next: (calls) => {
        console.log('LOAD CALL HISTORY: Успішна відповідь. Отримано історію дзвінків:', calls);
        this.callHistory = calls;
      },
      error: (err) => {
        console.error('LOAD CALL HISTORY: Помилка завантаження історії дзвінків', err);
      }
    });
  }

  startCall() {
    console.log('START CALL: Запуск дзвінка.');
    if (!this.phoneNumber || !this.abonent || !this.abonent._id) {
      console.error('START CALL: Недійсний номер телефону або дані абонента відсутні.');
      return;
    }

    const abonentId = this.abonent._id;
    console.log('START CALL: Відправляю запит на початок дзвінка з abonentId:', abonentId, 'і номером:', this.phoneNumber);
    this.isCalling = true;

    this.callService.startCall(abonentId, this.phoneNumber).subscribe({
      next: (call) => {
        console.log('START CALL: Успішна відповідь. Дзвінок розпочато:', call);
        this.currentCall = call;
        this.startTimer();
      },
      error: (err) => {
        console.error('START CALL: Помилка під час початку дзвінка', err);
        this.isCalling = false;
      }
    });
  }

  endCall() {
    console.log('END CALL: Запуск завершення дзвінка.');
    if (!this.currentCall || !this.currentCall._id) {
      console.error('END CALL: Немає активного дзвінка для завершення.');
      return;
    }

    const callId = this.currentCall._id;
    console.log('END CALL: Відправляю запит на завершення дзвінка з callId:', callId);
    this.isCalling = false;
    this.stopTimer();

    this.callService.endCall(callId).subscribe({
      next: (call) => {
        console.log('END CALL: Успішна відповідь. Дзвінок завершено:', call);
        this.currentCall = null;
        this.phoneNumber = '';
        this.loadCallHistory();
      },
      error: (err) => {
        console.error('END CALL: Помилка під час завершення дзвінка', err);
      }
    });
  }

  startTimer() {
    console.log('TIMER: Таймер розпочато.');
    this.callDuration = 0;
    this.timerSubscription = timer(0, 1000).subscribe(() => {
      this.callDuration++;
    });
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      console.log('TIMER: Таймер зупинено.');
    }
  }

  formatDuration(seconds?: number): string {
    if (seconds === undefined || seconds === null) return '—';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} хв ${remainingSeconds} сек`;
  }

  logout() {
    console.log('LOGOUT: Запуск виходу.');
    this.authService.logout().subscribe({
      next: () => {
        console.log('LOGOUT: Вихід успішний.');
      },
      error: (err) => {
        console.error('LOGOUT: Помилка виходу', err);
      }
    });
  }
}