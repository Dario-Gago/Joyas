// Middleware para registrar detalles de cada solicitud que llega al servidor
const reporteMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString() // Fecha y hora actual
  const method = req.method // Método HTTP (GET, POST, etc.)
  const url = req.originalUrl // Ruta original solicitada
  const query =
    Object.keys(req.query).length > 0
      ? JSON.stringify(req.query) // Si hay parámetros de consulta, los convierte a string
      : 'Sin parámetros' // Si no, mensaje por defecto

  // Imprime el log con los datos de la solicitud
  console.log(`[${timestamp}] ${method} ${url} - Query: ${query}`)
  next() // Continúa al siguiente middleware o ruta
}

module.exports = reporteMiddleware
