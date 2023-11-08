import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { TuiDay } from '@taiga-ui/cdk';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.kiwi.baseUrl;
  nextWeek = TuiDay.currentLocal().append({ day: 7 });

  getData(from = 'ZRH', to = 'FRA', departureDate = this.nextWeek.toString().replace(/\./g, '/'), trains = false) {
    const vehicles = trains ? '&vehicle_type=train' : '';
    return this.http
      .get(`${this.baseUrl}/v2/search?fly_from=${from}&fly_to=${to}&date_from=${departureDate}&date_to=${departureDate}&curr=CHF${vehicles}`);
  }

  getLocationId(location: string) {
    return this.http
      .get(`${this.baseUrl}/locations/query?term=${location}`);
  }

  validateBookingToken(booking_token: string) {
    const bnum = "0"
    const adults = "1"
    return this.http
      .get(`${this.baseUrl}/v2/booking/check_flights?booking_token=${booking_token}&bnum=${bnum}&adults=${adults}`);
  }
}
