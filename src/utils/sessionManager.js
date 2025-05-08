const sesiones = {};

const timeouts = {};

function setRecordatorioInactividad(numero, callback, tiempoMs = 2 * 60 * 1000) {
  // Verificar si el último mensaje enviado fue el de fuera de horario laboral
  const ultimoMensaje = sesiones[numero]?.ultimoMensaje;
  const mensajeHorarioFuera = 'En estos momentos nos encontramos fuera de horario laboral. 📅 Mañana, una de nuestras asesoras especializadas 🤝 se pondrá en contacto contigo para ayudarte con todas tus dudas ❓ y apoyarte en tu proceso de inscripción 📝. 🙏 ¡Gracias por tu interés!';

  if (ultimoMensaje === mensajeHorarioFuera) {
    console.log('⏳ No se establecerá recordatorio debido a que el último mensaje fue sobre el horario fuera.');
    return; // No configurar recordatorio si fue ese mensaje
  }

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

// 👇 Guardamos el último mensaje enviado por el bot
function guardarUltimoMensaje(numero, mensaje) {
  if (!sesiones[numero]) sesiones[numero] = {};
  sesiones[numero].ultimoMensaje = mensaje;
}

module.exports = {
  setUltimoPrograma,
  getUltimoPrograma,
  yaSaludo,
  marcarSaludoEnviado,
  cancelarRecordatorio,
  setRecordatorioInactividad,
  guardarUltimoMensaje,
};
