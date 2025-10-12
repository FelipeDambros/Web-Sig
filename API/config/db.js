const { Pool } = require('pg');

// Mapeia os bancos disponíveis
const dbConfigs = {
    Dados_Jacarei: {
        user: 'Felipe',
        host: 'acesso.geowebsig.shop',
        database: 'Dados_Jacarei',
        password: 'carlosfelipe',
        port: 5432,
    },
    assentamento_pa_egidio_brunetto: {
        user: 'Felipe',
        host: 'acesso.geowebsig.shop',
        database: 'assentamento_pa_egidio_brunetto',
        password: 'carlosfelipe',
        port: 5432,
    },
    Sitio_Ecologico: {
        user: 'Felipe',
        host: 'acesso.geowebsig.shop',
        database: 'Sitio_Ecologico',
        password: 'carlosfelipe',
        port: 5432,
    },
};

// Cria os pools dinamicamente
const pools = {};
for (const nome in dbConfigs) {
    pools[nome] = new Pool(dbConfigs[nome]);
}

module.exports = pools;
