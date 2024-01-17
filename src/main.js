import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";

const form = document.querySelector("form");
const [searchInput] = form.elements; // інпут є першим елементом форми, тому звертаюсь до нього так щоб зайвий раз не звертатися до DOM дерева
const gallery = document.querySelector(".gallery");
const moreBtn = document.querySelector(".more-btn");

iziToast.settings({
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


//  Глобальні змінні page, searchData, itemHeight тепер реалізовані через sessionStorage щоб уникнути ненавмисних модифікацій з інших частин коду.

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  sessionStorage.setItem("page", 1)
  sessionStorage.setItem("searchData", searchInput.value);
  const galleryCheck = await createGallery(e.target.nodeName); // Тепер в параметр передається тільки nodeName так як в середені функції використовується тільки він
  // якщо до галереї було додано хочаб однин item згідно з тз отримаємо його висоту через getBoundingRect() і додаємо слухач на створення кастомного скрола з кроком в дві висоти item
  // якщо після нового запросу не було знайдено ні одного зображення, то прибираємо слухач на скрол і повертаєтся дефолтний скрол браузера
  if (galleryCheck.length > 0) { // Замінив бдлок try...catch на перевірку через if чи повернув запрос хоча б одну картинку
    sessionStorage.setItem("itemHeight", document.querySelector(".gallery-item").getBoundingClientRect().height);
    window.addEventListener("wheel", makeAlternativeScroll, { passive: false });
  } else {
    window.removeEventListener("wheel", makeAlternativeScroll, { passive: false });
  }
  // Якщо не прибирати дефолтний скрол через e.preventDefault() + passive: false, то буде два скроли одночасно.
  // Це добре видно якщо в браузері стоїть м'який скрол і в makeAlternativeScroll() закоментити behavior: smoth
});

moreBtn.addEventListener("click", async (e) => {
  sessionStorage.setItem("page", Number(sessionStorage.getItem("page")) + 1)
  createGallery(e.target.nodeName); // Тепер в параметр передається тільки nodeName так як в середені функції використовується тільки він
})

async function createGallery(nodeName) {
  moreBtn.classList.add("hidden");
  if (nodeName === "FORM") gallery.innerHTML = ""; // Чистить галерею якщо був новий запрос на пошук
  gallery.append(loader);
  const data = await imgRequest(`https://pixabay.com/api/`) || { hits: -1 }; // повертає hits -1 при невдалому запросі щоб не викликати помилку при звернені к data.hits в подальшому коді
  if (data.hits.length > 0) { // Створює та додажє в ДОМ зображення якщо запит повернув хочаб одне (при сабміті і при кліку по Load more)
    const items = buildGallery(data.hits);
    gallery.insertAdjacentHTML("beforeend", items.join(" "));
    moreBtn.classList.remove("hidden");
  } else if (data.hits !== -1) { // Перевірка чи був запит до сервера вдалий
    // Далі ідуть месседжи для нового пошуку і для load more, якщо зображень не було знайдено
    if (nodeName === "FORM") {
      iziToast.error({
        message: "Sorry, there are no images matching your search query. Please try again!",
      });
    } else if (nodeName === "BUTTON" || data.totalHits * 2 < 40 * page) {
      iziToast.error({
        message: "We're sorry, but you've reached the end of search results."
      });
    }
    moreBtn.classList.add("hidden");
  }
  simpleGallery.refresh();
  loader.remove();
  return data.hits // фідбєк до слухача на форму
}

function imgRequest(url) {
  return axios(url, {
    params: {
      key: "40945002-e125ab8d3394997b1a8dc0871",
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      per_page: 40,
      q: sessionStorage.getItem("searchData"),
      page: Number(sessionStorage.getItem("page"))
    }
  })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      // Виводить месседж з помилкою для користувача та більш детальну інформацію в консоль
      iziToast.error({
        message: `Error: ${err.message}`
      })
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

// Scroll

function makeAlternativeScroll(e) {
  e.preventDefault();
  const itemHeight = Number(sessionStorage.getItem("itemHeight"));
  if (e.deltaY > 0) window.scrollBy({
    top: itemHeight * 2,
    behavior: "smooth",
  });
  if (e.deltaY < 0) window.scrollBy({
    top: -itemHeight * 2,
    behavior: "smooth"
  });
}