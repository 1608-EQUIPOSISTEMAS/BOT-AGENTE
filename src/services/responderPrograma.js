const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');
const fs = require('fs');
const { buscarDetallesPrograma } = require('./buscarDetallesPrograma');
const { setUltimoPrograma } = require('../utils/sessionManager'); // ⬅️ agrega esto arriba

async function responderProgramaIdentificado(message, programa) {
  const detalles = buscarDetallesPrograma(programa);
  setUltimoPrograma(message.from, detalles); // Guardamos el programa consultado


  // 1. Mensaje principal
  await message.reply(`Hola, soy WEAGENT, te brindaré la información de *${programa}*`);

  if (!detalles) return;

  // 2. Mensaje de beneficios
  if (detalles.BENEFICIOS) {
    await message.reply(detalles.BENEFICIOS);
  }

  // 3. Enviar el PDF
  const categoria = detalles.CATEGORIA?.trim().toUpperCase();

  const nombreImagen = detalles.POSTDOCEN?.trim();

  if (categoria && nombreImagen) {
    const rutaImagen = path.join(__dirname, '..', '..', 'media', 'images', categoria, nombreImagen);
    console.log('🖼️ Buscando imagen en:', rutaImagen);

    if (fs.existsSync(rutaImagen)) {
      console.log('✅ Imagen encontrada, enviando:', rutaImagen);
      const mediaImagen = MessageMedia.fromFilePath(rutaImagen);
      await message.reply(mediaImagen);
    } else {
      console.warn(`❌ No se encontró la imagen en: ${rutaImagen}`);
    }
  }

  //envio de PDF
  const nombreArchivoPDF = detalles.BROCHURE;

  if (categoria && nombreArchivoPDF) {
    const rutaPDF = path.join(__dirname, '..', '..', 'media', 'pdfs', categoria, nombreArchivoPDF);
    // Mostrar en consola cuál es el PDF que se está buscando
    console.log('📄 Buscando PDF en:', rutaPDF);
    if (fs.existsSync(rutaPDF)) {
      console.log('✅ PDF encontrado, enviando:', rutaPDF);
      const media = MessageMedia.fromFilePath(rutaPDF);
      await message.reply(media, message.from, {
        sendMediaAsDocument: true,
        caption: '📘 Brochure informativo',
      });
    } else {
      console.warn(`❌ No se encontró el archivo PDF en: ${rutaPDF}`);
    }
  }
}

module.exports = { responderProgramaIdentificado };
