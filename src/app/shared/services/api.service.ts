import { environment } from '../../../environments/environment'
import axios from 'axios';

class ApiService {
  constructor() {
    axios.defaults.headers.common['apikey'] = environment.kiwi.apiKey;
  }
  baseUrl = 'https://api.tequila.kiwi.com';
  async getData(from = 'ZRH', to = 'FRA', departureDate = '10/12/2023', trains = false) {
    console.log("api.service.ts")
    let vehicles = '';
    if (trains) {
      vehicles = '&vehicle_type=train';
    }
    return await axios
      .get(
        `${this.baseUrl}/v2/search?fly_from=${from}&fly_to=${to}&date_from=${departureDate}&date_to=${departureDate}&curr=CHF${vehicles}`
      )
      .then((response) => {
        console.log(response.data)
        return response.data;
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
