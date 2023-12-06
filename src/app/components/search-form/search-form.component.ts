import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forbiddenNameValidator } from './forbidden-name.directive';
import { Router } from '@angular/router';
import {TuiDay} from '@taiga-ui/cdk';
import { ApiService } from '../../shared/services/api.service';
import { firstValueFrom, throttleTime } from 'rxjs';
import {tuiInputNumberOptionsProvider} from '@taiga-ui/kit';
import { FormDataService } from 'src/app/shared/services/form-data.service';
import { TripMode, BookingClass, VehicleType } from '../../shared/types/enums';

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

  constructor(private router: Router, private apiService: ApiService , private formDataService: FormDataService) {}

  tripModes: string[] = Object.values(TripMode);
  bookingClasses: string[] = Object.values(BookingClass);
  vehicleTypes: string[] = Object.values(VehicleType);

  locations: any[] = [];
  locations$: any;

  selectedLocation: any = "Test"

  items: string[] = ['Quality', 'Price', 'Duration'];
  
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

  searchForm!: FormGroup;

  ngOnInit(): void {
    const formData = this.formDataService.formData;
    this.searchForm = new FormGroup(
      {
        form: new FormControl(''),
        tripMode: new FormControl(formData.tripMode),
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
        departureAndReturnDate: new FormControl(formData.departureAndReturnDate, [
          Validators.required,
          //Validators.pattern(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
        ]),
        departureDate: new FormControl(formData.departureDate, [
          Validators.required,
          //Validators.pattern(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
        ]),
        bookingClass: new FormControl(formData.bookingClass, [
          Validators.required
        ]),
        adults: new FormControl(formData.adults, [
          Validators.required
        ]),
        vehicleType: new FormControl(formData.vehicleType, [
          Validators.required
        ]),
      },
    );
  }

  updateUrl(option: string): void {
    this.sort = option;
    this.loadData();
  }

  async searchLocations() {
    if (this.searchForm.value.form.length >= 3) {
      this.locations$ = this.apiService.getLocationId(this.searchForm.value.form)
      const locations: any = await firstValueFrom(this.locations$)
      this.locations = locations.locations;
      this.locations = this.locations.filter(location => location.type === 'airport' || (location.type === 'city' && location.airports > 1));
    } else {
      this.locations = [];
    }
  }

  async loadData() {
    this.formDataService.setFormData(this.searchForm.value);
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
    if (this.tripMode.value == "Return"){
      departureDateValue = this.departureAndReturnDate.value.from.toString().replace(/\./g, '/');
      returnDateValue = this.departureAndReturnDate.value.to.toString().replace(/\./g, '/');
    } else {
      departureDateValue = this.departureDate.value.toString().replace(/\./g, '/');
    } 

    const bookingClass = this.mapBookingClass(this.bookingClass.value);
    const adults = this.adults.value;
    const vehicleType = this.vehicleType.value;
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

  get tripMode() {
    return this.searchForm.get('tripMode')!;
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
  get vehicleType() {
    return this.searchForm.get('vehicleType')!;
  }
  onClick(location: any): void {
    console.log("click")
    this.searchForm.value.form = location.name
    console.log(location.name);
  }
  
}

