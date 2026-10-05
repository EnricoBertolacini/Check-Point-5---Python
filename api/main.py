"""API FastAPI que expõe os dados do MongoDB.

Rodar (na raiz do projeto):  uvicorn api.main:app --reload      (docs automáticas em /docs)
"""
import re

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from database.mongo import colecao

app = FastAPI(title="API Metacritic - Jogos", version="1.0")

# Libera o dashboard (outra porta/arquivo HTML) para chamar a API
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

SEM_ID = {"_id": 0}  # esconde o _id do Mongo (não é serializável em JSON)


def montar_filtro(busca, veredito, nota_min, nota_max) -> dict:
    filtro = {}
    if busca:
        filtro["titulo"] = {"$regex": re.escape(busca), "$options": "i"}
    if veredito:
        filtro["veredito"] = veredito
    if nota_min is not None or nota_max is not None:
        faixa = {}
        if nota_min is not None:
            faixa["$gte"] = nota_min
        if nota_max is not None:
            faixa["$lte"] = nota_max
        filtro["metascore"] = faixa
    return filtro


@app.get("/jogos")
def listar_jogos(
    busca: str | None = Query(None, description="Texto contido no título"),
    veredito: str | None = Query(None, description="Ex.: Universal Acclaim"),
    nota_min: int | None = Query(None, ge=0, le=100),
    nota_max: int | None = Query(None, ge=0, le=100),
    pagina: int = Query(1, ge=1),
    limite: int = Query(20, ge=1, le=100),
):
    """Lista jogos (paginado) com busca e filtros opcionais. Ordenado por nota."""
    filtro = montar_filtro(busca, veredito, nota_min, nota_max)
    total = colecao.count_documents(filtro)
    cursor = (
        colecao.find(filtro, SEM_ID)
        .sort([("metascore", -1), ("titulo", 1)])
        .skip((pagina - 1) * limite)
        .limit(limite)
    )
    return {"total": total, "pagina": pagina, "limite": limite, "resultados": list(cursor)}


@app.get("/jogos/{slug}")
def buscar_jogo(slug: str):
    """Consulta um jogo específico pelo slug (ex.: elden-ring)."""
    jogo = colecao.find_one({"slug": slug}, SEM_ID)
    if not jogo:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")
    return jogo


@app.get("/estatisticas")
def estatisticas():
    """Números gerais sobre os dados coletados."""
    total = colecao.count_documents({})
    grupo = list(
        colecao.aggregate(
            [
                {"$match": {"metascore": {"$ne": None}}},
                {
                    "$group": {
                        "_id": None,
                        "com_nota": {"$sum": 1},
                        "media": {"$avg": "$metascore"},
                        "maxima": {"$max": "$metascore"},
                        "minima": {"$min": "$metascore"},
                    }
                },
            ]
        )
    )
    g = grupo[0] if grupo else {}
    ultima = colecao.find_one({}, {"_id": 0, "ultima_coleta_em": 1}, sort=[("ultima_coleta_em", -1)])
    return {
        "total_jogos": total,
        "jogos_com_nota": g.get("com_nota", 0),
        "nota_media": round(g["media"], 1) if g else None,
        "nota_maxima": g.get("maxima"),
        "nota_minima": g.get("minima"),
        "ultima_coleta_em": ultima["ultima_coleta_em"] if ultima else None,
    }


@app.get("/dashboard")
def dados_dashboard():
    """Tudo que o dashboard precisa em uma única chamada."""
    por_veredito = [
        {"veredito": d["_id"], "quantidade": d["quantidade"]}
        for d in colecao.aggregate(
            [
                {"$match": {"veredito": {"$ne": None}}},
                {"$group": {"_id": "$veredito", "quantidade": {"$sum": 1}}},
                {"$sort": {"quantidade": -1}},
            ]
        )
    ]

    rotulos = {0: "0-49", 50: "50-69", 70: "70-79", 80: "80-89", 90: "90-100"}
    por_faixa = [
        {"faixa": rotulos[d["_id"]], "quantidade": d["quantidade"]}
        for d in colecao.aggregate(
            [
                {"$match": {"metascore": {"$ne": None}}},
                {
                    "$bucket": {
                        "groupBy": "$metascore",
                        "boundaries": [0, 50, 70, 80, 90, 101],
                        "output": {"quantidade": {"$sum": 1}},
                    }
                },
            ]
        )
    ]

    top_jogos = list(
        colecao.find({"metascore": {"$ne": None}}, {"_id": 0, "titulo": 1, "metascore": 1, "slug": 1})
        .sort("metascore", -1)
        .limit(10)
    )

    return {
        "resumo": estatisticas(),
        "por_veredito": por_veredito,
        "por_faixa": por_faixa,
        "top_jogos": top_jogos,
    }
