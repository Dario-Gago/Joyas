const express = require('express')
const router = express.Router()

// Importa funciones del modelo
const {
  getTotalJoyas,
  getJoyas,
  getJoyasPorFiltros,
  getJoyaById
} = require('../models/joyas.model')

// Función para dar formato HATEOAS a la respuesta
const formatHATEOAS = (joyas, totalJoyas, limits, page, order_by) => {
  const totalPages = Math.ceil(totalJoyas / limits)
  const baseUrl = 'http://localhost:3000/joyas'

  const results = joyas.map((joya) => ({
    name: joya.nombre,
    href: `/joyas/joya/${joya.id}`
  }))

  const hateoas = {
    total: totalJoyas,
    results,
    links: {
      self: `${baseUrl}?limits=${limits}&page=${page}&order_by=${order_by}`,
      first: `${baseUrl}?limits=${limits}&page=1&order_by=${order_by}`,
      last: `${baseUrl}?limits=${limits}&page=${totalPages}&order_by=${order_by}`
    }
  }

  if (page > 1) {
    hateoas.links.prev = `${baseUrl}?limits=${limits}&page=${
      page - 1
    }&order_by=${order_by}`
  }

  if (page < totalPages) {
    hateoas.links.next = `${baseUrl}?limits=${limits}&page=${
      page + 1
    }&order_by=${order_by}`
  }

  return hateoas
}

// GET /joyas → Lista paginada de joyas con HATEOAS
router.get('/', async (req, res) => {
  try {
    const limits = parseInt(req.query.limits) || 10
    const page = parseInt(req.query.page) || 1
    const order_by = req.query.order_by || 'id_ASC'

    const [field, direction] = order_by.split('_')
    const validFields = [
      'id',
      'nombre',
      'categoria',
      'metal',
      'precio',
      'stock'
    ]
    const validDirections = ['ASC', 'DESC']

    if (!validFields.includes(field) || !validDirections.includes(direction)) {
      return res.status(400).json({ error: 'Parámetro order_by inválido' })
    }

    const offset = (page - 1) * limits
    const totalJoyas = await getTotalJoyas()
    const joyas = await getJoyas(limits, offset, field, direction)

    const response = formatHATEOAS(joyas, totalJoyas, limits, page, order_by)
    res.json(response)
  } catch (error) {
    console.error('Error en GET /joyas:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// GET /joyas/filtros → Devuelve joyas que cumplan con filtros
router.get('/filtros', async (req, res) => {
  try {
    const joyas = await getJoyasPorFiltros(req.query)

    if (joyas.length === 0) {
      return res.json({
        message: 'No se encontraron joyas con los filtros especificados',
        joyas: []
      })
    }

    res.json({ joyas })
  } catch (error) {
    console.error('Error en GET /joyas/filtros:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// GET /joyas/joya/:id → Devuelve una joya específica por ID
router.get('/joya/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }

    const joya = await getJoyaById(parseInt(id))
    if (!joya) {
      return res.status(404).json({ error: 'Joya no encontrada' })
    }

    res.json({ joya })
  } catch (error) {
    console.error('Error en GET /joyas/joya/:id:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

module.exports = router
