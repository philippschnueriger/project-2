import { environment } from '../../../environments/environment'
import axios from 'axios';
import {TuiDay} from '@taiga-ui/cdk';

class ApiService {
  constructor() {
    axios.defaults.headers.common['apikey'] = environment.kiwi.apiKey;
  }
  baseUrl = 'https://api.tequila.kiwi.com';
  nextWeek = TuiDay.currentLocal().append({ day: 7 });
  async getData(from = 'ZRH', to = '', departureDate = this.nextWeek.toString().replace(/\./g, '/'), trains = false) {
    let vehicles = '';
    if (trains) {
      vehicles = '&vehicle_type=train';
    }
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
  async getLocations() {
    return await axios
      .get('https://api.tequila.kiwi.com/locations/query?term=ZRH')
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log(error));
  }
}

export default new ApiService();
//'https://api.tequila.kiwi.com/v2/search?fly_from=ZRH&fly_to=FRA&date_from=10/08/2023&date_to=15/08/2023&vehicle_type=train'
