import axios from 'axios';

const API_URL = 'https://services.surfline.com/';

export class baseController {
  apiUrl: string;

  constructor () {
    this.apiUrl = API_URL;
  }
  async get(endpoint: string) {
    const response = await axios.get(`${this.apiUrl}${endpoint}`);
    return response.data;

  }
}