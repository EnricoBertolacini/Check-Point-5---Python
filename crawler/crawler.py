"""Web Crawler do Metacritic (jogos). Roda independente da API.

Uso:
    python -m crawler.crawler   # coleta PAGINAS páginas (config.py)
    python -m crawler.crawler 5 # coleta 5 páginas
"""
import re
import sys
import time
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

from config import BASE_URL, LISTA_URL, PAGINAS, PAUSA, HEADERS
from database.mongo import criar_indices, salvar_jogo

VEREDITOS = {
    "Universal Acclaim",
    "Generally Favorable",
    "Mixed or Average",
    "Generally Unfavorable",
    "Overwhelming Dislike",
}


def baixar_pagina(pagina: int) -> str:
    resposta = requests.get(
        LISTA_URL, params={"page": pagina}, headers=HEADERS, timeout=15
    )
    resposta.raise_for_status()
    return resposta.text


def extrair_jogos(html: str, fonte: str) -> list[dict]:
    """Procura links /game/<slug>/ e tira título, nota e veredito do texto do card."""
    soup = BeautifulSoup(html, "html.parser")
    jogos = {}  # chave = slug (evita duplicados dentro da mesma página)

    for link in soup.select('a[href*="/game/"]'):
        partes = [p for p in urlparse(link["href"]).path.split("/") if p]
        if len(partes) != 2 or partes[0] != "game":
            continue  # ignora /game/<slug>/critic-reviews/ etc.
        slug = partes[1]

        textos = [t.strip() for t in link.stripped_strings if t.strip()]
        textos = [t for t in textos if not re.fullmatch(r"\d+\.", t)]  # tira "1." do ranking
        if not textos:
            continue  # link só com imagem

        titulo = textos[0]
        metascore = None
        veredito = None
        for texto in textos[1:]:
            if texto.isdigit() and 0 <= int(texto) <= 100 and metascore is None:
                metascore = int(texto)
            elif texto in VEREDITOS:
                veredito = texto

        # se o mesmo jogo aparecer 2x, prefere a versão que tem nota
        if slug not in jogos or jogos[slug]["metascore"] is None:
            jogos[slug] = {
                "slug": slug,
                "titulo": titulo,
                "metascore": metascore,   # None quando é "tbd"
                "veredito": veredito,
                "url": f"{BASE_URL}/game/{slug}/",
                "fonte": fonte,
            }
    return list(jogos.values())


def coletar(paginas: int = PAGINAS):
    criar_indices()
    novos = atualizados = 0

    for n in range(1, paginas + 1):
        print(f"Página {n}...")
        try:
            html = baixar_pagina(n)
        except requests.RequestException as erro:
            print(f"  Erro ao baixar a página: {erro}")
            break

        jogos = extrair_jogos(html, fonte=f"{LISTA_URL}?page={n}")
        if not jogos:
            print("  Nenhum jogo encontrado (acabaram as páginas ou o HTML mudou).")
            break

        for jogo in jogos:
            if salvar_jogo(jogo):
                novos += 1
            else:
                atualizados += 1
        print(f"  {len(jogos)} jogos lidos")
        time.sleep(PAUSA)

    print(f"\nFim: {novos} novos, {atualizados} atualizados.")


if __name__ == "__main__":
    coletar(int(sys.argv[1]) if len(sys.argv) > 1 else PAGINAS)
