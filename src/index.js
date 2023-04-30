import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import { NewApiRequest } from './js/api';
import { refs } from './js/vars';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';

const myApiRequest = new NewApiRequest();

refs.searchButton.addEventListener('click', onSearchButtonClick);
refs.loadButton.addEventListener('click', onLoadButtonClick);
refs.inputField.addEventListener('input', onSearchButtonMode);

// Default buttons mode
refs.loadButton.style.visibility = 'hidden';
refs.searchButton.disabled = true;

// Functions
function clearImgMarkup() {
  refs.imageSet.innerHTML = '';
  refs.loadButton.style.visibility = 'hidden';
}

function onSearchButtonMode() {
  if (refs.inputField.value) {
    refs.searchButton.disabled = false;
  } else if (!refs.inputField.value) {
    refs.searchButton.disabled = true;
    clearImgMarkup();
  }
}

function onSearchButtonClick(event) {
  event.preventDefault();
  clearImgMarkup();
  myApiRequest.searchQuery =
    event.currentTarget.form.elements.searchQuery.value;
  myApiRequest.resetPage();
  refs.searchButton.disabled = true;

  myApiRequest
    .fetchImg()
    .then(response => {
      refs.imageSet.innerHTML = createImgCard(response);
      if (response.data.hits !== []) {
        refs.loadButton.style.visibility = 'visible';

        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      }
      let gallery = new SimpleLightbox('.gallery a');
      gallery.refresh();
    })
    .catch(error => {
      refs.loadButton.style.visibility = 'hidden';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function onLoadButtonClick() {
  refs.loadButton.disabled = true;
  myApiRequest
    .fetchImg()
    .then(response => {
      refs.imageSet.insertAdjacentHTML('beforeend', createImgCard(response));
      let gallery = new SimpleLightbox('.gallery a');
      gallery.refresh();

      refs.loadButton.disabled = false;
    })
    .catch(error => {
      refs.loadButton.style.visibility = 'hidden';
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    });
}

function createImgCard({ data: { hits } }) {
  const imgCard = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<a href="${largeImageURL}">
                <div class="photo-card">
                  <img src="${webformatURL}" alt="${tags}" loading="lazy" width=300px/>
                  <div class="info">
                    <p class="info-item">
                      <b>Likes: ${likes}</b>
                    </p>
                    <p class="info-item">
                      <b>Views: ${views}</b>
                    </p>
                    <p class="info-item">
                      <b>Comments: ${comments}</b>
                    </p>
                    <p class="info-item">
                      <b>Downloads: ${downloads}</b>
                    </p>
                </div>
              </div>
            </a>`
    )
    .join('');
  return imgCard;
}
