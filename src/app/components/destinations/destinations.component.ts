import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.scss']
})
export class DestinationsComponent {
  regions = ['All', 'Europe', 'Asia']
  order = ['Popularity', 'Alphabetical', 'Random']
  filters: any;

  ngOnInit(): void {
    this.filters = new FormGroup({
      region: new FormControl('All'),
      order: new FormControl('Alphabetical'),
    })
  }
}
