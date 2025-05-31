let container = document.querySelector('.main'),
    pokemon_nome = window.location.href.split('pokemon=')[1],
    pokemon = [],
    Evolucoes = [];

console.log(pokemon_nome)

fetch(`https://pokeapi.co/api/v2/pokemon/` + pokemon_nome)
    .then(response => response.json())
    .then(pokemon => {

        document.title += ` - ${pokemon.name}`;

        // Coletando as informações do pokemon
        const Nome = pokemon.name,
            ID = pokemon.id,
            Imagem = pokemon.sprites.front_default,
            ImagemHD = pokemon.sprites.other["official-artwork"].front_default,
            TipoEN = pokemon.types.map(t => t.type.name),
            TipoPT = [],
            TipoCor = [],
            Vida = pokemon.stats.map(s => s.base_stat)[0],
            Ataque = pokemon.stats.map(s => s.base_stat)[1],
            Defesa = pokemon.stats.map(s => s.base_stat)[2],
            Habilidade_1 = pokemon.abilities.map(abilityInfo => abilityInfo.ability.name)[0],
            Habilidade_2 = pokemon.abilities.map(abilityInfo => abilityInfo.ability.name)[1],
            Altura = pokemon.height,
            Peso = pokemon.weight;

        // Procurando SE e quantas evoluções o pokemon tem
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${ID}`)
            .then(response => response.json())
            .then(evolucaoInfo => {

                const evolucaoUrl = evolucaoInfo.evolution_chain.url;

                return fetch(evolucaoUrl);
            })
            .then(response => response.json())
            .then(evolucao_Resultado => {

                const cadeia_De_Evolucao = evolucao_Resultado.chain

                function proxima_Evolucao(poke) {
                    Evolucoes.push(poke.species.name)

                    if (poke.evolves_to.length >= 0) {
                        poke.evolves_to.forEach(a => {
                            proxima_Evolucao(a)
                        })
                    }

                    if (poke.evolves_to.length <= 0) {
                        document.querySelector('.evolucoes_container').style.display = 'none'
                    } else (
                        document.querySelector('.evolucoes_container').style.display = 'block')
                }

                proxima_Evolucao(cadeia_De_Evolucao)
                renderizar_Evolucoes(document.querySelector('.evolucoes'))
            })

        // Procurando uma descrição pro pokemon 
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${ID}/`)
            .then(res => res.json())
            .then(data => {
                const descricaoPesquisa = data.flavor_text_entries.find(
                    entry => entry.language.name === "en" // Aqui você pode escolher o idioma da descrição
                );

                renderizar_Descricao(document.querySelector('.descricao'), descricaoPesquisa.flavor_text)

                // if (descricaoPesquisa) {
                //     console.log(descricaoPesquisa.flavor_text);
                // }
            });

        // Traduzindo os elementos de inglês para português
        function tipoElemental(data) {

            const tipoEN = {
                normal: " Normal",
                fighting: " Lutador",
                flying: " Voador",
                poison: " Veneno",
                ground: " Terra",
                rock: " Pedra",
                bug: " Inseto",
                ghost: " Fantasma",
                steel: " Aço",
                fire: " Fogo", Fogo: "red",
                water: " Água",
                grass: " Planta",
                electric: " Elétrico",
                psychic: " Psíquico",
                ice: " Gelo",
                dragon: " Dragão",
                dark: " Sombrio",
                fairy: " Fada"
            };

            return tipoEN[data] || TipoEN
        }

        TipoEN.forEach(tipo => {
            TipoPT.push(tipoElemental(tipo))
        })

        // Aplicando a cor do tipo-elemental de acordo com o tipo
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

        TipoCor.push(corElemental(TipoEN[0]))

        // * Montando o perfil do pokemon *
        container.innerHTML = `
                <div class="imagens">
                    <div class="imagem_jogo">
                        <h3>jogo</h3>
                        <img src="${Imagem}" />
                    </div>
                    <div class="imagem_anime">
                        <h3>arte oficial</h3>
                        <img src="${ImagemHD}" />
                    </div>
                </div>
                <div class='informacoes'>
                    <h1>${Nome} | #${ID}</h1>
                    <h2 class="tipo">Tipo: ${TipoPT}</h2>
                        <div class='status'>
                            <p>vida: ${Vida}</p>
                            <p>ataque: ${Ataque}</p>
                            <p>defesa: ${Defesa}</p>
                        </div>
                    <h2 class="habilidades_texto">Habilidades</h2>
                        <div class='habilidades'>
                            <p>${Habilidade_1}</p>
                            <p>${Habilidade_2}</p>
                        </div>
                    <p>altura: ${Altura} cm</p>
                    <p>peso: ${Peso} hectogramas</p>
                    <div class='evolucoes_container'>
                        <h2>evoluções</h2>
                        <div class='evolucoes'>

                        </div>
                    </div>
                    <div class='descricao'>
                        <h2>descrição</h2>
                    </div>
                </div>
            `
        document.body.style.setProperty('--corTipo',TipoCor)
        document.body.style.setProperty('--deg','0deg')
    })

// Renderizando as evoluções, se tiver uma.
function renderizar_Evolucoes(local) {
    Evolucoes.forEach(evol => {
        local.innerHTML +=
            `
            <p>${evol}</p>
            `
    })
}

// Renderizando a descrição.
function renderizar_Descricao(local, descricao) {
    local.innerHTML +=
        `
            <p>${descricao}</p>
            `
}

document.body.addEventListener('keydown', (evento) => {
    if(evento.key === 'Escape'){
    window.history.back();
    }
})