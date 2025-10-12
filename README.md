# 🌐 Projeto de Mapa Interativo com Exportação (Node.js + Leaflet)

Este projeto é uma aplicação web que exibe dados geográficos diretamente do PostgreSQL/PostGIS em um mapa interativo usando Leaflet, com opção de exportar os dados em formatos **KMZ** e **SHP**.

---

## 📁 Estrutura do Projeto

```
├── api/                     # Backend Node.js (Express)
│   ├── config/             # Configurações do banco de dados
│   ├── controllers/        # Lógica de exportação
│   ├── routes/             # Rotas da API
│   ├── services/           # Consulta ao banco e formatação GeoJSON
│   ├── utils/              # Funções auxiliares
│   └── server.js           # Inicialização do servidor
│
└── view/EquipamentosLimite/  # Frontend
    ├── index.html
    ├── map.css
    ├── pagina.css
    ├── map.js
    └── pagina.js
```

---

## 🚀 Como Rodar

### 🖥️ Backend (API)

1. Acesse a pasta `/api`:
   ```bash
   cd api
   ```

2. Instale as dependências:

3. Crie ou edite a configuração do banco no arquivo `config/db.js`:
   ```js
   const pool = new Pool({
       user: 'postgres',
       host: 'localhost',
       database: 'Dados_Jacarei',
       password: '123',
       port: 5432,
   });
   ```

4. Inicie o servidor:
   ```bash
   node server.js
   ```

5. A API estará rodando em: [http://localhost:3000](http://localhost:3000)

---

### 🌍 Frontend

1. Vá até a pasta:
   ```bash
   cd sites/EquipamentosLimite
   ```

2. Abra o `index.html` em um navegador (pode abrir direto com clique duplo).

---

## 📦 Endpoints da API

- `GET /geojson?tabela=nome_da_tabela` → Retorna GeoJSON da tabela
- `GET /tabelas` → Lista todas as tabelas disponíveis
- `GET /export/kmz?tabela=nome_da_tabela` → Exporta KMZ
- `GET /export/shp?tabela=nome_da_tabela` → Exporta SHP (.zip com .shp/.shx/.dbf)

---

## ✅ Tecnologias Usadas

- **Node.js + Express**
- **PostgreSQL + PostGIS**
- **Leaflet.js**
- **JSZip, tokml, shp-write**

---

