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

  isHiddenLoadBtn();

  pictureApiService.query = evt.currentTarget.elements.searchQuery.value;

  pictureApiService.resetPage();

  clearGalleryContainer();

  handleQuery();
}

async function handleQuery() {
  try {
    const responseData = await pictureApiService.getPictures();

    responseData.length === 0 ? throwFailureMessage() : throwSuccessMessage();

    createGalleryMarkup(responseData);

    if (pictureApiService.totalHits > 40) {
      isVisibleLoadBtn();
    }

    pictureApiService.decrementTotal();
  } catch (error) {
    console.error(error);
  }
}

async function onLoadMore() {
  try {
    const responseData = await pictureApiService.getPictures();

    createGalleryMarkup(responseData);

    pictureApiService.decrementTotal();

    if (pictureApiService.totalHits < 40) {
      isHiddenLoadBtn();
      throwWarningMessage();
    }
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

function isVisibleLoadBtn() {
  loadBtn.classList.remove('is-hidden');
}

function isHiddenLoadBtn() {
  loadBtn.classList.add('is-hidden');
}

function throwSuccessMessage() {
  Notify.success(`Hooray! We found ${pictureApiService.totalHits} images.`);
}

function throwFailureMessage() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function throwWarningMessage() {
  Notify.warning("We're sorry, but you've reached the end of search results.");
}
