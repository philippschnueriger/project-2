import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TuiDay } from '@taiga-ui/cdk';
import { Observable, firstValueFrom, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.kiwi.baseUrl;
  nextWeek = TuiDay.currentLocal().append({ day: 7 });

  getData(
    from = 'ZRH',
    to = 'FRA',
    departureDate = this.nextWeek.toString().replace(/\./g, '/'),
    returnDate = this.nextWeek.toString().replace(/\./g, '/'),
    bookingClass = 'C',
    adults = 1,
    children = 0,
    vehicleType = 'aircraft',
    sort = 'quality'
  ) {
    const url =
      `${this.baseUrl}/v2/search?fly_from=${from}` +
      `&fly_to=${to}` +
      `&date_from=${departureDate}&date_to=${departureDate}` +
      `&return_from=${returnDate}&return_to=${returnDate}` +
      `&selected_cabins=${bookingClass}` + 
      `&adults=${adults}` +
      `&children=${children}` +
      `&vehicle_type=${vehicleType.toLowerCase()}` +
      `&curr=CHF` +
      `&sort=${sort}` +
      `&limit=20`;

    return this.http.get(url);
  }

  getLocationId(location: string) {
    return this.http.get(
      `${this.baseUrl}/locations/query?term=${location}&limit=10`
    );
  }

  validateBookingToken(booking_token: string) {
    const bnum = '0';
    const adults = '1';
    return this.http.get(
      `${this.baseUrl}/v2/booking/check_flights?booking_token=${booking_token}&bnum=${bnum}&adults=${adults}`
    );
  }

  validateValue(value: any): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.locationExists(value)
        .then((locationExists) => {
          observer.next(locationExists);
          observer.complete();
        })
        .catch((error) => {
          console.error('Error occurred while validating location:', error);
          observer.next(false); // Return false in case of an error
          observer.complete();
        });
    });
  }

  async locationExists(location: string): Promise<boolean> {
    try {
      let response: any = await firstValueFrom(this.getLocationId(location));
      response = response.locations.filter(
        (location: any) =>
          location.type === 'airport' ||
          (location.type === 'city' && location.airports > 1)
      );
      return response.length > 0;
    } catch (error) {
      console.error('Error occurred while checking location existence:', error);
      return false; // Return false in case of an error
    }
  }
}
