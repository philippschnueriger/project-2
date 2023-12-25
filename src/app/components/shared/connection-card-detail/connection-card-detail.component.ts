import { Component, Input } from '@angular/core';
import { TripSummary } from '../connection-card/tripSummary';

@Component({
  selector: 'app-connection-card-detail',
  templateUrl: './connection-card-detail.component.html',
  styleUrls: ['./connection-card-detail.component.scss'],
})
export class ConnectionCardDetailComponent {
  @Input() item: any;
  @Input() tripSummary: any;

  expand: boolean = false;

  toggleExpand() {
    this.expand = !this.expand;
  }
}
