import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TripMode, BookingClass, VehicleType } from '../../../types/enums';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { locationExistsValidator } from '../../shared/search-form/location-validator';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  error: null | undefined | string = null;
  showOverlay: boolean = false;
  preferencesForm!: FormGroup;
  tripModes: string[] = Object.values(TripMode);
  bookingClasses: string[] = Object.values(BookingClass);
  vehicleTypes: string[] = Object.values(VehicleType);
  fromLocations: any[] = [];
  fromLocations$: any;
  items: any;
  userPreferences: any = {
    adults: 1,
    vehicleType: 'Aircraft',
    children: 0,
    bookingClass: 'Economy',
    cityFrom: 'London',
    tripMode: 'Return',
  };
  showPreferences: boolean = false;
  showPassword: boolean = false;
  passwordForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    this.userPreferences = await this.authService.getUserPreferences();
    this.preferencesForm = new FormGroup({
      tripMode: new FormControl(this.userPreferences.tripMode),
      cityFrom: new FormControl(this.userPreferences.cityFrom, {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [locationExistsValidator(this.apiService)],
      }),
      bookingClass: new FormControl('Economy', [Validators.required]),
      adults: new FormControl(1, [Validators.required]),
      children: new FormControl(0),
      vehicleType: new FormControl('Aircraft', [Validators.required]),
    });
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('',[ Validators.required]), // Create form controls with validators
      newPassword: new FormControl('',[ Validators.required]),
      confirmPassword: new FormControl('',[ Validators.required]),
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      this.error = null;
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.error = 'unknown error';
      console.log(error);
    }
  }
  async updatePassword() {
    console.log('update password');
    //await this.authService.changePassword(password) // TODO
  }
  toggleOverlay(content: string) {
    if (content === 'preferences') {
      this.showPreferences = true;
    }
    else if (content === 'password') {
      this.showPassword = true;
    } else {
      this.showPreferences = false;
      this.showPassword = false;
    }
    this.showOverlay = !this.showOverlay;
  }
  async submitPreferences() {
    await this.authService.saveUserPreferences(this.preferencesForm.value);
    this.userPreferences = await this.authService.getUserPreferences();
    this.toggleOverlay('close');
  }

  async searchFromLocations() {
    if (this.preferencesForm.value.cityFrom.length >= 3) {
      this.fromLocations$ = this.apiService.getLocationId(
        this.preferencesForm.value.cityFrom
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
  setFromLocation(location: any): void {
    this.preferencesForm.value.cityFrom = location.name;
  }
  submitPassword(): void {
    this.toggleOverlay('close');
    if (this.passwordForm.valid) {
      console.log('submit password');
    }
  }
}
