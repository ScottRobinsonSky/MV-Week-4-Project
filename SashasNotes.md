
Front End
=========

x

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

for each featured game
const container = document.getElementByID("game-data-container")
const card = document.createElement("div")
card.className = "featured-game"
container.append(card)
const art = document.createElement("img")
art.src = ${art url}
art.alt = ${game title}
card.append(art)
const title = document.createElement("p")
title.innertext = ${game title}
card.append(title)
const price = document.createElement("p")
price.innertext = ${game price}
card.append(price)



Game Info Display
-----------------


