let container = document.querySelector('.favorites-container')

function getFavorites() {
	let favorites = JSON.parse(localStorage.getItem('favorites-data'))
	return favorites
}

let pokemons = getFavorites()

let data = unique(pokemons)

function unique(arr) {
	let result = []

	for (let pokemon of arr) {
		console.log(pokemon.id)
		if (!result.includes(pokemon.id)) {
			result.push(pokemon)
			console.log(pokemon)
		}
	}

	return result
}

function render() {
	data
		? data.forEach(item => {
				// item.id == item.id
				// 	? null
				// :
				container.innerHTML += `<div class="card" id=${item.id}>
	<img
		class="pakemon-image"
		src="${item.sprites.front_default}"
		alt="qwerty"
	/>
	<div class="bottom-block">
  <div>
  <h3 class="pokemon-name">${item.name}</h3>
  <h3 class="pokemon-element">${item.types[0].type.name}</h3>
  </div>
    <div>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="30px"
			height="30px"
			fill="currentColor"
			class="bi addPokemonToFavorites-btn"
			viewBox="0 0 16 16"
			id=${item.id}
		>
			<path
				d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"
			/>
		</svg>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="30px"
			height="30px"
			fill="currentColor"
			class="bi removePokemonInFavorites-btn"
			viewBox="0 0 16 16"
			id=${item.id}
		>
			<path
				fill-rule="evenodd"
				d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"
			/>
		</svg>
    </div>
	</div>
</div>
`
		  })
		: null
}

render()
