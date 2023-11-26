interface Route {
  id: string;
  combination_id: string;
  flyFrom: string;
  flyTo: string;
  cityFrom: string;
  cityCodeFrom: string;
  cityTo: string;
  cityCodeTo: string;
  local_departure: string;
  utc_departure: string;
  local_arrival: string;
  utc_arrival: string;
  airline: string;
  flight_no: number;
  operating_carrier: string;
  operating_flight_no: string;
  fare_basis: string;
  fare_category: string;
  fare_classes: string;
  return: number;
  bags_recheck_required: boolean;
  vi_connection: boolean;
  guarantee: boolean;
  equipment: any;
  vehicle_type: string;
}


export interface TripSummary {
    operators: string,
    departure: {
      from: string;
      to: string;
      departureTime: string;
      arrivalTime: string;
      stops: number;
      duration: string;
      route: Route[];
      operators?: string;
      layover?: string;
    };
    return?: {
      from: string;
      to: string;
      departureTime: string | undefined;
      arrivalTime: string | undefined;
      stops: number;
      duration: string;
      route: Route[];
      operators?: string;
      layover?: string;
    };
  }