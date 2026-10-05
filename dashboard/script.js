const API = "http://127.0.0.1:8000";


/* ===================================
   SEGURANÇA PARA TEXTO DO HTML
=================================== */

function escaparHTML(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ===================================
   CLASSIFICAÇÃO DA NOTA
=================================== */

function classeNota(nota) {

    if (nota === null || nota === undefined) {
        return "";
    }

    if (nota >= 90) {
        return "nota-alta";
    }

    if (nota >= 70) {
        return "nota-media";
    }

    return "nota-baixa";
}


/* ===================================
   STATUS DA API
=================================== */

function atualizarStatus(status) {

    const elemento =
        document.getElementById("apiStatus");

    if (status === "online") {

        elemento.className =
            "api-status online";

        elemento.innerHTML = `
            <span class="status-bolinha"></span>
            API Online
        `;

    } else {

        elemento.className =
            "api-status offline";

        elemento.innerHTML = `
            <span class="status-bolinha"></span>
            API Offline
        `;
    }
}


/* ===================================
   DASHBOARD
=================================== */

async function carregarDashboard() {

    try {

        const resposta =
            await fetch(`${API}/dashboard`);

        if (!resposta.ok) {
            throw new Error(
                "Erro ao acessar API"
            );
        }

        const dados =
            await resposta.json();

        atualizarStatus("online");

        mostrarEstatisticas(
            dados.resumo
        );

        mostrarTopJogos(
            dados.top_jogos || []
        );

        mostrarFaixas(
            dados.por_faixa || []
        );

        mostrarVereditos(
            dados.por_veredito || []
        );

        preencherFiltroVereditos(
            dados.por_veredito || []
        );

    } catch (erro) {

        console.error(erro);

        atualizarStatus("offline");

    }

}


/* ===================================
   CARDS
=================================== */

function mostrarEstatisticas(resumo) {

    document
        .getElementById("totalJogos")
        .textContent =
        resumo.total_jogos ?? 0;

    document
        .getElementById("notaMedia")
        .textContent =
        resumo.nota_media ?? "--";

    document
        .getElementById("notaMaxima")
        .textContent =
        resumo.nota_maxima ?? "--";

    document
        .getElementById("notaMinima")
        .textContent =
        resumo.nota_minima ?? "--";


    const data =
        resumo.ultima_coleta_em;

    document
        .getElementById("ultimaColeta")
        .textContent =
        formatarData(data);

}


/* ===================================
   DATA
=================================== */

function formatarData(data) {

    if (!data) {
        return "Não disponível";
    }

    const objetoData =
        new Date(data);

    if (
        Number.isNaN(
            objetoData.getTime()
        )
    ) {
        return data;
    }

    return objetoData.toLocaleString(
        "pt-BR"
    );
}


/* ===================================
   TOP 10
=================================== */

function mostrarTopJogos(jogos) {

    const tabela =
        document.getElementById(
            "tabelaJogos"
        );

    tabela.innerHTML = "";


    if (!jogos.length) {

        tabela.innerHTML = `
            <tr>
                <td colspan="3">
                    Nenhum jogo encontrado.
                </td>
            </tr>
        `;

        return;
    }


    jogos.forEach(
        (jogo, index) => {

            const posicao =
                index + 1;

            let medalha =
                posicao;

            if (posicao === 1) {
                medalha = "🥇";
            }

            if (posicao === 2) {
                medalha = "🥈";
            }

            if (posicao === 3) {
                medalha = "🥉";
            }


            tabela.innerHTML += `

                <tr>

                    <td>
                        <span
                            class="
                                posicao
                                ${posicao === 1
                                    ? "top1"
                                    : ""}
                            "
                        >
                            ${medalha}
                        </span>
                    </td>

                    <td>
                        ${escaparHTML(
                            jogo.titulo
                        )}
                    </td>

                    <td>

                        <div
                            class="
                                nota
                                ${classeNota(
                                    jogo.metascore
                                )}
                            "
                        >
                            ${jogo.metascore ?? "--"}
                        </div>

                    </td>

                </tr>
            `;

        }
    );

}


/* ===================================
   DISTRIBUIÇÃO DE NOTAS
=================================== */

function mostrarFaixas(faixas) {

    const container =
        document.getElementById(
            "faixasNotas"
        );

    container.innerHTML = "";


    if (!faixas.length) {

        container.innerHTML = `
            <p class="mensagem">
                Nenhum dado disponível.
            </p>
        `;

        return;
    }


    const maior =
        Math.max(
            ...faixas.map(
                item =>
                    item.quantidade
            ),
            1
        );


    faixas.forEach(
        faixa => {

            const porcentagem =
                (
                    faixa.quantidade
                    / maior
                ) * 100;


            container.innerHTML += `

                <div class="faixa">

                    <div class="faixa-info">

                        <strong>
                            ${escaparHTML(
                                faixa.faixa
                            )}
                        </strong>

                        <span>
                            ${faixa.quantidade}
                            jogos
                        </span>

                    </div>


                    <div class="barra">

                        <div
                            class="
                                barra-preenchida
                            "
                            style="
                                width:
                                ${porcentagem}%
                            "
                        >
                        </div>

                    </div>

                </div>
            `;

        }
    );

}


/* ===================================
   VEREDITOS
=================================== */

function mostrarVereditos(
    vereditos
) {

    const container =
        document.getElementById(
            "vereditos"
        );

    container.innerHTML = "";


    vereditos.forEach(
        item => {

            container.innerHTML += `

                <div class="veredito">

                    <span>
                        ${escaparHTML(
                            item.veredito
                        )}
                    </span>

                    <strong>
                        ${item.quantidade}
                    </strong>

                </div>

            `;

        }
    );

}


/* ===================================
   FILTRO DE VEREDITOS
=================================== */

function preencherFiltroVereditos(
    vereditos
) {

    const select =
        document.getElementById(
            "vereditoFiltro"
        );


    vereditos.forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                item.veredito;

            option.textContent =
                item.veredito;

            select.appendChild(
                option
            );

        }
    );

}


/* ===================================
   BUSCAR JOGOS
=================================== */

async function buscarJogos() {

    const busca =
        document
            .getElementById(
                "campoBusca"
            )
            .value
            .trim();


    const notaMin =
        document
            .getElementById(
                "notaFiltro"
            )
            .value;


    const veredito =
        document
            .getElementById(
                "vereditoFiltro"
            )
            .value;


    const parametros =
        new URLSearchParams();


    if (busca) {

        parametros.append(
            "busca",
            busca
        );

    }


    if (notaMin) {

        parametros.append(
            "nota_min",
            notaMin
        );

    }


    if (veredito) {

        parametros.append(
            "veredito",
            veredito
        );

    }


    parametros.append(
        "limite",
        "20"
    );


    const area =
        document.getElementById(
            "areaResultados"
        );

    const container =
        document.getElementById(
            "resultadoBusca"
        );


    area.classList.add(
        "ativo"
    );


    container.innerHTML = `

        <p class="mensagem">
            Buscando jogos...
        </p>

    `;


    try {

        const resposta =
            await fetch(
                `${API}/jogos?${parametros}`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro na busca"
            );

        }


        const dados =
            await resposta.json();


        document
            .getElementById(
                "quantidadeResultados"
            )
            .textContent =
            `${dados.total} encontrado(s)`;


        container.innerHTML = "";


        if (
            !dados.resultados
            ||
            dados.resultados.length === 0
        ) {

            container.innerHTML = `

                <p class="mensagem">
                    Nenhum jogo encontrado.
                </p>

            `;

            return;

        }


        dados.resultados.forEach(
            jogo => {

                const titulo =
                    escaparHTML(
                        jogo.titulo
                    );

                const vereditoJogo =
                    escaparHTML(
                        jogo.veredito
                        ?? "Sem classificação"
                    );


                const tituloHTML =
                    jogo.url

                    ? `
                        <a
                            href="${escaparHTML(
                                jogo.url
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${titulo}
                        </a>
                    `

                    : titulo;


                container.innerHTML += `

                    <div class="jogo">

                        <div>

                            <h4>
                                ${tituloHTML}
                            </h4>

                            <p>
                                ${vereditoJogo}
                            </p>

                        </div>


                        <div
                            class="
                                nota
                                ${classeNota(
                                    jogo.metascore
                                )}
                            "
                        >

                            ${jogo.metascore ?? "--"}

                        </div>

                    </div>

                `;

            }
        );


    } catch (erro) {

        console.error(erro);

        container.innerHTML = `

            <p class="
                mensagem
                erro
            ">
                Não foi possível
                acessar a API.
            </p>

        `;

    }

}


/* ===================================
   LIMPAR
=================================== */

function limparFiltros() {

    document
        .getElementById(
            "campoBusca"
        )
        .value = "";


    document
        .getElementById(
            "notaFiltro"
        )
        .value = "";


    document
        .getElementById(
            "vereditoFiltro"
        )
        .value = "";


    document
        .getElementById(
            "areaResultados"
        )
        .classList.remove(
            "ativo"
        );

}


/* ===================================
   EVENTOS
=================================== */

document
    .getElementById(
        "botaoBuscar"
    )
    .addEventListener(
        "click",
        buscarJogos
    );


document
    .getElementById(
        "botaoLimpar"
    )
    .addEventListener(
        "click",
        limparFiltros
    );


document
    .getElementById(
        "campoBusca"
    )
    .addEventListener(
        "keydown",
        evento => {

            if (
                evento.key
                === "Enter"
            ) {

                buscarJogos();

            }

        }
    );


/* ===================================
   INICIAR
=================================== */

carregarDashboard();