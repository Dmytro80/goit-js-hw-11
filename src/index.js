import { Notify } from 'notiflix/build/notiflix-notify-aio';
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

  clearGalleryContainer();

  queryHandler();
}

async function queryHandler() {
  try {
    const responseData = await pictureApiService.getPictures();
    if (responseData.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    createGalleryMarkup(responseData);
    Notify.success(`Hooray! We found ${pictureApiService.totalHits} images.`);
  } catch (error) {
    console.error(error);
  }
}

async function onLoadMore() {
  try {
    const responseData = await pictureApiService.getPictures();

    createGalleryMarkup(responseData);
  } catch (error) {
    console.error(error);
  }
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

function createGalleryMarkup(response) {
  const galleryMarkup = createListItemsGallery(response);
  galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);
}
function clearGalleryContainer() {
  galleryContainer.innerHTML = '';
}
