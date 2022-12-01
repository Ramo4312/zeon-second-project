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
let element = document.querySelectorAll('.element')
let limitRenderInp = document.querySelector('.limit-render-input')
let limitRenderBtn = document.querySelector('.limit-render-button')
let modal = document.querySelector('.modal')
let pokemonInfoBody = document.querySelector('.pokemon-detail__body')
let closeModalBtn = document.querySelector('.modal-close__btn')
let pageInp = document.querySelector('.page-input')

rebootBtn.addEventListener('click', render)

// render logic

window.addEventListener('DOMContentLoaded', render)

function render() {
	container.innerHTML = ''

	if (filter == 'all' || filter == '') {
		fetch(`${API}pokemon?limit=1154`)
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

				console.log(maxPage)

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
								item.addEventListener('click', detailPokemon)
							})
						})
				})
			})
	} else {
		// container.innerHTML = ''

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
	elements()
	pagination()
	checkPokemonInStorage()
}

limitRenderBtn.addEventListener('click', () => {
	itemsOnPage = limitRenderInp.value
	render()
})

// sort logic

function elements() {
	filterSelect.innerHTML = ''
	filterSelect.innerHTML = `
	<li class="filter-select__list-item" id="all">All</li>
  `
	fetch('https://pokeapi.co/api/v2/type')
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
							render()
						})
					})
			})
		})
}

document.querySelectorAll('.sort-select__list-item').forEach(item => {
	item.addEventListener('click', e => {
		sort = e.target.id
		// console.log(e.target.innerText)
		render()
	})
})

// filterSelect.querySelectorAll('.filter-select__list-item').forEach(item => {
// 	item.addEventListener('click', e => {
// 		// filter = e.target.id
// 		console.log(e.target.innerText)
// 		// console.log(filter)
// 		// render()
// 	})
// })

// function sortPokemon() {}

// pagination logic

// function maxPageCount(num) {
// 	let maxPage = num
// 	// console.log(maxPage)
// 	return maxPage
// }

//pagination
// prevPageBtn.addEventListener('click', () => {
// 	currentPage--
// 	pagintaion()
// 	render()
// })
// nextPageBtn.addEventListener('click', () => {
// 	currentPage++
// 	pagintaion()
// 	render()
// })

// if (currentPage === 1) {
// 	prevPageBtn.style.display = 'none'
// }

// async function pagintaion() {
// 	if (currentPage === 1) {
// 		prevPageBtn.style.display = 'none'
// 	} else if (currentPage > 1) {
// 		prevPageBtn.style.display = 'block'
// 	}
// 	let res = await fetch(PRODUCTS_API)
// 	let data = await res.json()
// 	let kolvo = data.length
// 	let pageNum = Math.ceil(kolvo / limit)

// 	if (currentPage === pageNum) {
// 		nextPageBtn.style.display = 'none'
// 	} else {
// 		nextPageBtn.style.display = 'block'
// 	}
// }
// if (page > maxPage) {
// 	nextPageBtn.style.display = 'none'
// 	console.log(page)
// } else {
// 	nextPageBtn.style.display = 'block'
// }

// if (page == 1) {
// 	prevPageBtn.style.display = 'none'
// }
function pagination() {
	nextPageBtn.addEventListener('click', () => {
		page++
		// pageInp++
		render()
	})

	prevPageBtn.addEventListener('click', () => {
		page--
		// pageInp--
		render()
	})
}
pageInp.value = page

pageInp.addEventListener('change', e => {
	if (e.target.value <= 0 || e.target.value >= maxPage) {
		return
	}

	// itemsOnPage = limitRenderInp.value
	page = e.target.value
	render()
})

// detail logic

function detailPokemon(e) {
	let name = e.target.id
	fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
		.then(res => res.json())
		.then(pokemon => {
			modal.setAttribute('style', 'opacity: 1; z-index:1; transition: .3s;')
			container.setAttribute('style', 'transform:scale(.950); transition:.5s;')
			pokemonInfoBody.innerHTML = `
      <div class="pokemon-images">
      <img class="pokemon-image" src=${pokemon.sprites.front_default} alt="${pokemon.name}" width=180  />
      <img class="pokemon-image" src=${pokemon.sprites.back_default}  alt="${pokemon.name}" width=180  />
      </div>
      <h5 class="name">Name: <span>${pokemon.name}</span></h5>
      <h5 class="element">Element: <span> ${pokemon.types[0].type.name}</span></h5>
      <h5 class="height">Height:<span> ${pokemon.height}</span></h5>
      <h5 class="weight">Weight:<span> ${pokemon.weight}</span></h5>
      <h5 class="expirience">Experience: <span>${pokemon.base_experience}xp</span></h5>`
		})
}

closeModalBtn.addEventListener('click', () => {
	modal.setAttribute('style', 'opacity: 0; z-index:-10; transition: .3s;')
	container.setAttribute('style', 'transform:scale(1); transition:.2s;')
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

	let response = await fetch(`${API}pokemon/${e.target.id}`)
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

	console.log(pokemonId)

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

searchInput.addEventListener('input', e => {
	if (!e.target.value.trim()) {
		search = e.target.value
		render()
	}
})
