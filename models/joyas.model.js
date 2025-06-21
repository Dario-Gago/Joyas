const { pool } = require('../db/connection') // Conexión a la base de datos PostgreSQL
const format = require('pg-format')

// Obtener la cantidad total de joyas
async function getTotalJoyas() {
  const totalQuery = 'SELECT COUNT(*) FROM inventario'
  const totalResult = await pool.query(totalQuery)
  return parseInt(totalResult.rows[0].count) // Devuelve el total como número
}

// Obtener joyas con paginación y orden. Validar campos y dirección para uso malicioso
async function getJoyas(limits, offset, field, direction) {
  const validFields = ['id', 'nombre', 'categoria', 'metal', 'precio', 'stock']
  const validDirections = ['ASC', 'DESC']
  const safeField = validFields.includes(field) ? field : 'id'
  const safeDirection = validDirections.includes(direction) ? direction : 'ASC'
  const query = format(
    'SELECT * FROM inventario ORDER BY %I %s LIMIT $1 OFFSET $2',
    safeField,
    safeDirection
  )
  const result = await pool.query(query, [limits, offset]) // Parámetros para evitar inyección SQL
  return result.rows
}

// Obtener joyas según filtros dinámicos
async function getJoyasPorFiltros(filtros) {
  let query = 'SELECT * FROM inventario WHERE 1=1' // 1=1 permite concatenar filtros dinámicos
  const values = []
  let paramCounter = 1

  if (filtros.precio_min) {
    query += ` AND precio >= $${paramCounter}`
    values.push(parseInt(filtros.precio_min))
    paramCounter++
  }

  if (filtros.precio_max) {
    query += ` AND precio <= $${paramCounter}`
    values.push(parseInt(filtros.precio_max))
    paramCounter++
  }

  if (filtros.categoria) {
    query += ` AND categoria = $${paramCounter}`
    values.push(filtros.categoria)
    paramCounter++
  }

  if (filtros.metal) {
    query += ` AND metal = $${paramCounter}`
    values.push(filtros.metal)
    paramCounter++
  }

  const result = await pool.query(query, values)
  return result.rows
}

// Obtener una joya por su ID
async function getJoyaById(id) {
  const query = 'SELECT * FROM inventario WHERE id = $1'
  const result = await pool.query(query, [id])
  return result.rows[0] // Devuelve solo una joya
}

module.exports = {
  getTotalJoyas,
  getJoyas,
  getJoyasPorFiltros,
  getJoyaById
}
