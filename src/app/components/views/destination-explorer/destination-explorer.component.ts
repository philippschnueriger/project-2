import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-destination-explorer',
  templateUrl: './destination-explorer.component.html',
  styleUrls: ['./destination-explorer.component.scss'],
})
export class DestinationExplorerComponent {
  regions = ['All', 'Europe', 'Asia', 'North America'];
  order = ['Popularity', 'Alphabetical', 'Random'];
  filters: any;

  ngOnInit(): void {
    this.filters = new FormGroup({
      region: new FormControl('All'),
      order: new FormControl('Alphabetical'),
    });
  }
}
