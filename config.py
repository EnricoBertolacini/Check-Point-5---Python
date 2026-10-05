"""Configurações do projeto em um só lugar."""
import os

# MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "metacritic"
COLECAO = "jogos"

# Crawler
BASE_URL = "https://www.metacritic.com"
LISTA_URL = BASE_URL + "/browse/game/"   # listagem paginada (?page=1, 2, ...)
PAGINAS = 3                              # quantas páginas coletar por execução
PAUSA = 2                                # segundos entre requisições (ser educado com o site)
HEADERS = {
    "User-Agent": "Mozilla/5.0 (projeto academico FIAP; coleta educacional)",
    "Accept-Language": "en-US,en;q=0.9",
}
