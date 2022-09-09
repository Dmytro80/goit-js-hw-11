import axios from './axios';
export default class PictureApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalHits = 0;
  }

  async getPictures() {
    try {
      const response = await axios.get(
        `?q=${this.searchQuery}&page=${this.page}`,
        {
          params: {
            key: '29755041-61309e7f07fd00c6b0d56abc7',
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 40,
          },
        }
      );
      this.incrementPage();
      this.totalHits = response.data.totalHits;
      console.log(this.totalHits);

      return response.data.hits;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  incrementPage() {
    this.page += 1;
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
