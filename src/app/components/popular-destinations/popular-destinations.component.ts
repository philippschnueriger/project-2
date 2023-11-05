import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {TuiDay} from '@taiga-ui/cdk';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-popular-destinations',
  templateUrl: './popular-destinations.component.html',
  styleUrls: ['./popular-destinations.component.scss']
})
export class PopularDestinationsComponent {
  constructor(private router: Router, private apiService: ApiService) {}

  index = 0;
  readonly items = [
      'London',
      'Madrid',
      'Rome',
      'Paris',
      'Berlin',
      'Lisbon',
      'Vienna'
  ];

  async exploreDestination(destination: string) {
    const nextWeek = TuiDay.currentLocal().append({ day: 7 });
    const cityTo = await this.apiService.getLocationId(destination)
    this.router.navigate(
      ['/results'],
      {
        queryParams: {
          cityFrom: 'ZRH',
          cityTo: cityTo,
          departureDate: nextWeek.toString().replace(/\./g, '/'),
        },
      }
    );
  }
}
