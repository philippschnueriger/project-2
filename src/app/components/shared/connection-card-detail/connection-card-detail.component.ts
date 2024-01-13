import { Component, Input } from '@angular/core';
import { getAirlineName } from '../connection-card/trip-summary-utils';

@Component({
  selector: 'app-connection-card-detail',
  templateUrl: './connection-card-detail.component.html',
  styleUrls: ['./connection-card-detail.component.scss'],
})
export class ConnectionCardDetailComponent {
  @Input() item: any;
  @Input() tripSummary: any;

  expand: boolean = true;

  toggleExpand() {
    this.expand = !this.expand;
  }
  getFlightInformation(leg: any){
    console.log(leg)
    const airlineName = getAirlineName(leg.airline)
    const flightNumber = leg.airline + leg.flight_no
    return airlineName + " (" + flightNumber + ")"
  }
}
