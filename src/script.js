var quantidade_btn = document.getElementById('quantidade');
quantidade_btn.addEventListener('keyup', () => {
    pegaPokemons(quantidade_btn.value)
})

function pegaPokemons(quantidade) {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=' + quantidade)
        .then(response => response.json())
        .then(allpokemon => {
            var arrayDePokemons = [];

            allpokemon.results.map((pokemon) => {
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(pokemonSingle => {

                        arrayDePokemons.push({
                            nome: pokemon.name,
                            url: pokemon.url,
                            imagem: pokemonSingle.sprites.front_default,
                            habilidades: pokemonSingle.abilities.map(abilityInfo => abilityInfo.ability.name),
                            tipo: pokemonSingle.types.map(t => t.type.name),
                            cor: ''
                        });

                        if (arrayDePokemons.length == quantidade) {
                            var pokemonBoxes = document.querySelector('.pokemon-boxes')
                            pokemonBoxes.innerHTML = ''

                            arrayDePokemons.forEach((poke, index) => {

                                function corElemental(data) {

                                    const cor = {
                                        normal: "#A8A77A",
                                        fighting: "#C22E28",
                                        flying: "#A98FF3",
                                        poison: "#A33EA1",
                                        ground: "#E2BF65",
                                        rock: "#B6A136",
                                        bug: "#A6B91A",
                                        ghost: "#735797",
                                        steel: "#B7B7CE",
                                        fire: "#EE8130",
                                        water: "#6390F0",
                                        grass: "#7AC74C",
                                        electric: "#F7D02C",
                                        psychic: "#F95587",
                                        ice: "#96D9D6",
                                        dragon: "#6F35FC",
                                        dark: "#705746",
                                        fairy: "#D685AD"
                                    };

                                    return cor[data] || "purple"
                                }

                                poke.cor = corElemental(poke.tipo[0])

                                pokemonBoxes.innerHTML += `
                                    <a href="src/pokemon.html?pokemon=${poke.nome}" class="pokemon-box" style="background:${poke.cor};order: ${poke.url.split('pokemon/')[1].split('/')[0]};" >
                                        <img loading="lazy" src="`+ poke.imagem + `" />
                                        <div>
                                            <h1>`+ poke.nome + `</h1>
                                            <p>`+ poke.habilidades + `</p>
                                        </div>
                                    </a>
                                    `
                            })
                        }
                    })
            })
        })

}

