import { Injectable } from '@angular/core';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { FormData } from '../types/formData';
import { BookingClass, TripMode, VehicleType, Sort } from '../types/enums';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  formData: FormData = {
    tripMode: TripMode.Return,
    cityFrom: 'Zürich',
    cityTo: '',
    departureDate: TuiDay.currentLocal().append({ day: 1 }),
    departureAndReturnDate: new TuiDayRange(
      TuiDay.currentLocal().append({ day: 7 }),
      TuiDay.currentLocal().append({ day: 14 })
    ),
    bookingClass: BookingClass.Economy,
    adults: 1,
    children: 0,
    vehicleType: VehicleType.Aircraft,
    sort: Sort.Price
  };
  data: any;

  constructor(private authService: AuthService, private userService: UserService) {
    this.userService.userData$.subscribe((userData) => {
      this.data = userData;
    });
    this.loadFormData();
  }

  async loadFormData(): Promise<FormData> {
    try {
      const data = await this.userService.getUserPreferences();
      if (data) {
        this.setFormData(data);
      }
      return this.formData;
    } catch (error) {
      console.error('Error loading form data:', error);
      return this.formData;
    }
  }

  getFormData(): FormData {
    return this.formData;
  }

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
      vehicleType: VehicleType.Aircraft,
      sort: Sort.Price
    };
  }
}
