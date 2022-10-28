const body = document.querySelector("body");
const input = document.getElementById("steamSearchQuery");
const submitBtn = document.getElementById("submitSearchQuery");
const currencySelect = document.querySelector("#steamCurrencySelect");

// submitBtn.addEventListener("click", processSearchQuery);

window.addEventListener("unhandledrejection", function() { 
    displayError("Something went wrong. Make sure your localhost CORS server is running.");
});

function processSearchQuery() {
  query = input.value.trim();
  if (!query) return false;

  if (!isNaN(+query)) {
    // `query` is a valid number, which we take to mean user is trying to search by id.
    searchById(query);
    return false;
  }

  data = searchByName(query.toLowerCase());
  return false;
}

async function searchByName(wantedName) {
    const response = await fetch("http://localhost:8080/https://api.steampowered.com/ISteamApps/GetAppList/v0002/");
    const data = await response.json();

    const matching_ids = [];
    Object.values(data.applist.apps).forEach((obj) => {
        const id = obj.appid;
        const name = obj.name;

        if (name.toLowerCase() === wantedName) {
            matching_ids.push(id);
        }
    });
    if (matching_ids.length === 0) {
        displayError("Couldn't find a game with that name.");
        return;
    }
  if (matching_ids.length === 0) {
    displayError("Couldn't find a game with that name");
    return;
  }
  displayError(); // this search is valid, so remove any displayed error

  if (matching_ids.length === 1) {
    // Gets the game id
    const gameId = matching_ids[0];
    const data = await getGameData(gameId);

    // Do nothing if there is an error
    if (data === false) return;

    // Otherwise display game data
    displayGameData(data, gameId);
  } else {
    // This displays an error if there are multiple matches
    displayError("Multiple apps were found with this name");

    // Handle when there's multiple matches.
    //
    // This could be done by displaying options and having the user select which one they meant.
    // If this approach is taken, it'll likely mean an API call for each option to get the image
    // since names will likely be the same (i.e. the image will help users to distinguish between options)
    return; // TODO: handling multiple matches will be added in future
  }
}

function removeKeysFromObject(keysToRemove, obj) {
  for (let key of Object.keys(obj)) {
    if (keysToRemove.has(key)) delete obj[key];
  }
  return obj;
}

function reformatFeaturedGames(featuredGames) {
  const uniqueGames = {};
  const keysToRemove = new Set([
    "header_image",
    "id",
    "large_capsule_image",
    "linux_available",
    "mac_available",
    "streamingvideo_available",
    "type",
    "windows_available",
  ]);

  for (let game of featuredGames) {
    if (uniqueGames[game.id] === undefined) {
      const gameId = game.id;
      filteredData = removeKeysFromObject(keysToRemove, game);
      uniqueGames[gameId] = filteredData;
    }
  }
  return uniqueGames;
}
async function searchById(queryId) {
  const response = await fetch(
    "http://localhost:8080/http://api.steampowered.com/ISteamApps/GetAppList/v0002/"
  );
  const data = await response.json();
  const matchingApp = data.applist.apps.find(
    (item) => item.appid.toString() === queryId
  );
  if (matchingApp === undefined) {
    // There is an error: no apps match this app id
    displayError("Couldn't find a game with that app id");
    return;
  }
  const gameData = await getGameData(queryId);

  // Do nothing if there is an error
  if (gameData === false) return;

  // Otherwise display data
  displayGameData(gameData, queryId);
}

async function getGameData(gameId) {
  const response = await fetch(
    `http://localhost:8080/https://store.steampowered.com/api/appdetails?appids=${gameId}&cc=${getSelectedCountry()}`
  );
  const gameData = await response.json();
  if (!gameData[+gameId].success) {
    // There was an error getting this app from api
    displayError("Error getting app data");
    return false;
  }
  return gameData;
}

async function getFeaturedGames() {
  const response = await fetch(
    "http://localhost:8080/https://store.steampowered.com/api/featured/"
  );
  return await response.json();
}

async function getAndDisplayFeaturedGames() {
  const data = await getFeaturedGames();

  const osFeaturedGames = data.featured_linux
    .concat(data.featured_mac)
    .concat(data.featured_win);
  const featuredGamesNoDupes = reformatFeaturedGames(osFeaturedGames);

  if (data.large_capsules.length === 0) {
    // there's not a main game
    const firstKey = Object.keys(featuredGamesNoDupes)[0];
    displayFeaturedGames([featuredGamesNoDupes[firstKey]], true); // so just use an OS featured game
    delete featuredGamesNoDupes[firstKey]; // remove from object since already displayed (as main featured game)
  } else {
    displayFeaturedGames(data.large_capsules, true);
  }
  displayFeaturedGames(featuredGamesNoDupes);
}

function displayFeaturedGames(reformattedData, isMain) {
  for (let gameId of Object.keys(reformattedData)) {
    gameData = reformattedData[gameId];

    const featureContainer = document.getElementById(
      "featured-games-container"
    );
    const card = document.createElement("article");
    card.classList.add("flex-center", "flex-column");

    const art = document.createElement("img");
    art.src = gameData.small_capsule_image;
    art.alt = `Art from ${gameData.name}`;

    card.append(art);

    if (isMain) {
      card.id = "main-featured-game";
      const title = document.createElement("h4");
      title.innerText = gameData.name;
      title.classList.add("main-feature-title");
      card.append(title);
    } else {
      card.classList.add("featured-game");
    }

    // NB: If we allow user to display featured games' price in a currency other than
    // GBP, then we'll need to instead make this a lookup so that the currency symbol remains correct.
    if (gameData.discounted) {
      const priceContainer = createDiscountPriceElement(
        `£${gameData.original_price / 100}`,
        gameData.discount_percent === 100
          ? "Free"
          : `£${gameData.final_price / 100}`,
        gameData.discount_percent
      );
      card.append(priceContainer);
    } else {
      const priceElement = createPriceElement(
        gameData.final_price === 0 ? "Free" : `£${gameData.final_price / 100}`
      );
      card.append(priceElement);
    }
    featureContainer.append(card);
  }

  return reformattedData;
}

function createPriceElement(formattedPrice) {
  const priceElement = document.createElement("p");
  priceElement.classList.add("price");
  priceElement.innerText = formattedPrice;
  return priceElement;
}

function createDiscountPriceElement(
  originalPriceFormatted,
  discountPriceFormatted,
  discountPercent
) {
  const priceContainer = document.createElement("div");
  const originalPriceElement = document.createElement("p");
  const discountPriceElement = document.createElement("p");
  const discountPercentElement = document.createElement("p");

  priceContainer.classList.add("price-container");
  originalPriceElement.classList.add("original-price");
  discountPriceElement.classList.add("discount-price");
  discountPercentElement.classList.add("discount-percent");

  originalPriceElement.innerText = originalPriceFormatted;
  discountPriceElement.innerText = discountPriceFormatted;
  discountPercentElement.innerText = `-${discountPercent}%`;

  priceContainer.append(
    discountPercentElement,
    originalPriceElement,
    discountPriceElement
  );
  return priceContainer;
}

function displayError(errorMessage) {
    // If `errorMessage` is passed, then we replace the current error message with it.
    // Otherwise, simply remove the currently displayed error message.
    const prevDisplayedError = document.querySelector(".error");
    if (!prevDisplayedError && !errorMessage) return; // tried to remove existing error but there wasn't one

    if (prevDisplayedError !== null) {
        // there's an error message currently being displayed
        if (prevDisplayedError.innerText === errorMessage) {
            return; // optimisation so we don't make redundant p elements
        }
        prevDisplayedError.remove();
    }

    // Display new error message
    const errorContainer = document.getElementById("error-container");
    
    const p = document.createElement("p");
    p.classList.add("error");
    p.innerText = errorMessage;
    
    errorContainer.append(p);
}

function toggleDisplayedSection() {
    const featuredGamesSection = document.getElementById("on-load");
    featuredGamesSection.classList.toggle("hidden");

    const singleGameSection = document.getElementById("info-display");
    singleGameSection.classList.toggle("hidden");
}

function generateGeneralData(data) {
  const generalContainer = document.getElementById("data-general");

  const title = document.createElement("h4");
  title.innerText = data.name;

  // Pricing
  const pricingData = data.price_overview;
  let priceElement;
  if (data.is_free) {
    // is free
    priceElement = createPriceElement("Free");
  } else if (pricingData.discount_percent === 0) {
    // not discounted
    priceElement = createPriceElement(pricingData.final_formatted);
  } else {
    // is discounted
    priceElement = createDiscountPriceElement(
      pricingData.initial_formatted,
      pricingData.final_formatted,
      pricingData.discount_percent
    );
  }

  // Release Date
  const releaseData = data.release_date;
  const releaseDateElement = document.createElement("p");
  releaseDateElement.classList.add("release-date");
  releaseDateElement.innerText = releaseData.coming_soon
    ? "Soon™"
    : releaseData.date;

  // Developers
  const developersElement = document.createElement("p");
  developersElement.classList.add("game-developers");

  developersElement.innerText = data.developers.join(", ");

  // Publisher
  const publishersElement = document.createElement("p");
  publishersElement.classList.add("game-publishers");

  publishersElement.innerText = data.publishers.join(", ");

  // Website
  let websiteElement;
  if (data.website === null) {
    websiteElement = document.createElement("p");
    websiteElement.innerText = "Website N/A";
    websiteElement.classList.add("game-website", "no-website");
  } else {
    websiteElement = document.createElement("a");
    websiteElement.href = data.website;
    websiteElement.target = "_blank";
    websiteElement.classList.add("game-website");
  }

  generalContainer.append(
    title,
    priceElement,
    releaseDateElement,
    developersElement,
    publishersElement,
    websiteElement
  );
}

function generateArt(data) {
  const artContainer = document.getElementById("data-art-container");

  const gameArt = document.createElement("img");
  gameArt.id = "data-art";
  gameArt.src = data.header_image;
  gameArt.alt = `gameArt for ${data.name}`;
  gameArt.classList.add("game-art");

  artContainer.append(gameArt);
}

function generateDescription(data) {
  const descriptionContainer = document.getElementById(
    "data-description-container"
  );

  const description = document.createElement("p");
  description.id = "data-description";
  description.innerText = data.short_description;
  description.classList.add("description");

  descriptionContainer.append(description);
}

function generateScore(data) {
    const scoreContainer = document.getElementById("data-score-container");
    let score;
    if (data.metacritic) {
        score = document.createElement("a");
        score.innerText = data.metacritic.score;
        score.href = data.metacritic.url;
        score.target = "_blank";
    } else {
        score = document.createElement("p");
        score.innerText = "N/A";
    }
    score.id = "data-score";
    score.classList.add("score");

  scoreContainer.append(score);
}

function displayGameData(gameData, gameId) {
    console.log(gameData);
    const data = gameData[`${gameId}`]['data']

    // Remove any other errors
    displayError()

    generateGeneralData(data);
    generateArt(data);
    generateDescription(data);
    generateScore(data);
    
    toggleDisplayedSection();
    document.getElementById("returnBtn").classList.remove("hidden");
}

function addCurrencyOptions() {
  // Remove everything from select element
  currencySelect.innerHTML = "";
  // const sortedList = currencyList.sort((a, b) => a.currencyName - b.currencyName)
  // Add all countries to select
  Object.entries(currencyList).forEach((item) => {
    //console.log(item);
    const currencyCode = item[0];
    const countryCode = item[1].countryCode;
    const symbol = item[1].symbol;
    let symbolText = currencyCode;
    if (symbol !== currencyCode) {
      symbolText = `${currencyCode} (${symbol})`;
    }
    const optionElement = document.createElement("option");
    optionElement.innerText = symbolText;
    optionElement.id = `cc-${countryCode}`;
    optionElement.value = countryCode;
    optionElement.setAttribute("name", countryCode);

    if (currencyCode === "GBP") {
      optionElement.setAttribute("selected", "selected"); // GBP will be selected by default
    }
    currencySelect.appendChild(optionElement);
  });
}
function getSelectedCountry() {
  // Gets the selected option from list
  const selectedOption =
    currencySelect.options[currencySelect.selectedIndex].value;
  console.log(selectedOption);
  return selectedOption;
}
addCurrencyOptions();
getAndDisplayFeaturedGames();
