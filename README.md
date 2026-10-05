# Projeto — Web Crawler + MongoDB + FastAPI (Metacritic Games)

Fluxo: **Metacritic → crawler.py → MongoDB → api.py (FastAPI) → Dashboard**

## Site escolhido
[Metacritic – Games](https://www.metacritic.com/game/). O crawler lê a listagem
`/browse/game/?page=N` (jogos ordenados por nota) e coleta, para cada jogo, o título,
a Metascore (nota agregada da crítica), o veredito (ex.: *Universal Acclaim*) e o link.
Só dados públicos de jogos; nenhum dado pessoal. Uso educacional, com pausa entre requisições.

## Estrutura
```
projeto-metacritic/
├── config.py            # configurações (Mongo, URL, nº de páginas)
├── requirements.txt
├── crawler/crawler.py   # coleta (independente da API)
├── database/mongo.py    # persistência (MongoDB)
├── api/main.py          # FastAPI
└── dashboard/           # interface web (consome só a API)
```

## Instalação
```bash
python -m venv venv
venv\Scripts\activate          # Windows  (Linux/Mac: source venv/bin/activate)
pip install -r requirements.txt
```
MongoDB: instale localmente ou use Docker: `docker run -d -p 27017:27017 --name mongo mongo`
(outro endereço: defina a variável de ambiente `MONGO_URI`).

## Execução
Sempre a partir da **raiz** do projeto (a pasta que contém `config.py`):
```bash
python -m crawler.crawler 3    # coleta 3 páginas e salva no MongoDB
uvicorn api.main:app --reload  # sobe a API em http://localhost:8000
```
Documentação interativa dos endpoints: http://localhost:8000/docs

Pode rodar o crawler quantas vezes quiser: nada é apagado; jogos já existentes são
atualizados e os novos são inseridos.

## Banco de dados
Banco `metacritic`, coleção `jogos`. Índice único em `slug` (evita duplicados).

```json
{
  "slug": "elden-ring",
  "titulo": "Elden Ring",
  "metascore": 96,
  "veredito": "Universal Acclaim",
  "url": "https://www.metacritic.com/game/elden-ring/",
  "fonte": "https://www.metacritic.com/browse/game/?page=1",
  "primeira_coleta_em": "2026-10-05T18:00:00Z",
  "ultima_coleta_em": "2026-10-05T18:00:00Z"
}
```
| Campo | Descrição |
|---|---|
| slug | identificador do jogo no site (único) |
| titulo | nome do jogo |
| metascore | nota de 0 a 100 (`null` quando o site mostra "tbd") |
| veredito | classificação textual da nota |
| url | página do jogo no Metacritic |
| fonte | página da listagem de onde o dado foi coletado |
| primeira_coleta_em / ultima_coleta_em | data/hora (UTC) da coleta |

## Endpoints
| Método | Rota | Descrição |
|---|---|---|
| GET | `/jogos` | Lista paginada. Filtros: `busca`, `veredito`, `nota_min`, `nota_max`, `pagina`, `limite` |
| GET | `/jogos/{slug}` | Um jogo específico (404 se não existir) |
| GET | `/estatisticas` | Total, nota média/máxima/mínima, data da última coleta |
| GET | `/dashboard` | Dados prontos para o dashboard: resumo, jogos por veredito, jogos por faixa de nota, top 10 |

Exemplos: `/jogos?busca=zelda&nota_min=85` · `/jogos/elden-ring`
