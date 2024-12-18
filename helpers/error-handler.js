function errorHandler(err, req, res, next) {
    // Manejo de errores de autorización
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ message: "Usuario no autorizado" });
    }
  
    // Manejo de errores de validación
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Datos de entrada inválidos", details: err.message });
    }
  
    // Manejo de otros errores
    // En producción no deberías devolver detalles del error, solo un mensaje genérico
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({ message: "Algo salió mal, por favor intente más tarde." });
    }
  
    // En desarrollo, puedes devolver el error completo para facilitar la depuración
    return res.status(500).json({ message: err.message, stack: err.stack });
  }
  
  module.exports = errorHandler;
  