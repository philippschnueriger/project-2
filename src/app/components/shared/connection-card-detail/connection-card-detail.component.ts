import { Component, Input } from '@angular/core';
import { getAirlineName } from '../connection-card/trip-summary-utils';
import { TripSegment } from 'src/app/types/tripSegment';
import { TripSummaryDeparture } from '../connection-card/tripSummary';

@Component({
  selector: 'app-connection-card-detail',
  templateUrl: './connection-card-detail.component.html',
  styleUrls: ['./connection-card-detail.component.scss'],
})
export class ConnectionCardDetailComponent {
  @Input() item!: TripSegment;
  @Input() tripSummary: TripSummaryDeparture | undefined;

  expand: boolean = true;

  toggleExpand() {
    this.expand = !this.expand;
  }
  getFlightInformation(leg: any){
    const airlineName = getAirlineName(leg.airline)
    const flightNumber = leg.airline + leg.flight_no
    return airlineName + " (" + flightNumber + ")"
  }
}
