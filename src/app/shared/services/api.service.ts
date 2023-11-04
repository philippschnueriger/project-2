import { environment } from '../../../environments/environment'
import axios from 'axios';
import {TuiDay} from '@taiga-ui/cdk';

class ApiService {
  constructor() {
    axios.defaults.headers.common['apikey'] = environment.kiwi.apiKey;
  }
  baseUrl = environment.kiwi.baseUrl;
  nextWeek = TuiDay.currentLocal().append({ day: 7 });
  async getData(from = 'ZRH', to = '', departureDate = this.nextWeek.toString().replace(/\./g, '/'), trains = false) {
    const vehicles = trains ? '&vehicle_type=train' : '';
    return await axios
      .get(
        `${this.baseUrl}/v2/search?fly_from=${from}&fly_to=${to}&date_from=${departureDate}&date_to=${departureDate}&curr=CHF${vehicles}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log(error));
  }
  async getLocationId(location: string) {
    return await axios
      .get(`${this.baseUrl}/locations/query?term=${location}`)
      .then((response) => {
        return response.data.locations[0].id;
      })
      .catch((error) => console.log(error));
  }
  async validateBookingToken(booking_token: string) {
    const bnum = "0"
    const adults = "1"
    return await axios
      .get(`${this.baseUrl}/v2/booking/check_flights?booking_token=${booking_token}&bnum=${bnum}&adults=${adults}`)
      .then((response) => {
        if (response.data.status === 'error') {
          return false;
        }
        return true;
      })
      .catch((error) => console.log(error));
  }
}

export default new ApiService();
