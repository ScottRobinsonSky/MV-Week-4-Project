const body = document.querySelector("body");
const input = document.getElementById("steamSearchQuery");
const submitBtn = document.getElementById("submitSearchQuery");
const currencySelect = document.querySelector('#steamCurrencySelect')

submitBtn.addEventListener("click", processSearchQuery);


function processSearchQuery(e) {
    e.preventDefault(); // to prevent page from refreshing when input submitted

    query = input.value.trim();
    if (!query) return;

    if (!isNaN(+query)) {
        // `query` is a valid number, which we take to mean user is trying to search by id.
        // This feature isn't yet supported, so for now we just return.
        return;
    }

    data = searchByName(query.toLowerCase());

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
        displayError("Couldn't find a game with that name");
        return;
    }
    displayError() // this search is valid, so remove any displayed error

    if (matching_ids.length === 1) {
        // Gets the game id
        const gameId = matching_ids[0]
        const data = await getGameData(gameId);
        displayGameData(data, gameId);
    } else {
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
    const uniqueGames = {}
    const keysToRemove = new Set([
        'header_image', 'id', 'large_capsule_image', 'linux_available',
        'mac_available', 'streamingvideo_available', 'type', 'windows_available'
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

async function getGameData(gameId) {
    const response = await fetch(`http://localhost:8080/https://store.steampowered.com/api/appdetails?appids=${gameId}&cc=${getSelectedCountry()}`);
    return await response.json();
}

async function getFeaturedGames() {
    const response = await fetch('http://localhost:8080/https://store.steampowered.com/api/featured/');
    return await response.json();
}

async function displayedFeaturedGames() {
    const data = await getFeaturedGames();

    const osFeaturedGames = data.featured_linux.concat(data.featured_mac).concat(data.featured_win);
    const featuredGamesNoDupes = reformatFeaturedGames(osFeaturedGames);

    if (data.large_capsules.length === 0) { // there's not a main game
        const firstKey = Object.keys(featuredGamesNoDupes)[0];
        displayFeaturedGames([featuredGamesNoDupes[firstKey]], true); // so just use an OS featured game
        delete featuredGamesNoDupes[firstKey]; // remove from object since already displayed (as main featured game)
    } else {
        displayFeaturedGames(data.large_capsules, true);
    }
    displayFeaturedGames(featuredGamesNoDupes);
}

function displayFeaturedGames(reformattedData, isMain) {
    // TODO: Make sure to add main featured game as well as `reformatted_data`

    for (let gameId of Object.keys(reformattedData)) {
        gameData = reformattedData[gameId];

        const featureContainer = document.getElementById("featured-games-container");
        const card = document.createElement("article");
        if (isMain) {
            card.id = "main-featured-game";
        } else {
            card.classList.add("featured-game");
        }
        const art = document.createElement("img");
        art.src = gameData.small_capsule_image;
        art.alt = `Art from ${gameData.name}`;

        const title = document.createElement("p");
        title.innerText = gameData.name;

        card.append(art, title);

        if (gameData.discounted) {
            const priceContainer = document.createElement("div");
            const originalPriceElement = document.createElement("p");
            const discountPriceElement = document.createElement("p");

            originalPriceElement.classList.add("strike");
            
            // NB: If we allow user to display feaatured games' price in a currency other than 
            // GBP, then we'll need to instead make this a lookup so that the currency symbol remains correct.
            // This also applies to the `discountPriceElement` below, and the `priceElement` when there's no discount.
            const originalPrice = gameData.original_price;
            originalPriceElement.classList.innerText = `£${originalPrice / 100}`;

            discountPriceElement.classList.add("discount");
            
            const discountPrice = gameData.final_price;
            const discountPercent = gameData.discount_percent;
            if (discountPercent === 100) { // game is free
                discountPriceElement.innerText = "Free (-100%)";
            } else {
                discountPriceElement.innerText = `£${discountPrice / 100} (-${discountPercent}%)`;
            }
            priceContainer.append(originalPriceElement, discountPriceElement)
            card.append(priceContainer);
        } else {
            const priceElement = document.createElement("p")
            
            const price = gameData.final_price;
            priceElement.innerText = price === 0 ? "Free" : `£${price / 100}`;

            card.append(priceElement);
        }
        featureContainer.append(card);
    }

    return reformattedData;
}

function displayMainFeaturedGame(gameData) {
    console.log(gameData);
}

function displayError(errorMessage) {
    // If `errorMessage` is passed, then we replace the current error message with it.
    // Otherwise, simply remove the currently displayed error message.
    const prevDisplayedError = document.querySelector(".error");
    if (!prevDisplayedError && !errorMessage) return; // tried to remove existing error but there wasn't one

    if (prevDisplayedError !== null) { // there's an error message currently being displayed
        if (prevDisplayedError.innerText === errorMessage) {
            return // optimisation so we don't make redundant p elements
        }
        prevDisplayedError.remove();
        if (errorMessage === undefined) return;
    }
    // Display new error message
    const p = document.createElement("p");
    p.classList.add("error");
    p.innerText = errorMessage;
    body.append(p);
}

function displayGameData(gameData, gameId) {
    console.log(gameData);
    const data = gameData[`${gameId}`]['data']
    const pricingData = data.price_overview
    console.log(pricingData)
    // TODO: Implement frontend
}

function addCurrencyOptions() {
    // Remove everything from select element
    currencySelect.innerHTML = ''

    // Add all countries to select
    countryList.forEach(item => {
        const optionElement = document.createElement('option')
        optionElement.innerText = item.country
        optionElement.id = `cc-${item.code}`
        optionElement.value = item.code
        optionElement.setAttribute('name', item.country)
        currencySelect.appendChild(optionElement)
    })

}
function getSelectedCountry() {
    // Gets the selected option from list
    const selectedOption = currencySelect.options[currencySelect.selectedIndex].value
    console.log(selectedOption)
    return selectedOption
}
addCurrencyOptions()
displayedFeaturedGames();