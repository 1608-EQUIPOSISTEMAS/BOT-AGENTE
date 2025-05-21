// src/services/responderDetalles.js

const { getUltimoPrograma } = require('../utils/sessionManager');

async function responderSiPreguntaDetalle(message) {
  const texto = message.body.toLowerCase();
  const ultimo = getUltimoPrograma(message.from);

  if (!ultimo) return false;

  let respuesta = '';

  const cursoMes = ultimo['CURSO MES']?.toUpperCase() === 'SI';
  const precioFinal = cursoMes ? 'S/.250 (válido por ser *CURSO DEL MES*)' : (ultimo.PRECIO || 'Aún no se cuenta.');

  if (texto.includes('precio') || texto.includes('monto') || texto.includes('inversión')) {
    respuesta = `💰 *Inversión de ${ultimo.PROGRAMA}*: ${precioFinal}`;
  } else if (texto.includes('sesiones') || texto.includes('sesion')|| texto.includes('clase')   ) {
    respuesta = `📚 *Sesiones de ${ultimo.PROGRAMA}*: ${ultimo.SESIONES || 'No disponible'}`;
  } else if (texto.includes('docente') || texto.includes('profesor')) {
    respuesta = `👨‍🏫 *Docente de ${ultimo.PROGRAMA}*: ${ultimo.DOCENTE || 'Docente por confirmar'}`;
  } else if (texto.includes('certificado') || texto.includes('avalado')) {
    respuesta = `📜 *El certificado de ${ultimo.PROGRAMA}* esta ${ultimo.CERTIFICADO || 'avalado solamente por WE'}`;
  } else if (texto.includes('cursos') || texto.includes('conforma') || texto.includes('compuesto') || texto.includes('seguimiento')) {
    const cursos = [
      ultimo.CURSO1,
      ultimo.CURSO2,
      ultimo.CURSO3,
      ultimo.CURSO4,
      ultimo.CURSO5
    ].filter(curso => curso && curso.trim() !== '');
  
    respuesta = `📜 *El programa ${ultimo.PROGRAMA}* está conformado por:\n${cursos.map(c => `📘 ${c}`).join('\n')}`;
  
  } 
  
  if (respuesta) {
    await message.reply(respuesta);
    return true;
  }

  return false;
}

module.exports = { responderSiPreguntaDetalle };