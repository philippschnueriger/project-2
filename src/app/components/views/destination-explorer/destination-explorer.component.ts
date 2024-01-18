import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-destination-explorer',
  templateUrl: './destination-explorer.component.html',
  styleUrls: ['./destination-explorer.component.scss'],
})
export class DestinationExplorerComponent {
  regions = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Australia'];
  order = ['Popularity', 'Alphabetical', 'Random'];
  filters!: FormGroup;
  reverse: boolean = false;

  ngOnInit(): void {
    this.filters = new FormGroup({
      region: new FormControl('All'),
      order: new FormControl('Alphabetical'),
    });
  }
  reverseList() {
    this.reverse = !this.reverse;
  }
}
