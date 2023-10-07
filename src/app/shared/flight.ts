import { Route } from "./route";

export interface Flight {
  id: string;
  cityFrom: string;
  cityTo: string;
  price: number;
  airlines?: Array<string>;
  deep_link?: string;
  local_departure?: string;
  local_arrival?: string;
  route?: Array<Route>;
  duration?: number;
}
