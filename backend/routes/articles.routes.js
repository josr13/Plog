const express = require('express')
const router = express.Router()
const pool = require('../config/pgConfig')
const verificarArticulo = require('../helpers/resHelper.js')

// Obteniendo todos los artículos o filtrando por término de búsqueda
router.get('/', async (req, res) => {
    const { term } = req.query
    try {
        let result
        if (term) {
            result = await pool.query(
                'SELECT * FROM articles WHERE title ILIKE $1 OR content ILIKE $1 OR category ILIKE $1 OR array_to_string(tags, \',\') ILIKE $1',
                [`%${term}%`]
            )
            verificarArticulo(res, result)
        }
        else {
            result = await pool.query('SELECT * FROM articles')
        }
        return res.status(200).json(result.rows)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// Obteniendo un artículo por su ID
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query('SELECT * FROM articles WHERE article_id = $1', [id])
        verificarArticulo(res, result)
        return res.status(200).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// Creando un nuevo artículo
router.post('/', async (req, res) => {
    const { title, content, category, tags } = req.body
    if (!title || !content || !category || !tags) {
        return res.status(400).json({ error: 'Se requieren todos los campos.' })
    }
    try {
        const result = await pool.query(
            'INSERT INTO articles (title, content, category, tags) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, content, category, tags]
        )
        return res.status(201).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// Actualizando un artículo por su ID
router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { title, content, category, tags } = req.body
    if (!title || !content || !category || !tags) {
        return res.status(400).json({ error: 'Se requieren todos los campos' })
    }
    try {
        const result = await pool.query(
            'UPDATE articles SET title = $1, content = $2, category = $3, tags = $4 WHERE article_id = $5 RETURNING *',
            [title, content, category, tags, id]
        )
        verificarArticulo(res, result)
        return res.status(200).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// Eliminando un artículo por su ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query('DELETE FROM articles WHERE article_id = $1 RETURNING *', [id])
        verificarArticulo(res, result)
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

module.exports = router