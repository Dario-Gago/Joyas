const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

// Importa el middleware de logging y las rutas
const reporteMiddleware = require('./middlewares/logger')
const joyasRoutes = require('./routes/joyas.routes')

app.use(express.json()) // Permite interpretar JSON en las solicitudes
app.use(reporteMiddleware) // Aplica middleware para registrar solicitudes
app.use('/joyas', joyasRoutes) // Asigna todas las rutas bajo /joyas

// Middleware de manejo de errores no controlados
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err.stack)
  res.status(500).json({ error: 'Algo salió mal!' })
})

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
  console.log(`
  Rutas disponibles:
  - GET /joyas?limits=3&page=2&order_by=stock_ASC
  - GET /joyas/filtros?precio_min=25000&precio_max=30000&categoria=aros&metal=plata
  - GET /joyas/joya/:id
  `)
})

module.exports = app
