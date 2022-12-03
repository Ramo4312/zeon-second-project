let API = `https://pokeapi.co/api/v2/`

let page = 1
let itemsOnPage = 20
let maxPage = 0

let search = ''

let sort = ''
let filter = ''

// connects

let container = document.querySelector('.container')
let rebootBtn = document.querySelector('.logo')
let nextPageBtn = document.querySelector('.next-page_btn')
let prevPageBtn = document.querySelector('.prev-page_btn')
let searchInput = document.querySelector('.search-input')
let searchButton = document.querySelector('.search-btn')
let filterSelect = document.querySelector('.filter-select__list')
let limitRenderInp = document.querySelector('.limit-render-input')
let limitRenderBtn = document.querySelector('.limit-render-button')
let modal = document.querySelector('.modal')
let pokemonInfoBody = document.querySelector('.pokemon-detail__body')
let closeModalBtn = document.querySelector('.modal-close__btn')
let pageInp = document.querySelector('.page-input')
let sortTitle = document.querySelector('.sort-title')
let filterTitle = document.querySelector('.filter-title')

window.addEventListener('DOMContentLoaded', render)

// render logic
rebootBtn.addEventListener('click', render)

function render() {
	container.innerHTML = ''

	if (filter == 'all' || filter == '') {
		fetch(`${API}pokemon?offset=0&limit=1154`)
			.then(res => res.json())
			.then(data => {
				let db = data.results

				if (search !== '') {
					db = db.filter(item => {
						return item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
					})
				}

				if (sort == 'none' || sort == '') {
					null
				} else if (sort == 'name(z-a)') {
					db.sort((prev, next) => {
						if (prev.name < next.name) return 1
						if (prev.name > next.name) return -1
					})
				} else if (sort == 'name(a-z)') {
					db.sort((prev, next) => {
						if (prev.name > next.name) return 1
						if (prev.name < next.name) return -1
					})
				}

				let count = Math.ceil(db.length / itemsOnPage)
				maxPage = count

				function currentData() {
					const begin = (page - 1) * itemsOnPage
					const end = begin + itemsOnPage
					return db.slice(begin, end)
				}

				currentData().forEach(item => {
					fetch(item.url)
						.then(pokemon => pokemon.json())
						.then(pokemonInfo => {
							container.innerHTML += `
									<div class="card" id="${pokemonInfo.id}">
							      <img
							      class="pakemon-image"
							      src="${pokemonInfo.sprites.front_default}"
							      alt="${pokemonInfo.name}"
							      />
							    <div class="bottom-block">
							    <div>
							<h3 class="pokemon-name" id="${pokemonInfo.id}">${pokemonInfo.name}</h3>
							<h3 class="pokemon-element">
							element: ${pokemonInfo.types[0].type.name}
							</h3>
							      </div>
							      <div>
							      <button class="addPokemonToFavorites-btn" id="${pokemonInfo.name}"></button>
							      <button
							      class="removePokemonInFavorites-btn"
							      id="${pokemonInfo.name}"
							      ></button>
							      </div>
							      </div>
							      <button id="${pokemonInfo.name}" class="detail-btn">Info</button>
							    </div>
									`
							container
								.querySelectorAll('.addPokemonToFavorites-btn')
								.forEach(item => {
									checkPokemonInStorage(item)
									item.addEventListener('click', addPokemonToFavorites)
								})
							container
								.querySelectorAll('.removePokemonInFavorites-btn')
								.forEach(item => {
									item.addEventListener('click', deletePokemonInFavorites)
								})
							container.querySelectorAll('.detail-btn').forEach(item => {
								item.addEventListener('mousedown', detailPokemon)
							})
						})
				})
			})
	} else {
		fetch(`${API}type/${filter}`)
			.then(res => res.json())
			.then(data => {
				let db = data.pokemon

				if (search !== '') {
					db = db.filter(item => {
						return (
							item.pokemon.name.toLowerCase().indexOf(search.toLowerCase()) !==
							-1
						)
					})
				}

				if (sort == 'none' || sort == '') {
					null
				} else if (sort == 'name(z-a)') {
					db.sort((prev, next) => {
						if (prev.pokemon.name < next.pokemon.name) return 1
						if (prev.pokemon.name > next.pokemon.name) return -1
					})
				} else if (sort == 'name(a-z)') {
					db.sort((prev, next) => {
						if (prev.pokemon.name > next.pokemon.name) return 1
						if (prev.pokemon.name < next.pokemon.name) return -1
					})
				}

				let count = Math.ceil(db.length / itemsOnPage)
				maxPage = count

				function currentData() {
					const begin = (page - 1) * itemsOnPage
					const end = begin + itemsOnPage

					return db.slice(begin, end)
				}
				currentData().forEach(pokemon => {
					fetch(pokemon.pokemon.url)
						.then(pokemons => pokemons.json())
						.then(pokemonInfo => {
							container.innerHTML += `
								<div class="card" id="${pokemonInfo.id}">
                  <img
                  class="pakemon-image"
                  src="${pokemonInfo.sprites.front_default}"
                  alt="${pokemonInfo.name}"
                  />
                  <div class="bottom-block">
                    <div>
	          <h3 class="pokemon-name" id="${pokemonInfo.id}">${pokemonInfo.name}</h3>
	          <h3 class="pokemon-element">
	          element: ${pokemonInfo.types[0].type.name}
	          </h3>
                  </div>
                  <div>
                  <button class="addPokemonToFavorites-btn" id="${pokemonInfo.name}"></button>
                  <button
                  class="removePokemonInFavorites-btn"
                  id="${pokemonInfo.name}"
                  ></button>
                  </div>
                  </div>
                  <button id="${pokemonInfo.name}" class="detail-btn">Info</button>
                </div>
								`
							container
								.querySelectorAll('.addPokemonToFavorites-btn')
								.forEach(item => {
									checkPokemonInStorage(item)
									item.addEventListener('click', addPokemonToFavorites)
								})
							container
								.querySelectorAll('.removePokemonInFavorites-btn')
								.forEach(item => {
									item.addEventListener('click', deletePokemonInFavorites)
								})
							container.querySelectorAll('.detail-btn').forEach(item => {
								item.addEventListener('click', detailPokemon)
							})
						})
				})
			})
	}

	limitRenderInp.value = itemsOnPage
	pageInp.value = page

	if (page == 1) {
		prevPageBtn.setAttribute('style', 'display: none;')
	} else {
		prevPageBtn.setAttribute('style', 'display: block;')
	}
	if (page == maxPage) {
		nextPageBtn.setAttribute('style', 'display: none;')
	} else {
		nextPageBtn.setAttribute('style', 'display: block;')
	}

	elements()
	checkPokemonInStorage()
}

limitRenderBtn.addEventListener('click', () => {
	itemsOnPage = Number(limitRenderInp.value)
	render()
})

limitRenderInp.addEventListener('change', e => {
	if (!e.target.value.trim()) {
		return
	}
	itemsOnPage = Number(e.target.value)
	render()
})

// limitRenderInp.addEventListener('input', e => {
// 	if (!e.target.value.trim()) {
// 		itemsOnPage = 20
// 		render()
// 	}
// })

// filter logic

function elements() {
	filterSelect.innerHTML = ''
	filterSelect.innerHTML = `
	<li class="filter-select__list-item" id="all">All</li>
  `

	fetch(`${API}type`)
		.then(res => res.json())
		.then(data => {
			data.results.forEach(item => {
				filterSelect.innerHTML += `
          <li class="filter-select__list-item" id="${item.name}" >${item.name}</li>
        `
				filterSelect
					.querySelectorAll('.filter-select__list-item')
					.forEach(item => {
						item.addEventListener('click', e => {
							filter = e.target.id
							if (e.target.id == 'all') {
								filterTitle.innerHTML = 'Вывести'
							} else {
								filterTitle.innerHTML = e.target.innerText
							}
							page = 1
							render()
						})
					})
			})
		})
}

// sort logic

document.querySelectorAll('.sort-select__list-item').forEach(item => {
	item.addEventListener('click', e => {
		sort = e.target.id
		if (e.target.id == 'none') {
			sortTitle.innerHTML = 'Сортировать'
		} else {
			sortTitle.innerHTML = e.target.innerText
		}
		render()
	})
})

// pagination logic

nextPageBtn.addEventListener('click', () => {
	page++
	render()
})

prevPageBtn.addEventListener('click', () => {
	page--
	render()
})

pageInp.addEventListener('change', e => {
	if (e.target.value <= 0 || e.target.value >= maxPage) {
		return
	}

	page = e.target.value
	render()
})

// detail logic

function detailPokemon(e) {
	let name = e.target.id
	fetch(`${API}pokemon/${name}`)
		.then(res => res.json())
		.then(pokemon => {
			modal.setAttribute('style', 'opacity: 1; z-index:1; transition: .3s;')
			document
				.querySelector('main')
				.setAttribute('style', 'transform:scale(.980); transition:.7s;')
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
	modal.setAttribute('style', 'opacity: 0; z-index:-1; transition: .3s;')
	document
		.querySelector('main')
		.setAttribute('style', 'transform:scale(1); transition:.2s;')
})

// favorites logic

function initStorage() {
	if (!localStorage.getItem('favorites-data')) {
		localStorage.setItem('favorites-data', '[]')
	}
}

initStorage()

function setPokemonStorage(favorites) {
	localStorage.setItem('favorites-data', JSON.stringify(favorites))
}

function getPokemonFromStorage() {
	let favorites = JSON.parse(localStorage.getItem('favorites-data'))
	return favorites
}

function checkPokemonInStorage(btn) {
	let unFavoriteBtn = document.querySelectorAll('.removePokemonInFavorites-btn')
	let data = getPokemonFromStorage()
	data.forEach(pokemon => {
		if (btn.id == pokemon.name) {
			btn.setAttribute('style', 'display:none;')
			unFavoriteBtn.forEach(item => {
				if (item.id == btn.id) {
					item.setAttribute('style', 'display:block;')
				}
			})
		}
	})
}

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

// search logic

searchButton.addEventListener('click', () => {
	if (!searchInput.value.trim()) {
		return
	}
	search = searchInput.value
	render()
})

searchInput.addEventListener('change', e => {
	if (!e.target.value.trim()) {
		return
	}
	search = e.target.value
	render()
})

searchInput.addEventListener('input', e => {
	if (!e.target.value.trim()) {
		search = e.target.value
		render()
	}
})
