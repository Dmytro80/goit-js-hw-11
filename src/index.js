import axios from './js/axios';
import PictureApiService from './js/picture-api';

const searchForm = document.querySelector('#search-form');
const loadBtn = document.querySelector('.load-more');
const pictureApiService = new PictureApiService();

searchForm.addEventListener('submit', onSearch);
loadBtn.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  pictureApiService.query = evt.currentTarget.elements.searchQuery.value;
  pictureApiService.resetPage();
  pictureApiService.getPictures();
}

function onLoadMore() {
  pictureApiService.getPictures();
}
