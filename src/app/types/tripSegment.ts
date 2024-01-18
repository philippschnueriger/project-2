export interface Route {
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
}

export interface TripSegment {
  id: string;
  flyFrom: string,
  flyTo: string,
  cityFrom: string;
  cityTo: string;
  price: number;
  airlines?: Array<string>;
  deep_link?: string;
  local_departure: string;
  local_arrival: string;
  route: Array<Route>;
  duration: { departure: number,
                return: number,
                total: number};
}
