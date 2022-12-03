let API = `https://pokeapi.co/api/v2/`

let container = document.querySelector('.favorites-container')
let modal = document.querySelector('.modal')
let closeModalBtn = document.querySelector('.modal-close__btn')
let pokemonInfoBody = document.querySelector('.pokemon-detail__body')
let clearBtn = document.querySelector('.clear-localStorage-btn')

clearBtn.addEventListener('click', () => {
	let data = getPokemonFromStorage()
	console.log(data)
	data = []
	setPokemonStorage(data)
	render()
})

function setPokemonStorage(favorites) {
	localStorage.setItem('favorites-data', JSON.stringify(favorites))
}

function getPokemonFromStorage() {
	let favorites = JSON.parse(localStorage.getItem('favorites-data'))
	return favorites
}

window.addEventListener('DOMContentLoaded', render)

function render() {
	let data = getPokemonFromStorage()

	container.innerHTML = ''

	data.length
		? data.forEach(pokemon => {
				container.innerHTML += `
                  <div class="card" id="${pokemon.id}">
                    <img
                    class="pakemon-image"
                    src="${pokemon.sprites.front_default}"
                    alt="${pokemon.name}"
                    />
                    <div class="bottom-block">
                      <div>
              <h3 class="pokemon-name" id="${pokemon.id}">${pokemon.name}</h3>
              <h3 class="pokemon-element">
              element: ${pokemon.types[0].type.name}
              </h3>
                    </div>
                    <div>
                    <button class="addPokemonToFavorites-btn" style="display: none;" id="${pokemon.name}"></button>
                    <button
                    class="removePokemonInFavorites-btn" style="display: block;"
                    id="${pokemon.name}"
                    ></button>
                    </div>
                    </div>
                    <button id="${pokemon.name}" class="detail-btn">Info</button>
                  </div>
                  `
		  })
		: ((container.innerHTML += `<div class="null">
    <h2>Тут ничего нету</h2>
    </div>`),
		  clearBtn.setAttribute('style', 'display: none;'))

	container.querySelectorAll('.addPokemonToFavorites-btn').forEach(item => {
		// checkPokemonInStorage(item)
		item.addEventListener('click', addPokemonToFavorites)
	})
	container.querySelectorAll('.removePokemonInFavorites-btn').forEach(item => {
		item.addEventListener('click', deletePokemonInFavorites)
	})
	container.querySelectorAll('.detail-btn').forEach(item => {
		item.addEventListener('click', detailPokemon)
	})
}

// function checkPokemonInStorage(btn) {
// 	let unFavoriteBtn = document.querySelectorAll('.removePokemonInFavorites-btn')
// 	let data = getPokemonFromStorage()
// 	data.forEach(pokemon => {
// 		if (btn.id == pokemon.name) {
// 			btn.setAttribute('style', 'display:none;')
// 			unFavoriteBtn.forEach(item => {
// 				if (item.id == btn.id) {
// 					item.setAttribute('style', 'display:block;')
// 				}
// 			})
// 		}
// 	})
// }

async function addPokemonToFavorites(e) {
	let data = getPokemonFromStorage()

	let pokemonId = e.target.id

	let response = await fetch(`${API}pokemon/${pokemonId}`)
	let pokemon = await response.json()
	data.push(pokemon)

	setPokemonStorage(data)

	let unfavoriteBtn = document.querySelectorAll('.removePokemonInFavorites-btn')

	unfavoriteBtn.forEach(item => {
		if (item.id == pokemonId) {
			e.target.setAttribute('style', 'display: none;')
			item.setAttribute('style', 'display: block;')
		}
	})
}

// delete in favorites

function deletePokemonInFavorites(e) {
	let data = getPokemonFromStorage()
	let pokemonId = e.target.id

	data.splice(pokemonId, 1)
	setPokemonStorage(data)

	let favoriteBtn = document.querySelectorAll('.addPokemonToFavorites-btn')

	favoriteBtn.forEach(item => {
		if (item.id == pokemonId) {
			e.target.setAttribute('style', 'display: none;')
			item.setAttribute('style', 'display: block;')
		}
	})
}

function detailPokemon(e) {
	let name = e.target.id
	fetch(`${API}pokemon/${name}`)
		.then(res => res.json())
		.then(pokemon => {
			modal.setAttribute('style', 'opacity: 1; z-index:1; transition: .3s;')
			document
				.querySelector('main')
				.setAttribute('style', 'transform:scale(.980); transition:.5s;')
			pokemonInfoBody.innerHTML = `
      <div class="pokemon-images">
      <img class="pokemon-image" src=${pokemon.sprites.front_default} alt="${pokemon.name}" width=180  />
      <img class="pokemon-image" src=${pokemon.sprites.back_default}  alt="${pokemon.name}" width=180  />
      </div>
      <h5 class="name">Name: <span>${pokemon.name}</span></h5>
      <h5 class="element">Element: <span> ${pokemon.types[0].type.name}</span></h5>
      <h5 class="height">Height:<span> ${pokemon.height}m</span></h5>
      <h5 class="weight">Weight:<span> ${pokemon.weight}kg</span></h5>
      <h5 class="expirience">Experience: <span>${pokemon.base_experience}Exp</span></h5>`
		})
}

closeModalBtn.addEventListener('click', () => {
	modal.setAttribute('style', 'opacity: 0; z-index:-10; transition: .3s;')
	document
		.querySelector('main')
		.setAttribute('style', 'transform:scale(1); transition:.2s;')
})
