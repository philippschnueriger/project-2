import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {TuiDay} from '@taiga-ui/cdk';
import { FormDataService } from 'src/app/services/form-data.service';
import { getLocationId, mapBookingClass } from '../../shared/search-form/search-form-utils';
import { ApiService } from 'src/app/services/api.service';
import { BookingClass, TripMode, VehicleType } from 'src/app/types/enums';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router, private formDataService: FormDataService, private apiService: ApiService) {}

  async exploreDestinations() {
    let searchForm = this.formDataService.getFormData();
    searchForm.cityTo = '';
    searchForm.tripMode = TripMode.OneWay;
    searchForm.bookingClass = BookingClass.Economy;
    searchForm.adults = 1;
    searchForm.children = 0;
    searchForm.vehicleType = VehicleType.Aircraft
    searchForm.departureDate = TuiDay.currentLocal().append({ day: 7 });
    this.formDataService.setFormData(searchForm);
    
    const queryParams = {
      cityFrom: await getLocationId(this.apiService, searchForm.cityFrom),
      departureDate: searchForm.departureDate.toString().replace(/\./g, '/'),
      adults: searchForm.adults,
      children: searchForm.children,
      vehicleType: searchForm.vehicleType,
      bookingClass: mapBookingClass(searchForm.bookingClass),
    };

    this.router.navigate(['/results'], { queryParams });
    
  }
}
