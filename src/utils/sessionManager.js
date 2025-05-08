const sesiones = {};

const timeouts = {};

function setRecordatorioInactividad(numero, callback, tiempoMs = 2 * 60 * 1000) {
  clearTimeout(timeouts[numero]); // Cancelar si ya existía
  timeouts[numero] = setTimeout(() => {
    callback();
    delete timeouts[numero]; // Limpieza
  }, tiempoMs);
}

function cancelarRecordatorio(numero) {
  clearTimeout(timeouts[numero]);
  delete timeouts[numero];
}


function setUltimoPrograma(numero, datosPrograma) {
  if (!sesiones[numero]) sesiones[numero] = {};
  sesiones[numero].datos = datosPrograma;
  sesiones[numero].timestamp = new Date();
}

function getUltimoPrograma(numero) {
  return sesiones[numero]?.datos || null;
}

// 👇 Persiste si ya se saludó al usuario
function yaSaludo(numero) {
  return sesiones[numero]?.saludoEnviado || false;
}

function marcarSaludoEnviado(numero) {
  if (!sesiones[numero]) sesiones[numero] = {};
  if (!sesiones[numero].saludoEnviado) {
    sesiones[numero].saludoEnviado = true;
  }
}

module.exports = {
  setUltimoPrograma,
  getUltimoPrograma,
  yaSaludo,
  marcarSaludoEnviado,
  cancelarRecordatorio,
  setRecordatorioInactividad,

};
