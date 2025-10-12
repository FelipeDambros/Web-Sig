const express = require('express');
const router = express.Router();
const { buscarPorKey, listarTabelas, listarKeys } = require('../services/geojsonService');
const { exportKMZ, exportSHP } = require('../controllers/exportController');

// /geojson?banco=...&tabela=<cache_table>&key=<layer_key>
router.get('/geojson', async (req, res) => {
  const { banco, tabela, key } = req.query;
  if (!banco)  return res.status(400).json({ erro: 'Parâmetro ?banco= é obrigatório' });
  if (!tabela) return res.status(400).json({ erro: 'Parâmetro ?tabela= é obrigatório' });
  if (!key)    return res.status(400).json({ erro: 'Parâmetro ?key= é obrigatório' });

  try {
    const { data, etag } = await buscarPorKey({ banco, tabela, key });

    if (etag && req.headers['if-none-match'] === etag) return res.status(304).end();
    if (etag) { res.set('ETag', etag); res.set('Cache-Control', 'public, max-age=60'); }
    return res.json(data);
  } catch (err) {
    if (err.code === 'BANCO_DESCONHECIDO') {
      return res.status(400).json({ erro: `Banco desconhecido: ${err.nomeBanco}` });
    }
    if (err.code === 'TABELA_INVALIDA') {
      return res.status(400).json({ erro: `Nome de tabela inválido: ${err.tabela}` });
    }
    if (err.code === 'CACHE_TABLE_NOT_FOUND') {
      return res.status(404).json({ erro: `Tabela não encontrada: ${err.tabela}` });
    }
    if (err.code === 'CACHE_TABLE_BAD_SCHEMA') {
      return res.status(400).json({ erro: `Tabela ${err.tabela} não tem as colunas esperadas (layer_key, data, updated_at)` });
    }
    if (err.code === 'LAYER_NOT_FOUND') {
      try {
        const disponiveis = await listarKeys(banco, tabela);
        return res.status(404).json({ erro: 'key_nao_encontrada', solicitada: err.requested, disponiveis });
      } catch (_) {}
      return res.status(404).json({ erro: 'key_nao_encontrada', solicitada: err.requested });
    }
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao buscar GeoJSON' });
  }
});

// mantém
router.get('/tabelas', async (req, res) => {
  try {
    const banco = req.query.banco;
    if (!banco) return res.status(400).json({ erro: 'Parâmetro ?banco= é obrigatório' });
    const tabelas = await listarTabelas(banco);
    res.json(tabelas);
  } catch (err) {
    if (err.code === 'BANCO_DESCONHECIDO') {
      return res.status(400).json({ erro: `Banco desconhecido: ${err.nomeBanco}` });
    }
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar tabelas' });
  }
});

router.get('/export/kmz', exportKMZ);
router.get('/export/shp', exportSHP);

module.exports = router;
