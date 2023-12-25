import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { TripMode, BookingClass, Sort, VehicleType } from './enums';

export interface FormData {
  tripMode: TripMode;
  cityFrom: string;
  cityTo: string;
  departureDate: TuiDay | null;
  departureAndReturnDate: TuiDayRange | null;
  bookingClass: BookingClass;
  adults: number;
  children: number;
  vehicleType: VehicleType;
  sort: Sort;
}
