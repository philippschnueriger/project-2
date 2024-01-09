import { Component, Input, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Destination } from 'src/app/types/destination';
import { AuthService } from 'src/app/services/auth.service';
import { FormDataService } from 'src/app/services/form-data.service';
import {
  getDateValues,
  getLocationId,
  mapBookingClass,
} from '../search-form/search-form-utils';

@Component({
  selector: 'app-destination-card',
  templateUrl: './destination-card.component.html',
  styleUrls: ['./destination-card.component.scss'],
})
export class DestinationCardComponent {
  @Input() region: string = 'All';
  @Input() order: string = 'Popularity';

  originalDestinationsArray: Destination[] = [];
  destinationsArray: Destination[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private formDataService: FormDataService
  ) {}

  async ngOnInit() {
    this.destinationsArray = await this.authService.getAllDestinations();
    this.filterByRegion(this.region);
    this.sort(this.order);
  }

  ngOnChanges(changes: SimpleChange) {
    if ('region' in changes) {
      this.revertFilter();
      this.filterByRegion(this.region);
    }
    if ('order' in changes) {
      this.sort(this.order);
    }
  }

  filterByRegion(region: string) {
    if (region != 'All') {
      this.destinationsArray = this.destinationsArray.filter(
        (obj) => obj.continent.name === region
      );
      this.sort(this.order);
    }
  }
  sort(order: string) {
    if (order === 'Popularity') {
      this.destinationsArray.sort(
        (a, b) => b.dst_popularity_score - a.dst_popularity_score
      );
    } else if (order == 'Alphabetical') {
      this.destinationsArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order == 'Random') {
      this.destinationsArray.sort(() => Math.random() - 0.5);
    } else if (order == 'Favourites') {
      this.destinationsArray.sort(
        (a, b) => b.dst_popularity_score - a.dst_popularity_score
      );
      this.destinationsArray = this.destinationsArray.slice(0, 5);
    } else {
      console.log('filter not found');
    }
  }

  revertFilter() {
    this.destinationsArray = [...this.originalDestinationsArray];
  }

  async exploreDestination(destination: string) {
    let searchForm = this.formDataService.getFormData();
    searchForm.cityTo = destination;
    this.formDataService.setFormData(searchForm);

    const dates = getDateValues(
      searchForm.tripMode,
      searchForm.departureAndReturnDate,
      searchForm.departureDate
    );
    const queryParams = {
      cityFrom: await getLocationId(this.apiService, searchForm.cityFrom),
      cityTo: await getLocationId(this.apiService, searchForm.cityTo),
      departureDate: dates.departure,
      returnDate: dates.return,
      bookingClass: mapBookingClass(searchForm.bookingClass),
      adults: searchForm.adults,
      children: searchForm.children,
      vehicleType: searchForm.vehicleType,
      sort: searchForm.sort,
    };
    this.router.navigate(['/results'], { queryParams });
  }
}
