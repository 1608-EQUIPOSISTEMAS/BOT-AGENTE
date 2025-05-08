const seguimiento = require('../seguimiento.json');

async function manejarConsultasGenerales(client, numero, mensaje) {
  const lowerText = mensaje.toLowerCase();

  // Consulta de flexibilidad
  if (lowerText.includes('flexibilidad')) {
    await client.sendMessage(numero, '🧘‍♂️ Nuestra flexibilidad te permite cambiar fechas de inicio hasta 2 veces sin costo. Solo debes avisar con al menos 72 horas de anticipación.');
    return true;
  }

  // Consulta de intranet
  if (lowerText.includes('intranet')) {
    await client.sendMessage(numero, '🌐 Puedes ingresar a la intranet aquí: https://intranet.ejemplo.com/guias');
    return true;
  }

  if (lowerText.includes('ases')|| lowerText.includes('ayuda')|| lowerText.includes('personal'))  {
    await client.sendMessage(numero, 'En estos momentos nos encontramos fuera de horario laboral. 📅 Mañana, una de nuestras asesoras especializadas 🤝 se pondrá en contacto contigo para ayudarte con todas tus dudas ❓ y apoyarte en tu proceso de inscripción 📝. 🙏 ¡Gracias por tu interés!'
);
    return true;
  }

  return false; // No encontró coincidencias generales
}

module.exports = { manejarConsultasGenerales };