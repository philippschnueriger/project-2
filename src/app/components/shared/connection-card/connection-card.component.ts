import { Component, Input } from '@angular/core';
import { TripSegment } from '../../../types/tripSegment';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from '../../../services/api.service';
import { User } from 'firebase/auth';
import { TripSummary } from './tripSummary';
import { getTripSummary } from './trip-summary-utils';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connection-card',
  templateUrl: './connection-card.component.html',
  styleUrls: ['./connection-card.component.scss'],
})
export class ConnectionCardComponent {
  @Input() item!: TripSegment;
  @Input() docId!: string;
  @Input() deleteOption: boolean = false;
  @Input() favourites: boolean = false;

  user: User | null = null;
  isConnectionAvailable: boolean = true;
  tripSummary: TripSummary | null = null;
  showOverlay: boolean = false;
  expand: boolean = false;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private userService: UserService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    if (this.deleteOption) {
      this.validateBookingToken();
    }
    //console.log(getTripSummary(this.item))
    console.log(this.item);
    this.tripSummary = getTripSummary(this.item);
  }
  saveFavouriteConnection() {
    if (this.user?.uid) {
      this.userService.saveFavouriteConnection(this.item);
    } else {
      this.router.navigate(['/login']);
    }
    this.deleteOption = true;
  }
  deleteFavouriteConnection() {
    if (this.user?.uid) {
      this.userService.deleteFavouriteConnection(this.item.id);
    }
    this.deleteOption = false;
  }
  async validateBookingToken() {
    if (this.item.deep_link) {
      const booking_token = this.item.deep_link.match(
        /booking_token=([^&]*)/
      )?.[1];
      if (booking_token) {
        try {
          const response = await this.apiService.validateBookingToken(
            booking_token
          );
          if (response) {
            this.isConnectionAvailable = true;
          } else {
            this.isConnectionAvailable = false;
          }
        } catch (error) {
          console.error('Error validating booking token:', error);
          return false;
        }
      }
    }
    return true;
  }

  toggleOverlay() {
    this.showOverlay = !this.showOverlay;
  }

  toggleExpand() {
    this.expand = !this.expand;
  }
}
