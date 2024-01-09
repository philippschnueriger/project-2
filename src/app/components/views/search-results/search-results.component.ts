import { Component, OnInit } from '@angular/core';
import { TripSegment } from '../../../types/tripSegment';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { firstValueFrom } from 'rxjs';
import { FormDataService } from 'src/app/services/form-data.service';

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

  loading = false;

  ngOnInit() {
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

      // if (newSort !== this.sort) {
      //   this.sort = newSort;
      //   this.loadData();
      // }
      this.loadData();
    });
    this.loadData();
  }
  data: TripSegment[] = [];

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
      this.loading = false;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
