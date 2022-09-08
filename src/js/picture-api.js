import axios from './axios';
export default class PictureApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalPicture = 0;
  }

  getPictures() {
    axios
      .get(`?q=${this.searchQuery}&page=${this.page}`, {
        params: {
          key: '29755041-61309e7f07fd00c6b0d56abc7',
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 20,
        },
      })
      .then(response => {
        this.incrementPage();
        this.totalPicture = response.data.total;
        console.log(this.totalPicture);
        console.log('После успешного запроса', response.data.hits);
      });
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
