const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { obtenerFechaHora } = require('../utils/datetime');
const { guardarMensajeEnExcel } = require('../services/excelService');
const { identificarPrograma } = require('../utils/programaIdentifier');
const { responderProgramaIdentificado } = require('../services/responderPrograma');
const { enviarHorarios } = require('../services/enviarHorarios');
const { responderCompra } = require('../services/responderCompra');
const { responderSector } = require('../services/responderSector');
const { manejarConsultasGenerales } = require('../services/responderGenerales');
const { responderSiPreguntaDetalle } = require('../services/responderDetalles');
const { yaSaludo, marcarSaludoEnviado } = require('../utils/sessionManager');
const { obtenerSaludoPersonalizado } = require('../utils/saludo');
const { setRecordatorioInactividad } = require('../utils/sessionManager');



const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  console.log('📱 Escanea este QR para iniciar sesión:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Bot de WhatsApp listo.');
});

client.on('message', async (message) => {
  try {
    if (message.from.includes('@g.us') || message.from.includes('@broadcast')) return;
    if (message.type !== 'chat') return;

    const texto = (message.body || '').trim();
    const mensaje=message.body
    console.log(`📩 Mensaje de ${message.from}: ${texto}`);

    const respondidoPorDetalle = await responderSiPreguntaDetalle(message);
    if (respondidoPorDetalle) return;


    // 👇 Aquí va el flujo de pago
    const handledPago = await responderCompra(client, message, texto);
    console.log('👉 handledPago:', handledPago);
    if (handledPago) return;

    // 👇 3. Consultas generales como "flexibilidad", "certificado", "intranet"
    const atendido = await manejarConsultasGenerales(client, message.from, mensaje);
    if (atendido) return;

    const { fecha, hora } = obtenerFechaHora();
    const numero = message.from;
    const nombre = message._data?.notifyName || 'Sin nombre';

    // 👋 Saludo personalizado solo una vez por usuario
    if (!yaSaludo(numero)) {
      const saludo = obtenerSaludoPersonalizado();
      await client.sendMessage(numero, saludo);
      marcarSaludoEnviado(numero);
    }
    setRecordatorioInactividad(numero, async () => {
      await client.sendMessage(numero, '¿Necesitas ayuda con algo más? Si deseas, puedo ponerte en contacto con una asesora. 😊');
    });

    //Busqueda de programa
    const programa = identificarPrograma(texto);
    if (programa) {
      console.log(`🎯 Programa identificado: ${programa}`);
      await responderProgramaIdentificado(message, programa);
      // Enviar horarios del programa
      enviarHorarios(client, numero, programa);
    } else {
      // Si no se menciona un programa, respondemos con los sectores
      console.log('❌ No se identificó ningún programa. Ofreciendo sectores...');
      // Cambiar aquí: Pasamos el texto y el cliente para enviar el mensaje
      const respuestaSector = await responderSector(texto, client, numero);

    }
    //Fin busqueda de programa

    await guardarMensajeEnExcel(fecha, hora, numero, nombre, texto);

  } catch (error) {
    console.error('❌ Error al procesar el mensaje:', error);
  }
});

client.initialize();
