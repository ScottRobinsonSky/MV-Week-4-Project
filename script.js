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
        searchById(query)
        return;
    }

    data = searchByName(query.toLowerCase());

}

async function searchByName(wantedName) {
    const response = await fetch("http://localhost:8080/http://api.steampowered.com/ISteamApps/GetAppList/v0002/");
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
        const data = await getGameData(gameId)
        if (!data.success) {
            // There was an error getting this app from api
            displayError('Error getting app data')
            return
        }
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

async function searchById(queryId) {
    const response = await fetch("http://localhost:8080/http://api.steampowered.com/ISteamApps/GetAppList/v0002/");
    const data = await response.json();
    const matchingApp = data.applist.apps.find(item => item.appid.toString() === queryId)
    if (matchingApp === undefined) {
        // There is an error: no apps match this app id
        displayError("Couldn't find a game with that app id");
        return;
    }
    const gameData = await getGameData(queryId);
    if (!gameData.success) {
        // There was an error getting this app from api
        displayError('Error getting app data')
        return
    }
    displayGameData(gameData, queryId);

}

async function getGameData(gameId) {
    const response = await fetch(`http://localhost:8080/https://store.steampowered.com/api/appdetails?appids=${gameId}&cc=${getSelectedCountry()}`);
    return await response.json();
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