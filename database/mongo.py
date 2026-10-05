"""Persistência: tudo que fala com o MongoDB fica aqui."""
from datetime import datetime, timezone

from pymongo import MongoClient, ASCENDING

from config import MONGO_URI, DB_NAME, COLECAO

client = MongoClient(MONGO_URI, tz_aware=True)
colecao = client[DB_NAME][COLECAO]


def criar_indices():
    """Índice único no slug: impede jogos duplicados."""
    colecao.create_index([("slug", ASCENDING)], unique=True)


def salvar_jogo(jogo: dict) -> bool:
    """Insere o jogo ou atualiza se já existir (upsert).

    Nunca apaga nada: novas coletas só atualizam os registros existentes
    e adicionam os novos. Retorna True se o jogo era novo.
    """
    agora = datetime.now(timezone.utc)
    resultado = colecao.update_one(
        {"slug": jogo["slug"]},
        {
            "$set": {**jogo, "ultima_coleta_em": agora},
            "$setOnInsert": {"primeira_coleta_em": agora},
        },
        upsert=True,
    )
    return resultado.upserted_id is not None
