import { Component, Input, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { TuiDay } from '@taiga-ui/cdk';
import { ApiService } from '../../shared/services/api.service';
import { firstValueFrom } from 'rxjs';
import { Destination } from 'src/app/shared/types/destination';
import * as data from '../../shared/location-data/destinations.json';

@Component({
  selector: 'app-popular-destinations',
  templateUrl: './popular-destinations.component.html',
  styleUrls: ['./popular-destinations.component.scss'],
})
export class PopularDestinationsComponent {
  @Input() region: string = 'All';

  readonly destinations: Destination[];
  originalDestinationsArray: Destination[] = [];
  destinationsArray: Destination[] = [];
  constructor(private router: Router, private apiService: ApiService) {
    this.destinations = { ...data };
    for (let i = 0; i < this.destinations.length; i++) {
      this.destinationsArray.push(this.destinations[i]);
    }
    this.originalDestinationsArray = [...this.destinationsArray];
    this.filterByRegion(this.region);
  }

  ngOnChanges(changes: SimpleChange) {
    if ('region' in changes) {
      this.revertFilter();
      this.filterByRegion(this.region);
    }
  }

  filterByRegion(region: string) {
    if (region != 'All') {
      this.destinationsArray = this.destinationsArray.filter(
        (obj) => obj.continent.name === region
      );
    }
  }

  revertFilter() {
    this.destinationsArray = [...this.originalDestinationsArray];
  }

  async exploreDestination(destination: string) {
    const nextWeek = TuiDay.currentLocal().append({ day: 7 });
    let cityToId = '';
    try {
      const data$ = this.apiService.getLocationId(destination);
      const data: any = await firstValueFrom(data$);
      cityToId = data.locations[0].id;
      console.log(cityToId);
    } catch (error) {
      console.error('Error getting location ID:', error);
    }
    this.router.navigate(['/results'], {
      queryParams: {
        cityFrom: 'ZRH',
        cityTo: cityToId,
        departureDate: nextWeek.toString().replace(/\./g, '/'),
      },
    });
  }
}
