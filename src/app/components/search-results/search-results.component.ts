import { Component, OnInit } from '@angular/core';
import { Flight } from '../../shared/flight';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class ResultsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  cityFrom = '';
  cityTo = '';
  departureDate = '';
  bookingClass = '';
  vehicleType = '';

  loading = false;

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.cityFrom = params['cityFrom'];
        this.cityTo = params['cityTo'];
        this.departureDate = params['departureDate'];
        this.bookingClass = params['bookingClass'];
        this.vehicleType = params['vehicleType'];
      }
    );
    this.loadData();
  }
  data: Flight[] = [];

  async loadData() {
    this.loading = true;
    this.data = [];
    

const data$ = this.apiService.getData(this.cityFrom, this.cityTo, this.departureDate, this.bookingClass, this.vehicleType);

try {
  const response: any = await firstValueFrom(data$);
  for (let item of response.data) {
    let flight: Flight = {
      id: item.id,
      cityFrom: item.cityFrom,
      cityTo: item.cityTo,
      price: item.price,
      deep_link: item.deep_link,
      local_departure: item.local_departure,
      local_arrival: item.local_arrival,
      route: item.route,
      duration: item.duration.total,
    };
    this.data.push(flight);
  }
  this.loading = false;
} catch (error) {
  console.error('Error fetching data:', error);
}

  }
}

