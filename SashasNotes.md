
Front End
=========

add strike and discount class
add description class

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

--data-- means you still need to get the actual data structure from the api
### for each featured game

    const featureContainer = document.getElementByID("featured-games-container")
    const card = document.createElement("article")
    card.className = "featured-game"
    const art = document.createElement("img")
    art.src = --art url--
    art.alt = `Art from ${--game title--}.`
    card.append(art)
    const title = document.createElement("p")
    title.innerText = --game title--

ALT--------------------------------

    card.append(title)
    const price = document.createElement("p")
    price.innertext = --game price--
    card.append(price)
    featureContainer.append(card)

    OR 

    if(discounted = true) {
        // create elements
        const priceContainer = document.createElement("div")
        const originalPrice = document.createElement("p")
        const discountPrice = document.createElement("p")
        // add class and text to originalPrice
        originalPrice.classList.add("strike")
        originalPrice.innerText = --original price--
        // add class and text to discountPrice
        discountPrice.classList.add("discount")
        discountPrice.innerText = `{--discount price--} (-{--discount percent--}%)`
        // append
        priceContainer.append(originalPrice, discountPrice)
        card.append(priceContainer)
    } else {
        const price = document.createElement("p")
        price.innerText = --game price--
        card.append(price)
    }





Game Info Display
-----------------

    const dataContainer = document.getElementByID("game-data-container")
### general data

    const generalData = document.getElementByID("data-general")
    // reusing some variables here but they should be in a completely separate function so it should be fine right?
    // TITLE
    const title = create("h4")
    title.innerText = data.name
    generalData.append(title)
    // PRICE
    if(data.is_free === true) {
        const free = create("p")
        free.innerText = "Free"
        dataContainer.append(free)
    } else if(data.price_overview.initial !=== data.price_overview.final) {
        // create elements
        const priceContainer = create("div")
        const originalPrice = create("p")
        const discountPrice = create("p")
        // add class and text to originalPrice
        originalPrice.classList.add("strike")
        originalPrice.innerText = data.price_overview.initial_formatted
        // add class and text to discountPrice
        discountPrice.classList.add("discount")
        discountPrice.innerText = `{data.price_overview.final_formatted} (-${data.price_overview.discount_percent}%)`
        // append
        priceContainer.append(originalPrice, discountPrice)
        dataContainer.append(priceContainer)
    } else {
        const price = create("p")
        price.innerText = data.price_overview.final_formatted
        dataContainer.append(price)
    }
    // RELEASE DATE
    const releaseDate = create("p")
    releaseDate.innerText = data.release_date.date
    generalData.append(releaseDate)
    // DEVELOPER
    const developer = create("p")
    developer.innerText = --developer--
    generalData.append(developer)
    // PUBLISHER
    const publisher = create("p")
    publisher.innerText = --publisher--
    generalData.append(publisher)
    // WEBSITE
    const website = create("a")
    website.setAttribute("href", data.website)
    website.setAttribute("target", "_blank")
    generalData.append(website)

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

## art

    const gameArt = document.createElement("img")
    gameArt.src = data.header_image
    gameArt.alt = "gameArt"
    dataContainer.append(gameArt)


## description

    const description = create("p")
    description.innerText = data.detailed_description
    description.classList.add("description")
    dataContainer.append(description)

## score

    const score = create("a")
    score.innerText = data.metacritic.score
    score.setAttribute("href", data.metacritic.url)
    score.setAttribute("target", "_blank")
    score.classList.add("score")
    dataContainer.append(score)






