import { Component, inject, signal } from '@angular/core';
import { Header } from '../../header/header';
import { FormsModule } from '@angular/forms';
import { DeliveryApi } from '../../services/delivery-api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-track',
  imports: [Header, FormsModule],
  templateUrl: './track.html',
  styleUrl: './track.css',
})
export class Track {
  trackNumber = '';
  trackResult: any = signal(null);

  toastr = inject(ToastrService);

  constructor(private deliveryApi: DeliveryApi) { }

  trackShipment(): void {
    const rawValue = this.trackNumber.trim();

    if (!rawValue) {
      this.toastr.error('Заполните номер отправления');
      return;
    }

    this.trackResult.set(null);
    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue) || numericValue <= 0) {
      this.toastr.error('Введите корректный номер отправления');
      return;
    }

    // this.trackResult.set({
    //   id: 1,
    //   route: {
    //     from: 'Москва, улица Арбат, 1',
    //     to: 'Минск, проспект Независимости, 58'
    //   },
    //   statuses: [
    //     { type: 'created', label: 'Создан', date: '10.01.2026' },
    //     { type: 'in-way', label: 'В пути: Вязьма', date: '15.01.2026' },
    //     { type: 'in-way', label: 'В пути: Орша', date: '16.01.2026' },
    //     { type: 'in-way', label: 'В пути: Минск', date: '18.01.2026' },
    //     { type: 'ready', label: 'Готов к выдаче', date: '25.01.2026' },
    //     { type: 'done', label: 'Вручен', date: '27.01.2026' }
    //   ]
    // });

    this.deliveryApi.getDeliveryInfo(numericValue).subscribe((response) => {
      if ('error' in response) {
        this.toastr.error(response.error);
        return;
      }

      this.toastr.success('Информация успешно получена!');
      this.trackResult.set(response);
    });
  }
}
