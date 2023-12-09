import { Injectable } from '@angular/core';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { FormData } from '../types/formData';
import { BookingClass, TripMode, VehicleType, Sort } from '../types/enums';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  formData: FormData = {
    tripMode: TripMode.Return,
    cityFrom: 'New York',
    cityTo: 'Los Angeles',
    departureDate: TuiDay.currentLocal().append({ day: 1 }),
    departureAndReturnDate: new TuiDayRange(
      TuiDay.currentLocal().append({ day: 7 }),
      TuiDay.currentLocal().append({ day: 14 })
    ),
    bookingClass: BookingClass.Economy,
    adults: 1,
    children: 0,
    bags: 0,
    vehicleType: VehicleType.Aircraft,
    sort: Sort.Price
  };

  setFormData(data: Partial<FormData>): void {
    this.formData = { ...this.formData, ...data };
  }

  clearFormData(): void {
    this.formData = {
      tripMode: TripMode.Return,
      cityFrom: '',
      cityTo: '',
      departureDate: null,
      departureAndReturnDate: null,
      bookingClass: BookingClass.Economy,
      adults: 1,
      children: 0,
      bags: 0,
      vehicleType: VehicleType.Aircraft,
      sort: Sort.Price
    };
  }
}
