const body = document.querySelector("body");
const input = document.getElementById("steamSearchQuery");
const submitBtn = document.getElementById("submitSearchQuery");

submitBtn.addEventListener("click", processSearchQuery);


function processSearchQuery(e) {
    e.preventDefault();
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
    } else if (matching_ids.length === 1) {
        const data = await getGameData(matching_ids[0]);
        displayGameData(data);
    } else {
        // Handle when there's multiple matches.
        //
        // This could be done by displaying options and having the user select which one they meant. 
        // If this approach is taken, it'll likely mean an API call for each option to get the image 
        // since names will likely be the same (i.e. the image will help users to distinguish between options)
        return; // TODO: handling multiple matches will be added in future
    }
}

async function getGameData(gameId) {
    const response = await fetch(`http://localhost:8080/https://store.steampowered.com/api/appdetails?appids=${gameId}`);
    return await response.json();
}

function displayError(errorMessage) {
    const p = document.createElement("p");
    p.classList.add("error");
    p.innerText = errorMessage;
    body.append(p);
}

function displayGameData(gameData) {
    console.log(gameData);
    // TODO: Implement frontend
}