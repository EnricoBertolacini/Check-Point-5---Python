const API = "http://localhost:8000";


/* =========================
   CARREGAR DASHBOARD
========================= */

async function carregarDashboard() {

    try {

        const resposta = await fetch(`${API}/dashboard`);

        const dados = await resposta.json();

        mostrarEstatisticas(dados.resumo);

        mostrarTopJogos(dados.top_jogos);

        mostrarFaixas(dados.por_faixa);

        mostrarVereditos(dados.por_veredito);

    } catch (erro) {

        console.error(
            "Erro ao conectar com a API:",
            erro
        );

    }

}


/* =========================
   ESTATÍSTICAS
========================= */

function mostrarEstatisticas(resumo) {

    document.getElementById("totalJogos")
        .textContent =
        resumo.total_jogos ?? 0;

    document.getElementById("notaMedia")
        .textContent =
        resumo.nota_media ?? "-";

    document.getElementById("notaMaxima")
        .textContent =
        resumo.nota_maxima ?? "-";

    document.getElementById("notaMinima")
        .textContent =
        resumo.nota_minima ?? "-";

}


/* =========================
   TOP 10
========================= */

function mostrarTopJogos(jogos) {

    const tabela =
        document.getElementById("tabelaJogos");

    tabela.innerHTML = "";

    jogos.forEach((jogo, index) => {

        tabela.innerHTML += `

            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${jogo.titulo}
                </td>

                <td>
                    <span class="nota">
                        ${jogo.metascore}
                    </span>
                </td>

            </tr>

        `;

    });

}


/* =========================
   FAIXA DE NOTAS
========================= */

function mostrarFaixas(faixas) {

    const container =
        document.getElementById("faixasNotas");

    container.innerHTML = "";

    const maiorQuantidade =
        Math.max(
            ...faixas.map(
                faixa => faixa.quantidade
            ),
            1
        );

    faixas.forEach(faixa => {

        const porcentagem =
            (faixa.quantidade / maiorQuantidade)
            * 100;

        container.innerHTML += `

            <div class="faixa">

                <div class="faixa-info">

                    <span>
                        ${faixa.faixa}
                    </span>

                    <span>
                        ${faixa.quantidade} jogos
                    </span>

                </div>

                <div class="barra">

                    <div
                        class="barra-preenchida"
                        style="width: ${porcentagem}%">
                    </div>

                </div>

            </div>

        `;

    });

}


/* =========================
   VEREDITOS
========================= */

function mostrarVereditos(vereditos) {

    const container =
        document.getElementById("vereditos");

    container.innerHTML = "";

    vereditos.forEach(item => {

        container.innerHTML += `

            <div class="veredito">

                <span>
                    ${item.veredito}
                </span>

                <strong>
                    ${item.quantidade}
                </strong>

            </div>

        `;

    });

}


/* =========================
   BUSCAR JOGO
========================= */

async function buscarJogos() {

    const busca =
        document
            .getElementById("campoBusca")
            .value
            .trim();

    if (!busca) {
        return;
    }

    const container =
        document.getElementById(
            "resultadoBusca"
        );

    container.innerHTML =
        "<p>Buscando...</p>";

    try {

        const resposta =
            await fetch(
                `${API}/jogos?busca=${encodeURIComponent(busca)}&limite=10`
            );

        const dados =
            await resposta.json();

        container.innerHTML = "";

        if (dados.resultados.length === 0) {

            container.innerHTML =
                "<p>Nenhum jogo encontrado.</p>";

            return;
        }


        dados.resultados.forEach(jogo => {

            const nota =
                jogo.metascore ?? "Sem nota";

            container.innerHTML += `

                <div class="jogo">

                    <div>

                        <strong>
                            ${jogo.titulo}
                        </strong>

                        <p>
                            ${jogo.veredito ?? ""}
                        </p>

                    </div>

                    <span class="nota">
                        ${nota}
                    </span>

                </div>

            `;

        });

    } catch (erro) {

        container.innerHTML =
            "<p>Erro ao buscar jogos.</p>";

    }

}


/* BOTÃO */

document
    .getElementById("botaoBuscar")
    .addEventListener(
        "click",
        buscarJogos
    );


/* ENTER NA BUSCA */

document
    .getElementById("campoBusca")
    .addEventListener(
        "keypress",
        function (evento) {

            if (evento.key === "Enter") {
                buscarJogos();
            }

        }
    );


/* INICIAR */

carregarDashboard();