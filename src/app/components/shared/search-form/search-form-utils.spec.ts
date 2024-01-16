import { mapBookingClass, getLocationId, getDateValues } from './search-form-utils';
import { ApiService } from 'src/app/services/api.service';
import { of } from 'rxjs';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';

describe('mapBookingClass', () => {
  it('should map booking class to corresponding code', () => {
    expect(mapBookingClass('Economy')).toBe('M');
    expect(mapBookingClass('Premium Economy')).toBe('W');
    expect(mapBookingClass('Business Class')).toBe('C');
    expect(mapBookingClass('First Class')).toBe('F');
    expect(mapBookingClass('Unknown Class')).toBe('M'); // Default case (Econonmy)
  });
});

describe('getLocationId', () => {
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ApiService', ['getLocationId']);
  });

  it('should get location ID', async () => {
    const location = 'London';
    const responseData = { locations: [{ id: 'london_gb' }] };
    apiService.getLocationId.and.returnValue(of(responseData));

    const result = await getLocationId(apiService, location);

    expect(apiService.getLocationId).toHaveBeenCalledWith(location);
    expect(result).toBe('london_gb');
  });

  it('should handle case where location ID is not found', async () => {
    const location = 'UnknownCity';
    const responseData = { locations: [] };
    apiService.getLocationId.and.returnValue(of(responseData));

    const result = await getLocationId(apiService, location);

    expect(apiService.getLocationId).toHaveBeenCalledWith(location);
    expect(result).toBe('');
  });
});

describe('getDateValues', () => {
  it('should format date values based on trip mode', () => {
    const departureAndReturnDate = new TuiDayRange(new TuiDay(2024, 0, 17), new TuiDay(2024, 2, 17));
    const departureDate = new TuiDay(2024, 0, 17)

    const resultReturn = getDateValues('Return', departureAndReturnDate, null);
    const resultOneWay = getDateValues('One-way', null, departureDate);

    expect(resultReturn).toEqual({ departure: '17/01/2024', return: '17/03/2024' });
    expect(resultOneWay).toEqual({ departure: '17/01/2024', return: '' });
  });
});
