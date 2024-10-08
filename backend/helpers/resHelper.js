// Verificar si un artículo existe en la base de datos
const verificarArticulo = (res, result) => {
    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Artículo no encontrado.' })
    }
}

module.exports = verificarArticulo