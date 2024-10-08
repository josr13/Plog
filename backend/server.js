const express = require('express')
const path = require('path');
require('dotenv').config()
const PORT = process.env.PORT

const app = express()

// Middleware
require('./middlewares/bodyParser')(app);

// Routes
const articlesRouter = require('./routes/articles.routes')
app.use('/api/v1/articles', articlesRouter)

// Frontend
app.use(express.static(path.join(__dirname, '..', 'frontend/src')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend/src', 'index.html'))
})

app.listen(PORT, () => { console.log('Servidor iniciado.') })