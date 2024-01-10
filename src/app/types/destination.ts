interface Area {
  id: string;
  name: string;
  slug: string;
  code?: string;
}

interface Tag {
  tag: string;
  month_to: number;
  month_from: number;
}

interface Alternative_departure_point {
  id: string;
  distance: number;
  duration: number;
}

interface Car_rentals {
  provider_id: number;
  providers_locations: string[];
}

export interface Destination {
  img_url: string;
  id: string;
  active: boolean;
  name: string;
  slug: string;
  slug_en: string;
  code: string;
  alternative_names: string[];
  rank: number;
  global_rank_dst: number;
  dst_popularity_score: number;
  timezone: string;
  population: number;
  airports: number;
  stations: number;
  hotels: number;
  bus_stations: number;
  subdivision: any;
  autonomous_territory: any;
  country: string;
  region: string;
  continent: string;
  nearby_country: any;
  location: {
    lat: number;
    lon: number;
  };
  tags: Tag[];
  alternative_departure_points: Alternative_departure_point[];
  providers: number[];
  car_rentals: Car_rentals[];
  type: string;
}
