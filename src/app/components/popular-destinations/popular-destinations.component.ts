import { Component } from '@angular/core';

@Component({
  selector: 'app-popular-destinations',
  templateUrl: './popular-destinations.component.html',
  styleUrls: ['./popular-destinations.component.scss']
})
export class PopularDestinationsComponent {
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
}
