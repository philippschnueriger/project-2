import { Component, OnInit, SimpleChange } from '@angular/core';
import { TripSegment } from '../../../types/tripSegment';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { filter, firstValueFrom } from 'rxjs';
import { FormDataService } from 'src/app/services/form-data.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class ResultsComponent implements OnInit {
  formCityTo: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private formDataService: FormDataService
  ) {}

  cityFrom = '';
  cityTo = '';
  departureDate = '';
  returnDate = '';
  bookingClass = '';
  adults = 1;
  children = 0;
  vehicleType = '';
  sort = '';
  location: string | null = null;
  filters: any;
  stops = ['Any', 'Non-stop', '1 stop', '2 stops', '3 stops'];
  departureTime = ['Any', 'Morning', 'Afternoon', 'Evening'];
  arrivalTime = ['Any', 'Morning', 'Afternoon', 'Evening'];

  loading = false;

  async ngOnInit() {
    this.filters = new FormGroup({
      stops: new FormControl('Any'),
      departureTime: new FormControl('Any'),
      arrivalTime: new FormControl('Any'),
    });
    this.filters.get('stops').valueChanges.subscribe((newStopsValue: any) => {
      this.filterConnections();
    });
    this.filters
      .get('departureTime')
      .valueChanges.subscribe((departureTime: string) => {
        this.filterConnections();
      });
    this.filters
      .get('arrivalTime')
      .valueChanges.subscribe((arrivalTime: string) => {
        this.filterConnections();
      });
    this.route.queryParams.subscribe((params) => {
      this.cityFrom = params['cityFrom'];
      this.cityTo = params['cityTo'];
      this.departureDate = params['departureDate'];
      this.returnDate = params['returnDate'];
      this.bookingClass = params['bookingClass'];
      this.adults = params['adults'];
      this.children = params['children'];
      this.vehicleType = params['vehicleType'];
      const newSort = params['sort'];

      this.loadData();
    });
    this.location = await this.apiService.getLocationName(this.cityTo);
    this.loadData();
  }
  data: TripSegment[] = [];
  originalData: TripSegment[] = [];

  filterConnections() {
    this.data = this.originalData;
    this.filterByStops(this.filters.get('stops').value);
    this.filterByDepartureTime(this.filters.get('departureTime').value);
    this.filterByArrivalTime(this.filters.get('arrivalTime').value);

  }

  filterByStops(stopsFilter: string) {
    let stops: number;
    if (stopsFilter === 'Non-stop') {
      stops = 0;
    } else if (stopsFilter === '1 stop') {
      stops = 1;
    } else if (stopsFilter === '2 stops') {
      stops = 2;
    } else if (stopsFilter === '3 stops') {
      stops = 3;
    } else {
      return;
    }
    this.data = this.originalData.filter((item: any) => {
      if (item.duration.return > 0) {
        return item.route.length <= 2 * (stops + 1);
      } else {
        return item.route.length <= stops + 1;
      }
    });
  }

  filterByDepartureTime(departureTime: string) {
    if (departureTime === 'Any') {
      return;
    }
    this.data = this.data.filter(
      (flight: any) =>
        this.filterTimeOfDay(flight.local_departure) === departureTime
    );
    return;
  }

  filterByArrivalTime(arrivalTime: string) {
    if (arrivalTime === 'Any') {
      return;
    }
    this.data = this.data.filter(
      (flight: any) =>
        this.filterTimeOfDay(flight.local_arrival) === arrivalTime
    );
    return;
  }

  filterTimeOfDay(dateTimeString: string): string {
    const dateTime = new Date(dateTimeString);
    const hour = dateTime.getUTCHours();

    if (hour >= 6 && hour < 12) {
      return 'Morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Afternoon';
    } else {
      return 'Evening';
    }
  }

  async loadData() {
    this.loading = true;
    this.data = [];

    const data$ = this.apiService.getData(
      this.cityFrom,
      this.cityTo,
      this.departureDate,
      this.returnDate,
      this.bookingClass,
      this.adults,
      this.children,
      this.vehicleType,
      this.sort
    );

    try {
      const response: any = await firstValueFrom(data$);
      for (let item of response.data) {
        let flight: TripSegment = {
          id: item.id,
          flyFrom: item.flyFrom,
          flyTo: item.flyTo,
          cityFrom: item.cityFrom,
          cityTo: item.cityTo,
          price: item.price,
          deep_link: item.deep_link,
          local_departure: item.local_departure,
          local_arrival: item.local_arrival,
          route: item.route,
          duration: item.duration,
        };
        this.data.push(flight);
      }
      this.originalData = this.data;
      this.loading = false;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
