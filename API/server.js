const express = require('express');
const cors = require('cors');
const app = express();
const geoRoutes = require('./routes/geoRoutes');

// ------------------------- Middleware -------------------------
app.use(cors());
app.use('/', geoRoutes);

// ------------------------- Inicialização do servidor -------------------------
const PORT = 5000;
app.listen(PORT, 'localhost', () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});