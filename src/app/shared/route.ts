export interface Route {
    id: string;
    cityFrom: string;
    cityTo: string;
    price: number;
    airline: string;
    vehicle_type?: string;
    local_departure?: string;
    local_arrival?: string;
  }