const loader = document.querySelector(".loader");
const resultNav = document.querySelector("#resultNav");
const favioritesNav = document.querySelector("#favioritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loadMore = document.querySelector(".loadMore");
const favSection = document.querySelector("#favSection");

// api key url
const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let nasaData = [];
let favorites = {};

// close the loading animation and show the content
const showContent = function (page) {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (page === "results") {
    resultNav.classList.remove("hidden");
    favioritesNav.classList.add("hidden");
  } else {
    resultNav.classList.add("hidden");
    favioritesNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
};

// save the favorites items
const saveFavorites = function (itemUrl) {
  nasaData.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      saveConfirmed.hidden = false;
      // show the message for only 2s
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // save the data to local storage
      localStorage.setItem("nasaFav", JSON.stringify(favorites));
    }
  });
};

// remove the favorites
const removeFavorites = function (itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem("nasaFav", JSON.stringify(favorites));
    updateDom("favorites");
  }
};

const createDomElemets = function (page) {
  const currentPage = page === "results" ? nasaData : Object.values(favorites);
  console.log(currentPage);
  currentPage.forEach((result) => {
    // card container
    const card = document.createElement("div");
    card.classList.add("card");
    // link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View full Image";
    link.target = "_blank";
    // image
    const img = document.createElement("img");
    img.src = result.url;
    img.alt = "NASA Picture of the day";
    img.loading = "lazy";
    img.classList.add("card-image-top");
    // card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // card title
    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = result.title;
    // add to favorite
    const favorite = document.createElement("p");
    favorite.classList.add("clickable");
    if (page === "results") {
      favorite.textContent = "Add to Favorites";
      favorite.setAttribute("onclick", `saveFavorites('${result.url}')`);
    } else {
      favorite.textContent = "Remove Favorites";
      favorite.setAttribute("onclick", `removeFavorites('${result.url}')`);
    }
    // card text
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = result.explanation;
    // footer
    const small = document.createElement("small");
    small.classList.add("text-muted");
    // date
    const date = document.createElement("span");
    date.textContent = result.date;
    // copyright
    const copyrightAvailable =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightAvailable}`;
    // add to dom
    small.append(date, copyright);
    cardBody.append(title, favorite, cardText, small);
    link.appendChild(img);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
};

const updateDom = function (page) {
  // get data form local storage
  if (localStorage.getItem("nasaFav")) {
    favorites = JSON.parse(localStorage.getItem("nasaFav"));
    console.log(favorites);
  }
  imagesContainer.textContent = "";
  createDomElemets(page);
  showContent(page);
};

const getNasaPicture = async function () {
  try {
    loader.classList.remove("hidden");
    const response = await fetch(apiUrl);
    nasaData = await response.json();
    updateDom("results");
  } catch (error) {
    console.log(error);
  }
};

getNasaPicture();
