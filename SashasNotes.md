
Front End
=========

add strike and green class

Featured Games
--------------

    <section id="featured-games-container">
        <h2 id="feat-game-head">Featured Games</h2>
    </section>

Game Info Display
-----------------

    <section id="info-display">
        <article id="game-data-container">
            <article id="data-general"></article>
            <figure id="data-requirements"></figure>
            <!-- #data-art -->
            <!-- #data-description -->
            <!-- #data-critic -->
        </article>
    </section>


Back end
==========

x

Featured Games
--------------

### for each featured game
const featureContainer = document.getElementByID("featured-games-container")
const card = document.createElement("article")
card.className = "featured-game"
const art = document.createElement("img")
art.src = ${art url}
art.alt = ${game title}
card.append(art)
const title = document.createElement("p")
title.innerText = ${game title}

ALT--------------------------------

    card.append(title)
    const price = document.createElement("p")
    price.innertext = ${game price}
    card.append(price)
    featureContainer.append(card)

    OR

    if(discounted = true) {
        const priceContainer = document.createElement("div")
        const originalPrice = document.createElement("p")
        const discountPrice = document.createElement("p")
        const discountPercent = document.createElement("p")
        originalPrice.className = "strike"
        originalPrice.innerText = £{original price}
        discountPrice.className = "green"
        discountPrice.innerText = ${discount price}
        discountPercent.className = "green"
        discountPercent.innerText = &{discount percent}
        priceContainer.append(originalPrice, discountPrice, discountPercent)
        card.append(priceContainer)
    } else {
        const price = document.createElement("p")
        price.innerText = ${game price}
        card.append(price)
    }





Game Info Display
-----------------

const dataContainer = document.getElementByID("game-data-container")
### general data

title
normal price
discount price
discount percent
release date
game website
developer
publisher

### data requirements

const requirementsContainer = document.getElementByID("data-requirements")
// WINDOWS
const windows = document.createElement("img")
windows.src = (windows logo image)
windows.alt = "Windows"
requirementsContainer.append(windows)
const winRequirements = document.createElement("figcaption")

if (data.platforms.windows === true) {
    // minimum has HTML code so may need innerHTML or textContent? may need to experiment
    winRequirements.innerText = (data.pc_requirements.minimum)
    requirementsContainer.append(winRequirements)
} else {
    winRequirements.innerText = "Not supported."
    requirementsContainer.append(winRequirements)
}

// MAC
const mac = document.createElement("img")
mac.src = (mac logo image)
mac.alt = "Mac"
requirementsContainer.append(mac)
const macRequirements = document.createElement("figcaption")

if (data.platforms.mac === true) {
    // minimum has HTML code so may need innerHTML or textContent? may need to experiment
    macRequirements.innerText = (data.mac_requirements.minimum)
    requirementsContainer.append(macRequirements)
} else {
    macRequirements.innerText = "Not supported."
    requirementsContainer.append(macRequirements)
}

// LINUX
const linux = document.createElement("img")
linux.src = (linux logo image)
linux.alt = "Linux"
requirementsContainer.append(linux)
const linuxRequirements = document.createElement("figcaption")

if (data.platforms.linux === true) {
    // minimum has HTML code so may need innerHTML or textContent? may need to experiment
    linuxRequirements.innerText = (data.linux_requirements.minimum)
    requirementsContainer.append(linuxRequirements)
} else {
    linuxRequirements.innerText = "Not supported."
    requirementsContainer.append(linuxRequirements)
}


