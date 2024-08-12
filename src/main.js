import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { searchImagesProcess } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  hideBtn,
  showBtn,
  disableBtn,
  enableBtn,
  scrollPage,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');
const params = {
  page: 1,
  maxPage: 0,
  q: '',
  perPage: 15,
};

form.addEventListener('submit', handleSearchImages);

async function handleSearchImages(event) {
  event.preventDefault();
  clearGallery();

  params.q = event.currentTarget.elements.input.value.trim();
  if (params.q === '') {
    iziToast.error({
      message: 'Please enter your search query.',
      position: 'topRight',
    });
    form.reset();
    return;
  }
  showLoader();
  showBtn();

  params.page = 1;

  try {
    const { hits, totalHits } = await searchImagesProcess(
      params.q,
      params.page
    );
    params.maxPage = Math.ceil(totalHits / params.perPage);
    createGallery(hits);

    if (params.maxPage > 1) {
      enableBtn();
      loadMoreBtn.addEventListener('click', handleLoadMore);
    } else {
      hideBtn();
    }
    if (hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: error.message });
  } finally {
    form.reset();
  }
}

async function handleLoadMore() {
  disableBtn();
  showLoader();
  params.page += 1;
  try {
    const { hits } = await searchImagesProcess(params.q, params.page);
    createGallery(hits);
    scrollPage();
  } catch (error) {
    iziToast.error({ title: 'Error', message: error.message });
  } finally {
    if (params.page === params.maxPage) {
      loadMoreBtn.removeEventListener('click', handleLoadMore);
      hideBtn();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      enableBtn();
    }
  }
}
