import { ApiService } from 'src/app/services/api.service';
import { firstValueFrom } from 'rxjs';

export function mapBookingClass(bookingClass: string): string {
  switch (bookingClass) {
    case 'Economy':
      return 'M';
    case 'Premium Economy':
      return 'W';
    case 'Business Class':
      return 'C';
    case 'First Class':
      return 'F';
    default:
      return 'M';
  }
}

export async function getLocationId(
  apiService: ApiService,
  location: string
): Promise<string> {
  try {
    const data$ = apiService.getLocationId(location);
    const data: any = await firstValueFrom(data$);

    if (data.locations && data.locations.length > 0 && data.locations[0].id) {
      return data.locations[0].id;
    } else {
      console.error('Location ID not found for:', location);
      return '';
    }
  } catch (error) {
    console.error('Error getting location ID:', error);
    throw error;
  }
}

export function getDateValues(
  tripMode: string,
  departureAndReturnDate: any,
  departureDate: any
): { departure: string; return?: string } {
  let departureDateValue = '';
  let returnDateValue = '';
  if (tripMode == 'Return') {
    departureDateValue = departureAndReturnDate.from
      .toString()
      .replace(/\./g, '/');
    returnDateValue = departureAndReturnDate.to.toString().replace(/\./g, '/');
  } else {
    departureDateValue = departureDate.toString().replace(/\./g, '/');
  }
  return { departure: departureDateValue, return: returnDateValue };
}
