import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forbiddenNameValidator } from './forbidden-name.directive';
import { Router } from '@angular/router';
import {TuiDay} from '@taiga-ui/cdk';
import { ApiService } from '../../shared/services/api.service';
import { firstValueFrom } from 'rxjs';
import {tuiInputNumberOptionsProvider} from '@taiga-ui/kit';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  providers: [
    tuiInputNumberOptionsProvider({
        decimal: 'never',
        step: 1,
    }),
],
})
export class SearchFormComponent implements OnInit {
  constructor(private router: Router, private apiService: ApiService) {
    
  }
  
  search = { cityFrom: 'Zürich', cityTo: 'Frankfurt', departureDate: TuiDay.currentLocal().append({ day: 1 }), bookingClass: 'Economy', adults: 1, trains: false };
  min = TuiDay.currentLocal();
  bookingClasses = [
    'Economy',
    'Premium Economy',
    'Business Class',
    'First Class'
  ];

  mapBookingClass(bookingClass: string): string {
    switch (bookingClass) {
      case 'Economy':
        return 'M';
      case 'Premium Economy':
        return 'W';
      case 'Business Class':
        return 'C';
      case 'First Class':
        return 'F';
      default:
        return 'M';
    }
  }

  mapVehicleType(trains: boolean): string {
    return trains ? 'train' : 'aircraft';
  }

  searchForm!: FormGroup;

  ngOnInit(): void {
    this.searchForm = new FormGroup(
      {
        cityFrom: new FormControl(this.search.cityFrom, [
          Validators.required,
          Validators.minLength(3),
          forbiddenNameValidator(/XYZ/i),
        ]),
        cityTo: new FormControl(this.search.cityTo, [
          Validators.required,
          Validators.minLength(3),
          forbiddenNameValidator(/XYZ/i),
        ]),
        departureDate: new FormControl(this.search.departureDate, [
          Validators.required,
          //Validators.pattern(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
        ]),
        bookingClass: new FormControl(this.search.bookingClass, [
          Validators.required
        ]),
        adults: new FormControl(this.search.adults, [
          Validators.required
        ]),
        trains: new FormControl(this.search.trains, [
          Validators.required
        ]),
      },
    );
  }

  async loadData() {
    let cityFromId = '';
    let cityToId = '';
    try {
      const data$ = this.apiService.getLocationId(this.cityFrom.value);
      const data: any = await firstValueFrom(data$);
      cityFromId = data.locations[0].id;
    } catch (error) {
      console.error('Error getting location ID:', error);
    }
    try {
      const data$ = this.apiService.getLocationId(this.cityTo.value);
      const data: any = await firstValueFrom(data$);
      cityToId = data.locations[0].id;
    } catch (error) {
      console.error('Error getting location ID:', error);
    }
    const departureDate = this.departureDate.value.toString().replace(/\./g, '/');
    const bookingClass = this.mapBookingClass(this.bookingClass.value);
    const adults = this.adults.value;
    const vehicleType = this.mapVehicleType(this.trains.value);
    this.router.navigate(
      ['/results'],
      {
        queryParams: {
          cityFrom: cityFromId,
          cityTo: cityToId,
          departureDate: departureDate,
          bookingClass: bookingClass,
          adults: adults,
          vehicleType: vehicleType
        },
      }
    );
  }

  get cityFrom() {
    return this.searchForm.get('cityFrom')!;
  }
  get cityTo() {
    return this.searchForm.get('cityTo')!;
  }
  get departureDate() {
    return this.searchForm.get('departureDate')!;
  }
  get bookingClass() {
    return this.searchForm.get('bookingClass')!;
  }
  get adults() {
    return this.searchForm.get('adults')!;
  }
  get trains() {
    return this.searchForm.get('trains')!;
  }
}

