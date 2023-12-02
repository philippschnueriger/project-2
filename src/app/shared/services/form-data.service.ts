import { Injectable } from '@angular/core';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';

@Injectable({
  providedIn: 'root'
})

export class FormDataService {

    formData: {
        cityFrom: string;
        cityTo: string;
        departureDate: TuiDay | null;
        departureAndReturnDate: TuiDayRange | null;
        bookingClass: string;
        adults: number;
        vehicleType: string;
        sort: string;
      } = {
        cityFrom: 'New York',
        cityTo: 'Los Angeles',
        departureDate: TuiDay.currentLocal().append({ day: 1 }),
        departureAndReturnDate: new TuiDayRange(TuiDay.currentLocal().append({ day: 7 }), TuiDay.currentLocal().append({ day: 14 })),
        bookingClass: 'Economy',
        adults: 1,
        vehicleType: '',
        sort: ''
      };
      setFormData(data: any): void {
        this.formData = { ...this.formData, ...data };
      }
      clearFormData(): void {
        this.formData = {
          cityFrom: '',
          cityTo: '',
          departureDate: null,
          departureAndReturnDate: null,
          bookingClass: '',
          adults: 0,
          vehicleType: '',
          sort: ''
        };
      }
}