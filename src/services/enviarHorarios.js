const fs = require('fs');
const path = require('path');

// Ruta al archivo seguimiento.json
const SEGUIMIENTO_PATH = path.join(__dirname, '..', 'seguimiento.json');

// Función para obtener la fecha actual en formato ISO
function obtenerFechaActual() {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0]; // Solo la fecha (YYYY-MM-DD)
}

// Función para enviar el mensaje de horarios
function enviarHorarios(client, numero, programaNombre) {
    fs.readFile(SEGUIMIENTO_PATH, 'utf8', (err, data) => {
      if (err) {
        console.error('❌ Error al leer el archivo seguimiento.json:', err);
        return;
      }
  
      const seguimiento = JSON.parse(data);
      const fechaActual = obtenerFechaActual();
  
      // ✅ Solo fechas futuras y nombre exacto (ignora diferencias de mayúsculas)
      const opciones = seguimiento
        .filter(item =>
          item.PROGRAMA.toLowerCase() === programaNombre.toLowerCase() &&
          item.INICIO >= fechaActual
        )
        .slice(0, 2); // ✅ Máximo 2
  
      if (opciones.length > 0) {
        let mensaje = '🔵 HORARIOS\n';
  
        opciones.forEach((opcion, index) => {
          mensaje += `\nOpción ${index + 1}:\n`;
          mensaje += `📌 Programa: ${opcion.PROGRAMA}\n`;
          mensaje += `🔹 Inicio        : ${opcion.DIAS}  ${opcion.INICIO}\n`;
          mensaje += `🔹 Horario    : ${opcion.HORARIO} (Perú 🇵🇪)\n`;
          mensaje += `🔹 Duración  : ${opcion.SESIONES} sesiones\n`;
        });

        mensaje += '\n\nClases EN VIVO 🔴 por Teams\n\n';
        mensaje += '🔵 ¿Horario complicado? TENEMOS FLEXIBILIDAD HORARIA para ti\n';
  
        client.sendMessage(numero, mensaje)
          .then(() => {
            console.log('✅ Horarios enviados para:', programaNombre);
        
          //AGREGADO  
          // ✅ Enviar mensaje con el precio
          const cursoMes = opciones[0]['CURSO MES']?.toUpperCase() === 'SI';
          const precioMensaje = cursoMes
            ? '💰 *INVERSIÓN ÚNICA:*\nS/.250 (válido por ser *CURSO DEL MES*)'
            : `💰 *INVERSIÓN:*\n${opciones[0].PRECIO}`;

          client.sendMessage(numero, precioMensaje)
            .then(() => {
              console.log('✅ Precio enviado.');

              // ✅ Enviar mensaje con beneficios
              const benefi = 
`🎁 *BENEFICIOS EXTRA*:
Por tu Inscripción en Programas En Vivo ⚡
🎁 Participas del sorteo de *01 💳 GIFTCARD FALABELLA* por el *Día de la Madre* 👩‍👧‍👦🌷
🗓️ Fecha del sorteo: 👉🏼 Viernes 16 de Mayo - 12:00 p.m.`;

              client.sendMessage(numero, benefi)
                .then(() => console.log('✅ Beneficios enviados.'))
                .catch(err => console.error('❌ Error enviando beneficios:', err));
            })
            .catch(err => console.error('❌ Error enviando precio:', err));
        })
        .catch((error) => {
          console.error('❌ Error al enviar el mensaje:', error);
        });
    } else {
      console.log('❌ No hay fechas futuras para el programa exacto:', programaNombre);
    }
  });
}

module.exports = { enviarHorarios };