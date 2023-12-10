import { Component } from '@angular/core';

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.scss']
})
export class DestinationsComponent {
  regions = ['All', 'Europe', 'Asia']
  order = ['Popularity', 'Alphabetical', 'Random']
}
