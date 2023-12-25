import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {TuiDay} from '@taiga-ui/cdk';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router) {}

  exploreDestinations() {
    const nextWeek = TuiDay.currentLocal().append({ day: 7 });
    this.router.navigate(
      ['/results'],
      {
        queryParams: {
          cityFrom: 'ZRH',
          departureDate: nextWeek.toString().replace(/\./g, '/'),
        },
      }
    );
  }
  

}
