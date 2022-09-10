import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

import PictureApiService from './js/picture-api';

const searchForm = document.querySelector('#search-form');
const loadBtn = document.querySelector('.load-more');
const galleryContainer = document.querySelector('.gallery');

const pictureApiService = new PictureApiService();
const lightbox = new SimpleLightbox('.gallery a');

let counterHits = 0;

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
    const { totalHits, hits } = await pictureApiService.getPictures();

    counterHits = totalHits;

    hits.length === 0 ? throwFailureMessage() : throwSuccessMessage();

    createGalleryMarkup(hits);

    if (counterHits > 40) {
      isVisibleLoadBtn();
    }
  } catch (error) {
    console.error(error);
  }
}

async function onLoadMore() {
  try {
    const { hits } = await pictureApiService.getPictures();

    createGalleryMarkup(hits);

    counterHits -= 40;

    if (counterHits <= 40) {
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
  lightbox.refresh();
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
  Notify.success(`Hooray! We found ${counterHits} images.`);
}

function throwFailureMessage() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function throwWarningMessage() {
  Notify.warning("We're sorry, but you've reached the end of search results.");
}
