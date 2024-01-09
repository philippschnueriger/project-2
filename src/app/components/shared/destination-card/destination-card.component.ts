import { Component, Input, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { TuiDay } from '@taiga-ui/cdk';
import { ApiService } from '../../../services/api.service';
import { firstValueFrom } from 'rxjs';
import { Destination } from 'src/app/types/destination';
import { AuthService } from 'src/app/services/auth.service';
import { FormDataService } from 'src/app/services/form-data.service';

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

  constructor(private router: Router, private apiService: ApiService, private authService: AuthService, private formDataService: FormDataService) {}

  async ngOnInit() {
    console.log(this.destinationsArray);
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
      this.sort(this.order)
    }
  }
  sort(order: string){
    if (order === "Popularity"){
      this.destinationsArray.sort((a, b) =>  b.dst_popularity_score - a.dst_popularity_score)
    } else if (order == "Alphabetical"){
      this.destinationsArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order == "Random"){
      this.destinationsArray.sort(() => Math.random() - 0.5);
    } else if (order == "Favourites"){
      this.destinationsArray.sort((a, b) =>  b.dst_popularity_score - a.dst_popularity_score);
      this.destinationsArray = this.destinationsArray.slice(0, 5)
  }
    
    else {
      console.log("filter not found")
    }
    
  }

  revertFilter() {
    this.destinationsArray = [...this.originalDestinationsArray];
  }

  async exploreDestination(destination: string) {
    let searchForm = this.formDataService.getFormData();
    const nextWeek = TuiDay.currentLocal().append({ day: 7 });
    let cityToId = '';
    let cityFromId = '';
    try {
      const data$ = this.apiService.getLocationId(searchForm.cityFrom);
      const data: any = await firstValueFrom(data$);
      cityFromId = data.locations[0].id;
    } catch (error) {
      console.error('Error getting location ID:', error);
    }
    try {
      const data$ = this.apiService.getLocationId(destination);
      const data: any = await firstValueFrom(data$);
      cityToId = data.locations[0].id;
    } catch (error) {
      console.error('Error getting location ID:', error);
    }
    searchForm.cityTo = destination ;
    console.log("test", searchForm);
    //this.formDataService.setFormData(this.searchForm.value);

    this.router.navigate(['/results'], {
      queryParams: {
        cityFrom: cityFromId,
        cityTo: cityToId,
        departureDate: nextWeek.toString().replace(/\./g, '/'),
      },
    });
  }
  async getAllDestinations() {
    let destinations = await this.authService.getAllDestinations();
    console.log(destinations);
  }
}
