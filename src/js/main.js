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
const searchParams = {
  key: "40945002-e125ab8d3394997b1a8dc0871",
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true,
  per_page: 200,
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  page = 1;
  moreBtn.classList.add("hidden");
  gallery.append(loader);
  const data = await imgRequest(`https://pixabay.com/api/`);
  if (data) { // To avoid error in buldGallery() when bad respond from request (data = undefined)
    const items = buildGallery(data);
    gallery.innerHTML = items.join(" ");
    simpleGallery.refresh();
  }
});

moreBtn.addEventListener("click", async () => {
  page += 1;
  moreBtn.classList.add("hidden");
  gallery.append(loader);
  const data = await imgRequest(`https://pixabay.com/api/`);
  if (data) { // To avoid error in buldGallery() when bad respond from request (data = undefined)
    const items = buildGallery(data);
    gallery.insertAdjacentHTML("beforeend", items.join(" "));
    simpleGallery.refresh();
  }
  loader.remove();
})

function imgRequest(url) {
  return axios(url, {
    params: {
      ...searchParams,
      q: searchInput.value,
      page: page,
      }
  })
    .then(res => {
        if (res.data.hits.length === 0 && page === 1) {
          gallery.innerHTML = "";
          return iziToast.error();
        } else {
          moreBtn.classList.remove("hidden");
          return res.data.hits;
        }
    })
    .catch(err => {
      if (err.code === "ERR_BAD_REQUEST") {
        loader.remove();
        iziToast.error();
      }
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





