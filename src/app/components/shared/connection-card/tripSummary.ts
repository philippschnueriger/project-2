interface Route {
  id: string;
  flyFrom: string;
  flyTo: string;
  cityFrom: string;
  cityTo: string;
  price: number;
  airline: string;
  vehicle_type?: string;
  local_departure?: string;
  local_arrival?: string;
  layover?: string | undefined;
  duration?: string;
}

export interface TripSummaryDeparture {
  from: string;
  to: string;
  departureTime: string | undefined;
  arrivalTime: string | undefined;
  stops: number;
  duration: string;
  route: Route[];
  operators?: string | undefined;
  layover?: string | undefined;
}

interface TripSummaryReturn {
  from: string;
  to: string;
  departureTime: string | undefined;
  arrivalTime: string | undefined;
  stops: number;
  duration: string;
  route: Route[];
  operators?: string | undefined;
  layover?: string | undefined;
}

export interface TripSummary {
  operators?: string | undefined;
  departure: TripSummaryDeparture;
  return?: TripSummaryReturn;
}
