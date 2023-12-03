import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { TripMode, BookingClass } from './enums';

export interface FormData {
  tripmode: TripMode;
  cityFrom: string;
  cityTo: string;
  departureDate: TuiDay | null;
  departureAndReturnDate: TuiDayRange | null;
  bookingClass: BookingClass;
  adults: number;
  vehicleType: string;
  sort: string;
}
