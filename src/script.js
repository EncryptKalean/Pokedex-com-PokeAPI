const container_pokemon_box = document.getElementById('pokemon-boxes');

// Procura os pokémons salvos no localStorage; se não houver, cria um array vazio.
let arrayPokemons = JSON.parse(localStorage.getItem('pokemonsBaixados')) ?? [];

// Armazena o último número digitado pelo usuário.
let ultimo_numero = 0;

// Responsável por criar e remover os cards dos pokémons.
function criandoCard(quant) {
    // Pega todos os cards existentes
    const coletando_boxes = Array.from(container_pokemon_box.querySelectorAll('a'));

    // Se o número atual for maior que o último digitado, cria novos cards.
    if (quant > ultimo_numero) {
        const fragment = document.createDocumentFragment();

        for (let i = 1; i <= quant; i++) {
            // Verifica se já existe um card desse pokémon no DOM.
            const poke = arrayPokemons.find(p => p.ordem == i);
            const procurando_existente = coletando_boxes.find(b => b.getAttribute('name') === poke.nome);

            // Se o pokémon ainda não tiver um card, cria um novo.
            if (!procurando_existente) {
                const pokemon_container = document.createElement('a');
                pokemon_container.setAttribute('name', poke.nome);
                pokemon_container.setAttribute('href', `src/pokemon.html?pokemon=${poke.nome}`);
                pokemon_container.classList.add('pokemon-box', `${poke.tipo[0]}`);
                pokemon_container.style.order = poke.ordem;

                const img = document.createElement('img');
                img.setAttribute('src', poke.imagem);
                img.loading = 'lazy';
                pokemon_container.append(img);

                const nome_pokemon = document.createElement('h2');
                nome_pokemon.textContent = poke.nome;
                pokemon_container.append(nome_pokemon);

                fragment.append(pokemon_container);
            }
        }

        container_pokemon_box.append(fragment);
    }

    // Se o número atual for menor que o último digitado, remove o excesso de cards.
    else if (quant < ultimo_numero) for (let i = quant; i < coletando_boxes.length; i++) coletando_boxes[i].remove();

    // Armazena o último número digitado.
    ultimo_numero = quant;
}

// Responsável por baixar as informações dos pokémons da API.
function pokeAPI(quantidade) {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=' + quantidade)
        .then(res => res.json())
        .then(data => {

            data.results.map((pokemon) => {

                // Verifica se o pokémon já existe no array; se não, baixa suas informações.
                if (!arrayPokemons.find(p => p.nome === pokemon.name)) {

                    fetch(pokemon.url) // buscando as informações desse pokemon....
                        .then(res => res.json())
                        .then(pokemonInfos => {
                            // Obtém a posição do pokémon na Pokédex.
                            const id = pokemon.url.split('pokemon/')[1].split('/')[0]

                            // Combina todas as informações coletadas em um único objeto Pokémon.
                            arrayPokemons.push({
                                nome: pokemon.name,
                                url: pokemon.url,
                                ordem: id,
                                imagem: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                                habilidades: pokemonInfos.abilities.map(abilityInfo => abilityInfo.ability.name),
                                tipo: pokemonInfos.types.map(t => t.type.name),
                            });

                            // Quando todos os pokémons tiverem sido verificados, cria os cards e atualiza o registro dos pokémons já baixados no localStorage.
                            if (arrayPokemons.length === +quantidade) {
                                localStorage.setItem('pokemonsBaixados', JSON.stringify(arrayPokemons));
                                criandoCard(quantidade);
                            }
                        });

                }
            });
        });
};

const quantidade_input = document.getElementById('quantidade');
let timeout;

quantidade_input.addEventListener('keyup', () => {

    clearTimeout(timeout);

    // Aplica um pequeno atraso (debounce) para evitar múltiplas requisições desnecessárias durante a digitação.
    timeout = setTimeout(() => {
        if (+quantidade_input.value > arrayPokemons.length) pokeAPI(quantidade_input.value);
        else criandoCard(quantidade_input.value);

    }, 500)

});