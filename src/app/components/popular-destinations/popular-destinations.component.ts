import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {TuiDay} from '@taiga-ui/cdk';
import { ApiService } from '../../shared/services/api.service';
import { firstValueFrom } from 'rxjs';
import { Destination } from 'src/app/shared/types/destination'
import * as data from '../../shared/location-data/destinations.json';

@Component({
  selector: 'app-popular-destinations',
  templateUrl: './popular-destinations.component.html',
  styleUrls: ['./popular-destinations.component.scss']
})
export class PopularDestinationsComponent {
  readonly destinations: Destination[]
  destinationsArray: Destination[] = []
  constructor(private router: Router, private apiService: ApiService) {
    this.destinations = {...data};
    for (let i=0; i<this.destinations.length; i++){
      this.destinationsArray.push(this.destinations[i])
    }
  }

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
    let cityToId = '';
    try {
      const data$ = this.apiService.getLocationId(destination);
      const data: any = await firstValueFrom(data$);
      cityToId = data.locations[0].id;
      console.log(cityToId)
    } catch (error) {
      console.error('Error getting location ID:', error);
    }
    this.router.navigate(
      ['/results'],
      {
        queryParams: {
          cityFrom: 'ZRH',
          cityTo: cityToId,
          departureDate: nextWeek.toString().replace(/\./g, '/'),
        },
      }
    );
  }
}
