# 🎮 GameScope — Metacritic Analytics

Plataforma que coleta notas de jogos do [Metacritic](https://www.metacritic.com/game/), guarda tudo em um banco de dados e mostra os resultados em um dashboard.

```
Metacritic  →  Web Crawler  →  MongoDB  →  FastAPI  →  Dashboard
```

## 👥 Integrantes

- **Pedro Antônio Borges - RM: 572549**
- **Enrico Bertolacini - RM: 570999**
- **Julia Lima da Silva - RM: 569203**
- **Guilherme Alvejan - RM: 570835**
- **Matheus Sá Teles - RM: 570835**
---

## O que o projeto faz

- **Crawler:** acessa a listagem pública de jogos do Metacritic e coleta título, Metascore, veredito e link. Evita duplicados e registra a data e hora de cada coleta.
- **Banco:** guarda os jogos no MongoDB. Novas coletas atualizam os dados sem apagar nada.
- **API:** entrega os dados com FastAPI, com listagem, busca, filtros e estatísticas.
- **Dashboard:** mostra o total de jogos, nota média, maior e menor nota, dois gráficos, o Top 10 e uma tabela com busca e filtros.

Só são coletados dados públicos de jogos, sem nenhum dado pessoal. Uso educacional, com pausa entre as requisições.

## Tecnologias

Python · FastAPI · MongoDB · Requests e BeautifulSoup · HTML, CSS e JavaScript · Chart.js

## Estrutura de pastas

```
├── config.py            # configurações (Mongo, URL, nº de páginas)
├── requirements.txt     # dependências
├── crawler/crawler.py   # coleta dos dados
├── database/mongo.py    # conexão e gravação no MongoDB
├── api/main.py          # API FastAPI
└── dashboard/           # index.html, style.css e script.js
```

---

## Como usar

### Pré-requisitos
- Python 3.10 ou superior
- MongoDB Community (com o serviço ligado) e, de preferência, o MongoDB Compass
- Navegador e conexão com a internet (os gráficos usam o Chart.js via CDN)

### 1. Baixe o projeto
```bash
git clone https://github.com/EnricoBertolacini/Check-Point-5---Python.git
cd Check-Point-5---Python
```

### 2. Crie o ambiente virtual e instale as dependências
```bash
python -m venv venv
```
Ative o ambiente de acordo com o seu terminal:

| Terminal | Comando |
|---|---|
| PowerShell | `venv\Scripts\activate` |
| Git Bash | `source venv/Scripts/activate` |
| Linux / Mac | `source venv/bin/activate` |

```bash
pip install -r requirements.txt
```

> Erro de "execução de scripts desabilitada" no PowerShell? Rode uma vez:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

### 3. Confirme que o MongoDB está rodando
Abra o Compass e conecte em `mongodb://localhost:27017`. Se usar outro endereço, defina a variável de ambiente `MONGO_URI`.

### 4. Colete os dados
```bash
python -m crawler.crawler 5
```
O número é a quantidade de páginas. Quanto mais páginas, mais jogos e mais variedade de notas nos gráficos. Pode rodar quantas vezes quiser: os jogos existentes são atualizados e os novos são adicionados.

### 5. Suba a API
```bash
uvicorn api.main:app --reload
```
Deixe esse terminal aberto. A documentação interativa fica em **http://127.0.0.1:8000/docs**.

### 6. Abra o dashboard
Abra `dashboard/index.html` pelo navegador (no VS Code, use a extensão **Live Server** > *Open with Live Server*). Com a API rodando, os dados aparecem sozinhos.

> Rode sempre os comandos a partir da **raiz do projeto**, a pasta onde está o `config.py`.

---

## Endpoints da API

Base: `http://127.0.0.1:8000`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/jogos` | Lista paginada. Filtros: `busca`, `veredito`, `nota_min`, `nota_max`, `pagina`, `limite` |
| GET | `/jogos/{slug}` | Um jogo específico (404 se não existir) |
| GET | `/estatisticas` | Total, nota média, máxima, mínima e última coleta |
| GET | `/dashboard` | Dados prontos para o dashboard: resumo, jogos por veredito, por faixa de nota e Top 10 |

Exemplos: `/jogos?busca=zelda&nota_min=85` · `/jogos/elden-ring`

## Banco de dados

Banco `metacritic`, coleção `jogos`, com índice único em `slug` (evita duplicados).

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
| `slug` | identificador do jogo no site (único) |
| `titulo` | nome do jogo |
| `metascore` | nota de 0 a 100 (`null` quando o site mostra "tbd") |
| `veredito` | classificação da crítica, definida pela nota (90+ Universal Acclaim, 75+ Generally Favorable, 50+ Mixed or Average, 20+ Generally Unfavorable, abaixo disso Overwhelming Dislike) |
| `url` | página do jogo no Metacritic |
| `fonte` | página da listagem de onde o dado foi coletado |
| `primeira_coleta_em` / `ultima_coleta_em` | data e hora (UTC) da coleta |

---

## Problemas comuns

| Erro | Solução |
|---|---|
| `ServerSelectionTimeoutError` | MongoDB desligado. Abra o `services.msc` e inicie o serviço **MongoDB** |
| `No module named 'config'` | Rode de dentro da pasta do `config.py` e use `python -m crawler.crawler` |
| `pip` ou `uvicorn` não reconhecido | O ambiente virtual não está ativado (passo 2) |
| Dashboard mostra "API Offline" | A API não está rodando (passo 5) |
| Gráficos ou tabelas vazios | O crawler ainda não foi executado (passo 4) |
| Erro `403` no crawler | O site bloqueou a requisição. Espere um pouco e tente com menos páginas |

---

Projeto acadêmico · FIAP
