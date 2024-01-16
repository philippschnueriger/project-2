import { getTripSummary, getAirlineName } from './trip-summary-utils';
import { TripSummary } from './tripSummary';
import { mockData } from 'src/app/data/mock-data';

describe('getTripSummary', () => {
  const sampleItem = mockData[0];

  it('should return a valid TripSummary object', () => {
    const result: TripSummary = getTripSummary(sampleItem);
    expect(result).toBeTruthy();
  });

  it('should handle the case where duration.return is 0', () => {
    const itemWithNoReturn = {
      ...sampleItem,
      duration: {
        departure: 123456,
        return: 0,
      },
    };
    const result: TripSummary = getTripSummary(itemWithNoReturn);
    expect(result.return).toBeUndefined();
  });

});

describe('getAirlineName', () => {
  it('should return the correct airline name for a valid airline code', () => {
    const airlineCode = 'LX';
    const result: string = getAirlineName(airlineCode);
    expect(result).toEqual('Swiss International Air Lines');
  });

  it('should return the input code if the airline is not found or not active', () => {
    const invalidAirlineCode = '??';
    const result: string = getAirlineName(invalidAirlineCode);
    expect(result).toEqual(invalidAirlineCode);
  });
});
