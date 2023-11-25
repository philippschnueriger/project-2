import { Route } from "./route";

export interface Flight {
  id: string;
  flyFrom: string,
  flyTo: string,
  cityFrom: string;
  cityTo: string;
  price: number;
  airlines?: Array<string>;
  deep_link?: string;
  local_departure?: string;
  local_arrival?: string;
  route?: Array<Route>;
  duration: { departure: number,
                return: number,
                total: number};
}
