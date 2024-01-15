import{i as d,S as v,a as w}from"./assets/vendor-89feecc5.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerpolicy&&(i.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?i.credentials="include":t.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(t){if(t.ep)return;t.ep=!0;const i=o(t);fetch(t.href,i)}})();const u=document.querySelector("form"),[L]=u.elements,c=document.querySelector(".gallery"),l=document.querySelector(".more-btn");d.settings({message:"Sorry, there are no images matching your search query. Please try again!",position:"topRight",messageSize:"16px",displayMode:2});const b=new v(".gallery a",{captionsData:"alt",captionDelay:250}),m=document.createElement("span");m.classList.add("loader");let n=1,p,f;u.addEventListener("submit",async e=>{e.preventDefault(),n=1,p=L.value,await h(e);try{f=document.querySelector(".gallery-item").getBoundingClientRect().height}catch{}});l.addEventListener("click",async e=>{n++,h(e)});async function h(e){l.classList.add("hidden"),e.target.nodeName==="FORM"&&(c.innerHTML=""),c.append(m);const s=await x("https://pixabay.com/api/");if(s&&s.hits.length>0){const o=S(s.hits);c.insertAdjacentHTML("beforeend",o.join(" ")),l.classList.remove("hidden")}else e.target.nodeName==="FORM"?d.error():(e.target.nodeName==="BUTTON"||s.totalHits*2<40*n)&&d.error({message:"We're sorry, but you've reached the end of search results."}),l.classList.add("hidden");b.refresh(),m.remove()}function x(e){return w(e,{params:{key:"40945002-e125ab8d3394997b1a8dc0871",image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:40,q:p,page:n}}).then(s=>s.data).catch(s=>{console.log(s)})}function S(e){return e.map(s=>{const{largeImageURL:o,webformatURL:r,tags:t,likes:i,views:a,comments:g,downloads:y}=s;return`<li class="gallery-item">
          <div class="img-wrapper">
            <a href="${o}">
                <img
                  class="gallery-img"
                  src="${r}" 
                  alt="${t}"
                  width="360"
                  height="200">
            </a> 
          </div>
          <div class="text-wrapper">
            <ul class="img-info-list">
              <li class="info-item">
                <h3 class="info-title">likes</h3>
                <p class="info-text">${i}</p>
              </li>
              <li class="info-item">
                <h3 class="info-title">views</h3>
                <p class="info-text">${a}</p>
              </li>
              <li class="info-item">
                <h3 class="info-title">comments</h3>
                <p class="info-text">${g}</p>
              </li>
              <li class="info-item">
                <h3 class="info-title">downloads</h3>
                <p class="info-text">${y}</p>
              </li>
            </ul>
          </div>
      </li>`})}window.addEventListener("wheel",e=>{e.preventDefault(),e.deltaY>0&&window.scrollBy({top:f*2,behavior:"smooth"}),e.deltaY<0&&window.scrollBy({top:-f*2,behavior:"smooth"})},{passive:!1});
//# sourceMappingURL=commonHelpers.js.map
