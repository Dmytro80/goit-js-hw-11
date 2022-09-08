import axios from './js/axios';
import PictureApiService from './js/picture-api';

const searchForm = document.querySelector('#search-form');
const loadBtn = document.querySelector('.load-more');
const galleryContainer = document.querySelector('.gallery');
const pictureApiService = new PictureApiService();

searchForm.addEventListener('submit', onSearch);
loadBtn.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  pictureApiService.query = evt.currentTarget.elements.searchQuery.value;
  pictureApiService.resetPage();
  console.log(pictureApiService.getPictures());

  pictureApiService.getPictures().then(response => {
    const galleryMarkup = createListItemsGallery(response);
    galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);
  });
}

function onLoadMore() {
  pictureApiService.getPictures();
}

function makeItemGallery({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
<div class="gallery__item">
    <a href="${largeImageURL}">
        <img class="gallery__image" loading="lazy" src="${webformatURL}" alt="${tags}" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
</div>
    `;
}

function createListItemsGallery(options) {
  return options.map(makeItemGallery).join('');
}
