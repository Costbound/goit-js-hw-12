import{i as l,S as p,a as y}from"./assets/vendor-89feecc5.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function o(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerpolicy&&(i.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?i.credentials="include":s.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=o(s);fetch(s.href,i)}})();const g=document.querySelector("form"),[v]=g.elements,c=document.querySelector(".gallery"),n=document.querySelector(".more-btn");l.settings({position:"topRight",messageSize:"16px",displayMode:2});const w=new p(".gallery a",{captionsData:"alt",captionDelay:250}),m=document.createElement("span");m.classList.add("loader");g.addEventListener("submit",async t=>{t.preventDefault(),sessionStorage.setItem("page",1),sessionStorage.setItem("searchData",v.value),(await f(t.target.nodeName)).length>0?(sessionStorage.setItem("itemHeight",document.querySelector(".gallery-item").getBoundingClientRect().height),window.addEventListener("wheel",d,{passive:!1})):window.removeEventListener("wheel",d,{passive:!1})});n.addEventListener("click",async t=>{sessionStorage.setItem("page",Number(sessionStorage.getItem("page"))+1),f(t.target.nodeName)});async function f(t){n.classList.add("hidden"),t==="FORM"&&(c.innerHTML=""),c.append(m);const e=await b("https://pixabay.com/api/")||{hits:-1};if(e.hits.length>0){const o=L(e.hits);c.insertAdjacentHTML("beforeend",o.join(" ")),n.classList.remove("hidden")}else e.hits!==-1&&(t==="FORM"?l.error({message:"Sorry, there are no images matching your search query. Please try again!"}):(t==="BUTTON"||e.totalHits*2<40*page)&&l.error({message:"We're sorry, but you've reached the end of search results."}),n.classList.add("hidden"));return w.refresh(),m.remove(),e.hits}function b(t){return y(t,{params:{key:"40945002-e125ab8d3394997b1a8dc0871",image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:40,q:sessionStorage.getItem("searchData"),page:Number(sessionStorage.getItem("page"))}}).then(e=>e.data).catch(e=>{l.error({message:`Error: ${e.message}`}),console.log(e)})}function L(t){return t.map(e=>{const{largeImageURL:o,webformatURL:a,tags:s,likes:i,views:r,comments:u,downloads:h}=e;return`<li class="gallery-item">
          <div class="img-wrapper">
            <a href="${o}">
                <img
                  class="gallery-img"
                  src="${a}" 
                  alt="${s}"
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
                <p class="info-text">${r}</p>
              </li>
              <li class="info-item">
                <h3 class="info-title">comments</h3>
                <p class="info-text">${u}</p>
              </li>
              <li class="info-item">
                <h3 class="info-title">downloads</h3>
                <p class="info-text">${h}</p>
              </li>
            </ul>
          </div>
      </li>`})}function d(t){t.preventDefault();const e=Number(sessionStorage.getItem("itemHeight"));t.deltaY>0&&window.scrollBy({top:e*2,behavior:"smooth"}),t.deltaY<0&&window.scrollBy({top:-e*2,behavior:"smooth"})}
//# sourceMappingURL=commonHelpers.js.map
