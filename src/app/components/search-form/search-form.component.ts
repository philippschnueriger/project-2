import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forbiddenNameValidator } from './forbidden-name.directive';
import { Router } from '@angular/router';
import {TuiDay, TuiDayRange} from '@taiga-ui/cdk';
import { ApiService } from '../../shared/services/api.service';
import { firstValueFrom } from 'rxjs';
import {tuiInputNumberOptionsProvider} from '@taiga-ui/kit';
import { FormDataService } from 'src/app/shared/services/form-data.service';
import { TripMode, BookingClass } from '../../shared/types/enums';

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
  @Input() filters: any;
  constructor(private router: Router, private apiService: ApiService , private formDataService: FormDataService) {
    
  }
  tripModes: string[] = Object.values(TripMode);
  bookingClasses: string[] = Object.values(BookingClass);
  
  search = { tripmode: TripMode.Return, cityFrom: 'Zürich', cityTo: 'Frankfurt', departureAndReturnDate: new TuiDayRange(TuiDay.currentLocal().append({ day: 7 }), TuiDay.currentLocal().append({ day: 14 })), departureDate: TuiDay.currentLocal().append({ day: 1 }), bookingClass: 'Economy', adults: 1, trains: false};
  sort = 'quality';
  min = TuiDay.currentLocal();
  

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
    const formData = this.formDataService.formData;
    this.searchForm = new FormGroup(
      {
        tripmode: new FormControl(this.search.tripmode),
        cityFrom: new FormControl(formData.cityFrom, [
          Validators.required,
          Validators.minLength(3),
          forbiddenNameValidator(/XYZ/i),
        ]),
        cityTo: new FormControl(formData.cityTo, [
          Validators.required,
          Validators.minLength(3),
          forbiddenNameValidator(/XYZ/i),
        ]),
        departureAndReturnDate: new FormControl(this.search.departureAndReturnDate, [
          Validators.required,
          //Validators.pattern(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
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
    console.log(this.search.tripmode)
  }

  updateUrl(option: string): void {
    this.sort = option;
    this.loadData();
  }

  async loadData() {
    this.formDataService.setFormData(this.searchForm.value);
    console.log(this.searchForm.value);
    let cityFromId = '';
    let cityToId = '';
    let departureDateValue = '';
    let returnDateValue = '';
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
    if (this.tripmode.value == "Return"){
      departureDateValue = this.departureAndReturnDate.value.from.toString().replace(/\./g, '/');
      returnDateValue = this.departureAndReturnDate.value.to.toString().replace(/\./g, '/');
    } else {
      departureDateValue = this.departureDate.value.toString().replace(/\./g, '/');
    } 

    const bookingClass = this.mapBookingClass(this.bookingClass.value);
    const adults = this.adults.value;
    const vehicleType = this.mapVehicleType(this.trains.value);
    this.router.navigate(
      ['/results'],
      {
        queryParams: {
          cityFrom: cityFromId,
          cityTo: cityToId,
          departureDate: departureDateValue,
          returnDate: returnDateValue,
          bookingClass: bookingClass,
          adults: adults,
          vehicleType: vehicleType,
          sort: this.sort,
        },
      }
    );
  }

  get tripmode() {
    return this.searchForm.get('tripmode')!;
  }
  get cityFrom() {
    return this.searchForm.get('cityFrom')!;
  }
  get cityTo() {
    return this.searchForm.get('cityTo')!;
  }
  get departureAndReturnDate() {
    return this.searchForm.get('departureAndReturnDate')!;
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

