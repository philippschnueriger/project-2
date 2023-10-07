import { Component, Input } from '@angular/core';
import { Flight } from '../../shared/flight';

@Component({
  selector: 'app-search-result-item',
  templateUrl: './search-result-item.component.html',
  styleUrls: ['./search-result-item.component.scss']
})
export class SearchResultItemComponent {
  @Input() item!: Flight;
  getDuration(duration: any) {
    if (duration === undefined) {
      return '';
    }
    let hours = Math.floor(duration / 3600);
    let minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}
