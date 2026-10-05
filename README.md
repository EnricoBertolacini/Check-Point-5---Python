# 🎮 GameScope — Web Crawler, API e Dashboard de Jogos

Projeto acadêmico desenvolvido com o objetivo de criar uma aplicação completa de **coleta, armazenamento, disponibilização e visualização de dados da Web**.

O sistema coleta informações públicas sobre jogos disponíveis no **Metacritic**, armazena os dados em um banco **MongoDB**, disponibiliza essas informações através de uma **API REST desenvolvida com FastAPI** e apresenta os resultados em um **dashboard web desenvolvido com HTML, CSS e JavaScript**.

---

## 📌 Objetivo do projeto

O projeto demonstra na prática a integração entre diferentes etapas de uma aplicação de dados:

```text
Metacritic
    ↓
Web Crawler em Python
    ↓
MongoDB
    ↓
FastAPI
    ↓
API REST
    ↓
JavaScript
    ↓
Dashboard Web
```

O crawler acessa páginas públicas do Metacritic e coleta informações estruturadas sobre os jogos.

Os dados coletados são utilizados exclusivamente para fins educacionais.

---

# 🚀 Tecnologias utilizadas

## Back-end

- 🐍 Python
- ⚡ FastAPI
- 🍃 MongoDB
- 🔗 PyMongo
- 🌐 Requests
- 🍲 BeautifulSoup
- 🚀 Uvicorn

## Front-end

- HTML5
- CSS3
- JavaScript
- Fetch API

O projeto não utiliza frameworks de front-end, mantendo a interface simples e facilitando o entendimento da integração entre o JavaScript e a API.

---

# 🗂️ Estrutura do projeto

```text
Check-Point-5---Python/
│
├── api/
│   └── main.py
│
├── crawler/
│   └── crawler.py
│
├── database/
│   └── mongo.py
│
├── dashboard/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── config.py
├── requirements.txt
├── README.md
└── .gitignore
```

### 📁 `crawler/`

Responsável pela coleta dos dados do Metacritic.

O crawler acessa as páginas de listagem de jogos, identifica as informações necessárias e envia os dados para o MongoDB.

### 📁 `database/`

Contém a configuração de conexão com o MongoDB e disponibiliza a coleção utilizada pelo restante da aplicação.

### 📁 `api/`

Contém a API criada com FastAPI.

A API consulta os dados armazenados no MongoDB e disponibiliza os resultados através de endpoints HTTP.

### 📁 `dashboard/`

Contém o front-end da aplicação.

O JavaScript utiliza `fetch()` para consumir a API FastAPI e apresentar as informações coletadas de forma visual.

---

# 🎮 Dados coletados

Para cada jogo, o crawler pode armazenar informações como:

| Campo | Descrição |
|---|---|
| `slug` | Identificador único do jogo |
| `titulo` | Nome do jogo |
| `metascore` | Nota do jogo de 0 a 100 |
| `veredito` | Classificação relacionada à nota |
| `url` | Página do jogo |
| `fonte` | Página utilizada para realizar a coleta |
| `primeira_coleta_em` | Data da primeira coleta |
| `ultima_coleta_em` | Data da coleta mais recente |

Exemplo de documento armazenado:

```json
{
  "slug": "elden-ring",
  "titulo": "Elden Ring",
  "metascore": 96,
  "veredito": "Universal Acclaim",
  "url": "pagina-do-jogo",
  "fonte": "pagina-da-coleta",
  "primeira_coleta_em": "2026-10-05T18:00:00Z",
  "ultima_coleta_em": "2026-10-05T18:00:00Z"
}
```

---

# 🖥️ Dashboard

O projeto conta com um dashboard próprio desenvolvido em **HTML, CSS e JavaScript**.

A interface foi criada para tornar os dados retornados pela API mais fáceis de visualizar e analisar.

## Funcionalidades do dashboard

### 📊 Indicadores gerais

O dashboard apresenta cards com:

- Total de jogos coletados
- Nota média
- Maior nota encontrada
- Menor nota encontrada
- Data da última coleta

### 🏆 Top 10 jogos

Exibe os dez jogos com maiores notas presentes no banco de dados.

Os três primeiros colocados recebem destaque visual no ranking.

### 🔎 Pesquisa de jogos

É possível pesquisar jogos pelo nome.

Exemplo:

```text
Elden Ring
```

### 🎯 Filtro por nota

Também é possível filtrar jogos de acordo com a nota mínima.

Exemplos:

```text
90+
80+
70+
50+
```

### 🏷️ Filtro por veredito

Os jogos também podem ser filtrados pela classificação recebida no Metacritic.

### 📊 Distribuição das notas

O dashboard apresenta uma visualização da quantidade de jogos em diferentes faixas:

```text
90 - 100
80 - 89
70 - 79
50 - 69
0 - 49
```

### 📋 Distribuição por veredito

Também é apresentada a quantidade de jogos pertencentes a cada classificação encontrada nos dados.

### 🟢 Status da API

O dashboard verifica se consegue se comunicar com o FastAPI.

Quando a conexão está funcionando:

```text
● API Online
```

Caso a API não esteja disponível:

```text
● API Offline
```

### 📱 Layout responsivo

A interface se adapta a diferentes tamanhos de tela, permitindo visualizar o dashboard também em dispositivos menores.

---

# ⚙️ Instalação

## 1. Clonar o repositório

```bash
git clone REPOSITORIO_DO_PROJETO
```

Entre na pasta:

```bash
cd Check-Point-5---Python
```

---

# 🐍 2. Criar ambiente virtual

No Windows:

```powershell
py -m venv venv
```

Ative:

```powershell
.\venv\Scripts\Activate.ps1
```

Em Linux ou macOS:

```bash
python3 -m venv venv
source venv/bin/activate
```

O uso de ambiente virtual é recomendado para manter as dependências do projeto separadas das outras instalações do Python.

---

# 📦 3. Instalar as dependências

Com o ambiente virtual ativado:

```powershell
py -m pip install -r requirements.txt
```

As principais dependências utilizadas são:

```text
fastapi
uvicorn
pymongo
requests
beautifulsoup4
```

---

# 🍃 4. Configurar o MongoDB

O projeto utiliza um MongoDB local por padrão.

A conexão esperada é:

```text
localhost:27017
```

No Windows, é possível verificar se o serviço está funcionando com:

```powershell
Get-Service MongoDB
```

O status esperado é:

```text
Running
```

Caso esteja parado, execute o PowerShell como administrador e utilize:

```powershell
Start-Service MongoDB
```

O banco utilizado pelo projeto é:

```text
metacritic
```

E a coleção:

```text
jogos
```

O projeto utiliza um índice único baseado no `slug` para evitar jogos duplicados.

---

# 🕷️ 5. Executar o Web Crawler

Sempre execute os comandos a partir da pasta principal do projeto.

Para coletar uma página:

```powershell
py -m crawler.crawler 1
```

Para coletar três páginas:

```powershell
py -m crawler.crawler 3
```

O número informado representa a quantidade de páginas que o crawler deverá processar.

Durante a execução ocorre o seguinte fluxo:

```text
Metacritic
     ↓
Crawler
     ↓
Tratamento dos dados
     ↓
MongoDB
```

Jogos que já existem no banco podem ser atualizados, enquanto novos jogos são adicionados.

---

# ⚡ 6. Iniciar a API

Execute:

```powershell
py -m uvicorn api.main:app --reload
```

Se tudo estiver funcionando corretamente, será exibida uma mensagem semelhante a:

```text
Uvicorn running on http://127.0.0.1:8000
```

Mantenha esse terminal aberto enquanto estiver utilizando o dashboard.

---

# 📚 Documentação da API

O FastAPI gera automaticamente uma interface para testar os endpoints.

Com o servidor em execução, acesse no navegador:

```text
http://127.0.0.1:8000/docs
```

Por essa página é possível testar as requisições da API diretamente pelo navegador.

---

# 🔌 Endpoints

## Listar jogos

```http
GET /jogos
```

Lista os jogos armazenados no banco.

Aceita os seguintes parâmetros:

| Parâmetro | Função |
|---|---|
| `busca` | Pesquisa pelo nome |
| `veredito` | Filtra pela classificação |
| `nota_min` | Define nota mínima |
| `nota_max` | Define nota máxima |
| `pagina` | Página da consulta |
| `limite` | Quantidade de resultados |

Exemplo:

```text
/jogos?busca=zelda&nota_min=85
```

---

## Buscar jogo pelo slug

```http
GET /jogos/{slug}
```

Exemplo:

```text
/jogos/elden-ring
```

---

## Estatísticas

```http
GET /estatisticas
```

Retorna informações gerais, como:

```text
Total de jogos
Jogos com nota
Nota média
Maior nota
Menor nota
Última coleta
```

---

## Dados do dashboard

```http
GET /dashboard
```

Esse endpoint reúne em apenas uma requisição as principais informações necessárias pelo front-end.

Retorna:

```text
Resumo geral
Distribuição por veredito
Distribuição por faixa de nota
Top 10 jogos
```

---

# 🌐 7. Executar o Front-end

Depois de iniciar o MongoDB e o FastAPI, abra:

```text
dashboard/index.html
```

No VS Code, é recomendado utilizar a extensão **Live Server**.

Clique com o botão direito no arquivo:

```text
index.html
```

e selecione:

```text
Open with Live Server
```

O navegador deverá abrir o dashboard automaticamente.

Normalmente o endereço será semelhante a:

```text
http://127.0.0.1:5500/dashboard/index.html
```

O JavaScript do dashboard se comunica com a API executada em:

```text
http://127.0.0.1:8000
```

---

# 🔄 Fluxo completo para executar o projeto

Depois que tudo estiver instalado, normalmente basta seguir esta ordem:

## Terminal 1 — verificar MongoDB

```powershell
Get-Service MongoDB
```

## Terminal 2 — coletar dados

```powershell
py -m crawler.crawler 3
```

## Terminal 3 — iniciar FastAPI

```powershell
py -m uvicorn api.main:app --reload
```

## Navegador

Abra o dashboard utilizando o Live Server.

O fluxo completo será:

```text
               METACRITIC
                    │
                    ▼
              WEB CRAWLER
                  Python
                    │
                    ▼
                MongoDB
                    │
                    ▼
                FastAPI
                    │
             ┌──────┴──────┐
             ▼             ▼
         /jogos        /dashboard
             │             │
             └──────┬──────┘
                    ▼
               JavaScript
                  Fetch
                    │
                    ▼
          HTML + CSS Dashboard
                    │
                    ▼
                 USUÁRIO
```

---

# 🧪 Testando o projeto

Para verificar se cada etapa está funcionando:

### MongoDB

```powershell
Get-Service MongoDB
```

Deve aparecer como `Running`.

### API

Abra:

```text
http://127.0.0.1:8000/docs
```

Se a documentação aparecer, o FastAPI está funcionando.

### Dashboard

Abra o `index.html` pelo Live Server.

Se aparecer:

```text
● API Online
```

significa que o front-end conseguiu se comunicar com o back-end.

---

# ❗ Problemas comuns

## `uvicorn` não é reconhecido

Utilize:

```powershell
py -m uvicorn api.main:app --reload
```

---

## `ModuleNotFoundError`

Instale todas as dependências:

```powershell
py -m pip install -r requirements.txt
```

---

## Erro `localhost:27017`

Esse erro normalmente significa que o MongoDB não está em execução.

Verifique:

```powershell
Get-Service MongoDB
```

---

## Dashboard aparece, mas não mostra dados

Verifique se:

1. O MongoDB está ativo.
2. O crawler já foi executado.
3. Existem jogos armazenados no banco.
4. O FastAPI está rodando.
5. O dashboard mostra `API Online`.

---

# 🎓 Finalidade acadêmica

Este projeto foi desenvolvido para fins educacionais, demonstrando conceitos de:

- Web Crawling
- Web Scraping
- Python
- Manipulação de dados
- Banco de dados NoSQL
- MongoDB
- Desenvolvimento de APIs
- FastAPI
- Integração entre front-end e back-end
- Requisições HTTP
- JavaScript assíncrono
- Desenvolvimento de dashboards
- Git e GitHub

---

# 👥 Integrantes

Adicione aqui os nomes dos integrantes do grupo:

```text
Nome do integrante 1
Nome do integrante 2
Nome do integrante 3
```

---

# 📄 Observação

O projeto utiliza somente informações públicas relacionadas a jogos e foi desenvolvido exclusivamente para fins acadêmicos.

A coleta deve ser realizada de forma responsável, evitando um número excessivo de requisições ao site de origem.