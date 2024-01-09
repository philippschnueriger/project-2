import { Component, OnInit, Input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TuiDay } from '@taiga-ui/cdk';
import { ApiService } from '../../../services/api.service';
import { firstValueFrom } from 'rxjs';
import { tuiInputNumberOptionsProvider } from '@taiga-ui/kit';
import { FormDataService } from 'src/app/services/form-data.service';
import { TripMode, BookingClass, VehicleType } from '../../../types/enums';
import { locationExistsValidator } from './location-validator';
import { getLocationId, mapBookingClass } from './search-form-utils';

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

  items: string[] = ['Quality', 'Price', 'Duration'];

  sort = 'quality';
  min = TuiDay.currentLocal();

  searchForm!: FormGroup;

  async ngOnInit(): Promise<void> {
    this.initializeForm();
    this.setInitialFormValues();
  }

  private initializeForm(): void {
    this.searchForm = new FormGroup({
      tripMode: new FormControl(''),
      cityFrom: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [locationExistsValidator(this.apiService)],
      }),
      cityTo: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [locationExistsValidator(this.apiService)],
      }),
      departureAndReturnDate: new FormControl('', [Validators.required]),
      departureDate: new FormControl('', [Validators.required]),
      bookingClass: new FormControl('', [Validators.required]),
      adults: new FormControl('', [Validators.required]),
      children: new FormControl(''),
      vehicleType: new FormControl('', [Validators.required]),
    });
  }

  private setInitialFormValues(): void {
    const formData = this.formDataService.getFormData();
    this.searchForm.patchValue(formData);
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

  getDateValues(
    tripMode: string,
    departureAndReturnDate: any,
    departureDate: any
  ): { departure: string; return?: string } {
    let departureDateValue = '';
    let returnDateValue = '';
    if (tripMode == 'Return') {
      departureDateValue = departureAndReturnDate.value.from
        .toString()
        .replace(/\./g, '/');
      returnDateValue = departureAndReturnDate.value.to
        .toString()
        .replace(/\./g, '/');
    } else {
      departureDateValue = departureDate.value.toString().replace(/\./g, '/');
    }
    return { departure: departureDateValue, return: returnDateValue };
  }

  async loadData() {
    this.formDataService.setFormData(this.searchForm.value);
    const dates = this.getDateValues(
      this.tripMode.value,
      this.departureAndReturnDate,
      this.departureDate
    );
    const queryParams = {
      cityFrom: await getLocationId(this.apiService, this.cityFrom.value),
      cityTo: await getLocationId(this.apiService, this.cityTo.value),
      departureDate: dates.departure,
      returnDate: dates.return,
      bookingClass: mapBookingClass(this.bookingClass.value),
      adults: this.adults.value,
      children: this.children.value,
      vehicleType: this.vehicleType.value,
      sort: this.sort,
    };
    this.router.navigate(['/results'], { queryParams });
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
