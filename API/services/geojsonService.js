const pools = require('../config/db');

function selecionarPool(nomeBanco) {
  const pool = pools[nomeBanco];
  if (!pool) {
    const e = new Error('BANCO_DESCONHECIDO');
    e.code = 'BANCO_DESCONHECIDO';
    e.nomeBanco = nomeBanco;
    throw e;
  }
  return pool;
}

// só minúsculas, números e _ (evita injection em identificadores)
function isValidTableName(t) {
  return /^[a-z0-9_]+$/.test(t || '');
}

function norm(x) {
  return String(x || '')
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/"/g, '')
    .toLowerCase();
}

// garante que a tabela existe e tem as colunas necessárias
async function ensureCacheTable(pool, tabela) {
  const q = `
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema='public' AND table_name=$1
  `;
  const { rows } = await pool.query(q, [tabela]);
  if (!rows.length) {
    const e = new Error('CACHE_TABLE_NOT_FOUND');
    e.code = 'CACHE_TABLE_NOT_FOUND';
    e.tabela = tabela;
    throw e;
  }
  const cols = new Set(rows.map(r => r.column_name));
  if (!cols.has('layer_key') || !cols.has('data') || !cols.has('updated_at')) {
    const e = new Error('CACHE_TABLE_BAD_SCHEMA');
    e.code = 'CACHE_TABLE_BAD_SCHEMA';
    e.tabela = tabela;
    throw e;
  }
}

/** Lê a linha do cache (tabela variável) pela chave explícita (layer_key) */
async function buscarPorKey({ banco, tabela, key }) {
  const pool = selecionarPool(banco);

  const tbl = norm(tabela);
  if (!isValidTableName(tbl)) {
    const e = new Error('TABELA_INVALIDA');
    e.code = 'TABELA_INVALIDA';
    e.tabela = tabela;
    throw e;
  }

  await ensureCacheTable(pool, tbl);

  const layerKey = norm(key);
  // IMPORTANTE: identificadores não aceitam bind param -> validar antes de interpolar
  const q = `
    SELECT data, to_char(updated_at,'YYYYMMDDHH24MISSUS') AS ts
    FROM ${tbl}
    WHERE layer_key = $1
  `;
  const { rows } = await pool.query(q, [layerKey]);

  if (!rows.length) {
    const e = new Error('LAYER_NOT_FOUND');
    e.code = 'LAYER_NOT_FOUND';
    e.requested = layerKey;
    throw e;
  }

  return {
    data: rows[0].data,
    etag: `${banco}:${tbl}:${layerKey}:${rows[0].ts}`
  };
}

// lista tabelas do schema public (como antes)
async function listarTabelas(banco) {
  const pool = selecionarPool(banco);
  const query = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public' AND table_type='BASE TABLE'
    ORDER BY table_name;
  `;
  const { rows } = await pool.query(query);
  return rows.map(r => r.table_name);
}

// lista keys disponíveis nessa tabela de cache
async function listarKeys(banco, tabela = 'collection_geojson_cache') {
  const pool = selecionarPool(banco);
  const tbl = norm(tabela);
  if (!isValidTableName(tbl)) {
    const e = new Error('TABELA_INVALIDA');
    e.code = 'TABELA_INVALIDA';
    e.tabela = tabela;
    throw e;
  }
  await ensureCacheTable(pool, tbl);
  const q = `SELECT layer_key FROM ${tbl} ORDER BY layer_key`;
  const { rows } = await pool.query(q);
  return rows.map(r => r.layer_key);
}

module.exports = { buscarPorKey, listarTabelas, listarKeys };
