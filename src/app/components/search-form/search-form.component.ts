import { Component, OnInit, Input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { forbiddenNameValidator } from './forbidden-name.directive';
import { Router } from '@angular/router';
import { TuiDay } from '@taiga-ui/cdk';
import { ApiService } from '../../shared/services/api.service';
import { firstValueFrom } from 'rxjs';
import { tuiInputNumberOptionsProvider } from '@taiga-ui/kit';
import { FormDataService } from 'src/app/shared/services/form-data.service';
import { TripMode, BookingClass, VehicleType } from '../../shared/types/enums';
import { locationExistsValidator } from './location-validator';

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

  constructor(
    private router: Router,
    private apiService: ApiService,
    private formDataService: FormDataService
  ) {}

  tripModes: string[] = Object.values(TripMode);
  bookingClasses: string[] = Object.values(BookingClass);
  vehicleTypes: string[] = Object.values(VehicleType);

  fromLocations: any[] = [];
  fromLocations$: any;

  toLocations: any[] = [];
  toLocations$: any;

  selectedLocation: any = 'Test';

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
    this.searchForm = new FormGroup({
      tripMode: new FormControl(formData.tripMode),
      cityFrom: new FormControl(formData.cityFrom, {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [locationExistsValidator(this.apiService)],
      }),
      // cityFrom: new FormControl(formData.cityFrom, [
      //   Validators.required,
      //   Validators.minLength(3),
      //   this.locationExistsValidator(this.searchForm.value.cityFrom),
      // ]),
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
        Validators.required,
      ]),
      adults: new FormControl(formData.adults, [Validators.required]),
      children: new FormControl(formData.children),
      vehicleType: new FormControl(formData.vehicleType, [Validators.required]),
    });
  }

  locationValidator() {
    return null;
  }

  updateUrl(option: string): void {
    this.sort = option;
    this.loadData();
  }
  locationExistsValidator(location: string) {
    return async (
      control: AbstractControl
    ): Promise<ValidationErrors | null> => {
      const existingLocations = await firstValueFrom(
        this.apiService.getLocationId(location)
      );
      if (existingLocations) {
        return { locationNotFound: true };
      } else {
        return { locationCheckError: true };
      }
    };
  }

  async searchFromLocations() {
    if (this.searchForm.value.cityFrom.length >= 3) {
      this.fromLocations$ = this.apiService.getLocationId(
        this.searchForm.value.cityFrom
      );
      const locations: any = await firstValueFrom(this.fromLocations$);
      this.fromLocations = locations.locations;
      this.fromLocations = this.fromLocations.filter(
        (location) =>
          location.type === 'airport' ||
          (location.type === 'city' && location.airports > 1)
      );
    } else {
      this.fromLocations = [];
    }
  }

  async searchToLocations() {
    if (this.searchForm.value.cityTo.length >= 3) {
      this.toLocations$ = this.apiService.getLocationId(
        this.searchForm.value.cityTo
      );
      const locations: any = await firstValueFrom(this.toLocations$);
      this.toLocations = locations.locations;
      this.toLocations = this.toLocations.filter(
        (location) =>
          location.type === 'airport' ||
          (location.type === 'city' && location.airports > 1)
      );
    } else {
      this.toLocations = [];
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
    if (this.tripMode.value == 'Return') {
      departureDateValue = this.departureAndReturnDate.value.from
        .toString()
        .replace(/\./g, '/');
      returnDateValue = this.departureAndReturnDate.value.to
        .toString()
        .replace(/\./g, '/');
    } else {
      departureDateValue = this.departureDate.value
        .toString()
        .replace(/\./g, '/');
    }

    const bookingClass = this.mapBookingClass(this.bookingClass.value);
    const adults = this.adults.value;
    const children = this.children.value;
    const vehicleType = this.vehicleType.value;
    this.router.navigate(['/results'], {
      queryParams: {
        cityFrom: cityFromId,
        cityTo: cityToId,
        departureDate: departureDateValue,
        returnDate: returnDateValue,
        bookingClass: bookingClass,
        adults: adults,
        children: children,
        vehicleType: vehicleType,
        sort: this.sort,
      },
    });
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
  get children() {
    return this.searchForm.get('children')!;
  }
  get vehicleType() {
    return this.searchForm.get('vehicleType')!;
  }
  setFromLocation(location: any): void {
    this.searchForm.value.cityFrom = location.name;
  }
  setToLocation(location: any): void {
    this.searchForm.value.cityTo = location.name;
  }
}
