require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./src/configs/db');
const routers = require('./src/routers');
const cors = require('cors');
const helmet = require('helmet');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.removeHeader('X-Powered-By');
  next();
});

app.use(cors());
app.use(express.json());
app.use(routers);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

db.connect()
  .then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
