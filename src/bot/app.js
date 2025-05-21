const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');
const { obtenerFechaHora } = require('../utils/datetime');
const { guardarMensajeEnExcel } = require('../services/excelService');
const { identificarPrograma } = require('../utils/programaIdentifier');
const { responderProgramaIdentificado } = require('../services/responderPrograma');
const { enviarHorarios } = require('../services/enviarHorarios');

const sesiones = {}; // Sesiones activas por número

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './session' }),
  puppeteer: {
    executablePath: puppeteer.executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  },
});

client.on('qr', (qr) => {
  console.log('📱 Escanea este QR para iniciar sesión:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Cliente listo y conectado a WhatsApp');
});

client.on('message', async (message) => {
  try {
    if (message.from.includes('@g.us') || message.from.includes('@broadcast')) return;
    if (message.type !== 'chat') return;

    const texto = (message.body || '').trim();
    const mensaje = texto.toLowerCase();
    const numero = message.from;
    const nombre = message._data?.notifyName || 'Sin nombre';
    const { fecha, hora } = obtenerFechaHora();

    console.log(`📩 Mensaje de ${numero}: ${texto}`);

    if (!sesiones[numero]) sesiones[numero] = {};
    const estado = sesiones[numero].estado || null;

    // ✅ MENÚ GLOBAL (se evalúa antes que cualquier estado)
    if (texto === '1' || texto === '2' || texto === '3') {
      sesiones[numero] = {}; // Reinicia la sesión por si hay estados previos

      if (texto === '1'|| texto === 'aseso') {
        await client.sendMessage(numero, '📝 Te pondremos en contacto con un asesor personalizado. 😊');
        return;
      }

      if (texto === '3' || texto === 'pago') {
        sesiones[numero].estado = 'esperando_perfil_pago';
        await client.sendMessage(numero,
          'Genial! 💳 Estás en proceso de pago. Porfa antes coméntame tu perfil. ¿Eres estudiante o profesional?\n\n' +
          '📌 *Para estudiante*: deberá adjuntar foto de su carnet universitario o ficha de matrícula/intranet.\n\n' +
          'Sabiendo eso, coméntame: ¿qué perfil tienes?');
        return;
      }

      if (texto === '2' || texto === 'llamada') {
        await client.sendMessage(numero, '📞 Te llamaremos para resolver tus dudas. ¡Gracias!');
        return;
      }
    }

    // FLUJO 3: Mensaje desde la web o redes sociales
    const fuentesValidas = ['hola estoy en', 'hola, estoy en'];
    const plataformasValidas = ['web', 'facebook', 'linkedin', 'instagram'];
    const iniciaCorrectamente = fuentesValidas.some(f => mensaje.startsWith(f));
    const contienePlataforma = plataformasValidas.some(p => mensaje.includes(p));

    if (iniciaCorrectamente && contienePlataforma) {
      const programa = identificarPrograma(texto); 
      if (programa) {
        console.log(`🎯 Programa identificado: ${programa}`);
        await responderProgramaIdentificado(message, programa);
        enviarHorarios(client, numero, programa);
      } else {
        await client.sendMessage(numero);
      }
      return;
    }

    // FLUJO: Selección de perfil
    if (estado === 'esperando_perfil_pago' || mensaje.includes('estudiante') || mensaje.includes('profesional')) {
      if (mensaje.includes('estudiante')) {
        sesiones[numero].perfil = 'estudiante';
        sesiones[numero].estado = 'perfil_seleccionado';
        await client.sendMessage(numero, '✅ Gracias por la info. Una asesora se pondrá en contacto contigo para validar tu condición de estudiante. 🎓\n\nSi deseas cambiar tu perfil, simplemente escribe *profesional*.');
        return;
      } else if (mensaje.includes('profesional')) {
        sesiones[numero].perfil = 'profesional';
        sesiones[numero].estado = 'esperando_metodo_pago';
        await client.sendMessage(numero,
          'Perfecto 💼 Aquí tienes las opciones de pago disponibles:\n\n' +
          '1. Pago por Yape\n' +
          '2. Pago por Transferencia\n' +
          '3. Pago en Campus\n' +
          '4. Pago por Tarjeta de crédito\n' +
          '5. Asesoría Personalizada\n\n' +
          'Puedes cambiar tu perfil escribiendo *estudiante*. 👈');
        return;
      } else {
        await client.sendMessage(numero, 'Por favor indícame si eres *estudiante* o *profesional* para continuar. 🙌');
        sesiones[numero].estado = 'esperando_perfil_pago';
        return;
      }
    }

    // FLUJO: Selección de método de pago
    if (estado === 'esperando_metodo_pago' || estado === 'perfil_seleccionado') {
      if (mensaje === '1' || mensaje.includes('yape')) {
        await message.reply('Perfecto ✨\nTe envío el número de Yape y Código QR 👇\n📲 999 606 366 // WE Educación Ejecutiva');
        const qr = MessageMedia.fromFilePath('./media/pago/yape.jpg');
        await client.sendMessage(numero, qr);
        sesiones[numero].estado = 'esperando_metodo_pago';
        return;
      } else if (mensaje === '2' || mensaje.includes('transferencia') || mensaje.includes('banco')) {
        await message.reply('💳 Puedes realizar el pago mediante transferencia entre estas bancas:');
        const tran = MessageMedia.fromFilePath('./media/pago/transferencia.jpg');
        await client.sendMessage(numero, tran);
        sesiones[numero].estado = 'esperando_metodo_pago';
        return;
      } else if (mensaje === '3' || mensaje.includes('campus')) {
        await message.reply('💳 Puedes realizar el pago en línea aquí:\nhttps://www.youtube.com/watch?v=NcYRBhhMadk');
        sesiones[numero].estado = 'esperando_metodo_pago';
        return;
      } else if (mensaje === '4' || mensaje.includes('tarjeta') || mensaje.includes('token')) {
        await message.reply('¡Muchas gracias por todos los datos brindados!\nEn estos momentos nos encontramos fuera de horario laboral. 📅 Una asesora se pondrá en contacto contigo mañana. 🙏');
        sesiones[numero].estado = 'esperando_metodo_pago';
        return;
      } else if (mensaje === '5' || mensaje.includes('asesor') || mensaje.includes('ayuda')) {
        await message.reply('¡Gracias por tu interés!\nUna asesora se pondrá en contacto contigo mañana. 🙏');
        delete sesiones[numero];
        return;
      } else {
        await client.sendMessage(numero, 'Por favor responde con el número o palabra del método de pago que deseas usar. 🙏');
        return;
      }
    }

    // FLUJO POR DEFECTO: guardar el mensaje
    await guardarMensajeEnExcel(fecha, hora, numero, nombre, texto);

  } catch (error) {
    console.error('❌ Error al procesar el mensaje:', error);
  }
});



client.initialize();
