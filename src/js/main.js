import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";

const form = document.querySelector("form");
const [searchInput] = form.elements;
const gallery = document.querySelector(".gallery");
const moreBtn = document.querySelector(".more-btn");

iziToast.settings({
    message: "Sorry, there are no images matching your search query. Please try again!",
    position: "topRight",
    messageSize: "16px",
    displayMode: 2,
});
const simpleGallery = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
});

const loader = document.createElement("span");
loader.classList.add("loader");

let page = 1;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  page = 1;
  createGallery(e);
});

moreBtn.addEventListener("click", async (e) => {
  page++;
  createGallery(e);
})

async function createGallery(e) {
  moreBtn.classList.add("hidden");
  if (e.target.nodeName === "FORM") gallery.innerHTML = "";
  gallery.append(loader);
  const data = await imgRequest(`https://pixabay.com/api/`);
  const items = buildGallery(data.hits);
  console.log(data.totalHits, data.hits.length);
  console.log(data.totalHits * 2 > 40 * page)
  if (data.hits.length > 0) {
    gallery.insertAdjacentHTML("beforeend", items.join(" "));
    moreBtn.classList.remove("hidden");
  } else {
    if (e.target.nodeName === "FORM") {
      iziToast.error();
    } else if (e.target.nodeName === "BUTTON" && data.totalHits * 2 < 40 * page) {
      iziToast.error({
        message: "We're sorry, but you've reached the end of search results."
      });
    }
    moreBtn.classList.add("hidden");
  }
  simpleGallery.refresh();
  loader.remove();
}

function imgRequest(url) {
  return axios(url, {
    params: {
      key: "40945002-e125ab8d3394997b1a8dc0871",
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      per_page: 40,
      q: searchInput.value,
      page: page,
      }
  })
    .then(res => {
      console.log(res.data)
      return res.data;
    })
    .catch(err => {
      console.log(err);
    });
}

function buildGallery(data) {
  return data.map(item => {
      const { largeImageURL, webformatURL, tags, likes, views, comments, downloads } = item;
      return `<li class="gallery-item">
          <div class="img-wrapper">
            <a href="${largeImageURL}">
                <img
                  class="gallery-img"
                  src="${webformatURL}" 
                  alt="${tags}"
                  width="360"
                  height="200">
            </a> 
          </div>
          <div class="text-wrapper">
            <ul class="img-info-list">
              <li class="info-item">
                <h3 class="info-title">likes</h3>
                <p class="info-text">${likes}</p>
              </li>
              <li class="info-item">
                <h3 class="info-title">views</h3>
                <p class="info-text">${views}</p>
              </li>
              <li class="info-item">
                <h3 class="info-title">comments</h3>
                <p class="info-text">${comments}</p>
              </li>
              <li class="info-item">
                <h3 class="info-title">downloads</h3>
                <p class="info-text">${downloads}</p>
              </li>
            </ul>
          </div>
      </li>`
  })
}