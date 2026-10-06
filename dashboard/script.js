const API = "http://127.0.0.1:8000";


let graficoNotas = null;
let graficoVereditos = null;




function escaparHTML(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {
        return "";
    }


    return String(texto)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}





function classeNota(nota) {

    if (
        nota === null ||
        nota === undefined
    ) {

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




function atualizarStatus(status) {

    const elemento =
        document.getElementById(
            "apiStatus"
        );


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






async function carregarDashboard() {

    try {

        const resposta =
            await fetch(
                `${API}/dashboard`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao acessar a API"
            );

        }


        const dados =
            await resposta.json();


        atualizarStatus(
            "online"
        );


        mostrarEstatisticas(
            dados.resumo
        );


        mostrarTopJogos(
            dados.top_jogos || []
        );


        criarGraficoNotas(
            dados.por_faixa || []
        );


        criarGraficoVereditos(
            dados.por_veredito || []
        );


        preencherFiltroVereditos(
            dados.por_veredito || []
        );


    } catch (erro) {

        console.error(
            "Erro:",
            erro
        );


        atualizarStatus(
            "offline"
        );

    }

}





function mostrarEstatisticas(
    resumo
) {

    document
        .getElementById(
            "totalJogos"
        )
        .textContent =
        resumo.total_jogos ?? 0;


    document
        .getElementById(
            "notaMedia"
        )
        .textContent =
        resumo.nota_media ?? "--";


    document
        .getElementById(
            "notaMaxima"
        )
        .textContent =
        resumo.nota_maxima ?? "--";


    document
        .getElementById(
            "notaMinima"
        )
        .textContent =
        resumo.nota_minima ?? "--";


    document
        .getElementById(
            "ultimaColeta"
        )
        .textContent =
        formatarData(
            resumo.ultima_coleta_em
        );

}





function formatarData(data) {

    if (!data) {

        return "Não disponível";

    }


    const dataObjeto =
        new Date(data);


    if (
        Number.isNaN(
            dataObjeto.getTime()
        )
    ) {

        return data;

    }


    return dataObjeto
        .toLocaleString(
            "pt-BR"
        );

}





function mostrarTopJogos(jogos) {

    const tabela =
        document.getElementById(
            "tabelaJogos"
        );


    tabela.innerHTML = "";


    if (!jogos.length) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="3"
                    class="mensagem-tabela"
                >

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


            let exibicaoPosicao =
                posicao;


            if (posicao === 1) {

                exibicaoPosicao =
                    "🥇";

            }


            if (posicao === 2) {

                exibicaoPosicao =
                    "🥈";

            }


            if (posicao === 3) {

                exibicaoPosicao =
                    "🥉";

            }


            tabela.innerHTML += `

                <tr>

                    <td>

                        <span class="posicao">

                            ${exibicaoPosicao}

                        </span>

                    </td>


                    <td>

                        <span class="jogo-nome">

                            ${escaparHTML(
                                jogo.titulo
                            )}

                        </span>

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





function criarGraficoNotas(
    faixas
) {

    const canvas =
        document.getElementById(
            "graficoNotas"
        );


    const labels =
        faixas.map(
            item =>
                item.faixa
        );


    const valores =
        faixas.map(
            item =>
                item.quantidade
        );


    if (graficoNotas) {

        graficoNotas.destroy();

    }


    graficoNotas =
        new Chart(
            canvas,
            {

                type:
                    "bar",


                data: {

                    labels:
                        labels,


                    datasets: [

                        {

                            label:
                                "Quantidade de jogos",

                            data:
                                valores,

                            backgroundColor:
                                "rgba(121, 80, 242, 0.7)",

                            borderColor:
                                "rgba(151, 117, 250, 1)",

                            borderWidth:
                                1,

                            borderRadius:
                                7

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    plugins: {

                        legend: {

                            display:
                                false

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            context.raw +
                                            " jogos"
                                        );

                                    }

                            }

                        }

                    },


                    scales: {

                        x: {

                            ticks: {

                                color:
                                    "#8994a7"

                            },


                            grid: {

                                display:
                                    false

                            }

                        },


                        y: {

                            beginAtZero:
                                true,


                            ticks: {

                                color:
                                    "#8994a7",

                                precision:
                                    0

                            },


                            grid: {

                                color:
                                    "rgba(255,255,255,0.05)"

                            }

                        }

                    }

                }

            }
        );

}





function criarGraficoVereditos(
    vereditos
) {

    const canvas =
        document.getElementById(
            "graficoVereditos"
        );


    const labels =
        vereditos.map(
            item =>
                item.veredito
        );


    const valores =
        vereditos.map(
            item =>
                item.quantidade
        );


    if (graficoVereditos) {

        graficoVereditos.destroy();

    }


    graficoVereditos =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",


                data: {

                    labels:
                        labels,


                    datasets: [

                        {

                            data:
                                valores,


                            backgroundColor: [

                                "#7950f2",

                                "#20c997",

                                "#fcc419",

                                "#ff6b6b",

                                "#339af0",

                                "#e64980",

                                "#845ef7",

                                "#51cf66"

                            ],


                            borderColor:
                                "#121824",


                            borderWidth:
                                4

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    cutout:
                        "62%",


                    plugins: {

                        legend: {

                            position:
                                "bottom",


                            labels: {

                                color:
                                    "#8994a7",

                                padding:
                                    18,

                                usePointStyle:
                                    true

                            }

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            context.label +
                                            ": " +
                                            context.raw +
                                            " jogos"
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}





function preencherFiltroVereditos(
    vereditos
) {

    const select =
        document.getElementById(
            "vereditoFiltro"
        );


    select.innerHTML = `

        <option value="">
            Todos
        </option>

    `;


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






async function buscarJogos() {

    const busca =
        document
            .getElementById(
                "campoBusca"
            )
            .value
            .trim();


    const faixaNota =
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



    /* NOME */

    if (busca) {

        parametros.append(
            "busca",
            busca
        );

    }





    if (faixaNota) {

        const [
            notaMin,
            notaMax
        ] =
            faixaNota.split("-");


        parametros.append(
            "nota_min",
            notaMin
        );


        parametros.append(
            "nota_max",
            notaMax
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
        "100"
    );



    const area =
        document.getElementById(
            "areaResultados"
        );


    const tabela =
        document.getElementById(
            "resultadoBusca"
        );


    const contador =
        document.getElementById(
            "quantidadeResultados"
        );



    area.classList.add(
        "ativo"
    );


    tabela.innerHTML = `

        <tr>

            <td
                colspan="3"
                class="mensagem-tabela"
            >

                Buscando jogos...

            </td>

        </tr>

    `;



    try {

        const resposta =
            await fetch(

                `${API}/jogos?${parametros.toString()}`

            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar jogos"
            );

        }


        const dados =
            await resposta.json();



        contador.textContent =

            `${dados.total} registro(s) encontrado(s)`;



        tabela.innerHTML =
            "";



        if (
            !dados.resultados ||
            dados.resultados.length === 0
        ) {

            tabela.innerHTML = `

                <tr>

                    <td
                        colspan="3"
                        class="mensagem-tabela"
                    >

                        Nenhum jogo encontrado
                        com esses filtros.

                    </td>

                </tr>

            `;


            return;

        }



        dados.resultados.forEach(
            jogo => {

                tabela.innerHTML += `

                    <tr>


                        <td>

                            <span class="jogo-nome">

                                ${escaparHTML(
                                    jogo.titulo
                                )}

                            </span>

                        </td>


                        <td>

                            <span
                                class="veredito-texto"
                            >

                                ${escaparHTML(
                                    jogo.veredito ??
                                    "Sem classificação"
                                )}

                            </span>

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


    } catch (erro) {

        console.error(
            erro
        );


        tabela.innerHTML = `

            <tr>

                <td
                    colspan="3"
                    class="
                        mensagem-tabela
                        erro
                    "
                >

                    Não foi possível consultar
                    os dados da API.

                </td>

            </tr>

        `;

    }

}






function limparFiltros() {

    document
        .getElementById(
            "campoBusca"
        )
        .value =
        "";


    document
        .getElementById(
            "notaFiltro"
        )
        .value =
        "";


    document
        .getElementById(
            "vereditoFiltro"
        )
        .value =
        "";


    document
        .getElementById(
            "areaResultados"
        )
        .classList.remove(
            "ativo"
        );

}





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
                evento.key ===
                "Enter"
            ) {

                buscarJogos();

            }

        }
    );





carregarDashboard();