export interface TripSummary {
    operators: string,
    departure: {
      from: string;
      to: string;
      departureTime: string;
      arrivalTime: string;
      stops: number;
      duration: string; // Assuming this is a string representing duration
    };
    return?: {
      from: string;
      to: string;
      departureTime: string | undefined;
      arrivalTime: string | undefined;
      stops: number;
      duration: string; // Assuming this is a string representing duration
    };
  }