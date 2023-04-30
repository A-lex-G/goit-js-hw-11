import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = 'key=35726125-331cc533ccb21935830df22b4';
const params =
  'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export class NewApiRequest {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImg() {
    const response = await axios.get(
      `${BASE_URL}?${KEY}&q=${this.searchQuery}&${params}&page=${this.page}`
    );
    this.page += 1;

    if (response.data.hits === [] || response.data.hits.length === 0) {
      throw new Error();
    }
    return response;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
