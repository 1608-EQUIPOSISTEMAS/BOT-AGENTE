function obtenerFechaHora() {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString();
    const hora = ahora.toLocaleTimeString();
    return { fecha, hora };
  }
  
  module.exports = { obtenerFechaHora };
  