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
        item.PROGRAMA &&
        item.INICIO &&
        item.PROGRAMA.toLowerCase() === programaNombre.toLowerCase() &&
        item.INICIO >= fechaActual
      )

      .slice(0, 2); // ✅ Máximo 2

    if (opciones.length > 0) {
      let mensaje = '🔵 *HORARIOS*\n';

      opciones.forEach((opcion, index) => {
        mensaje += `\n*Opción ${index + 1}:*\n`;
        mensaje += `🔹 *Inicio        :* ${opcion.INICIO}\n`;
        mensaje += `🔹 *Fin        :* ${opcion.FIN}\n`;
        mensaje += `🔹 *Horario    :* ${opcion.DIAS} ${opcion.HORARIO} (Perú 🇵🇪)\n`;
        mensaje += `🔹 *Duración  :* ${opcion.SESIONES} sesiones\n`;
      });

      mensaje += '\n\nClases EN VIVO 🔴 por Teams\n\n';
      mensaje += '🔵 ¿Horario complicado? TENEMOS *FLEXIBILIDAD HORARIA* para ti\n';

      client.sendMessage(numero, mensaje)
        .then(() => {
          console.log('✅ Horarios enviados para:', programaNombre);

          //AGREGADO  
          // ✅ Enviar mensaje con el precio
          const cursoMes = opciones[0]['CURSO MES']?.toUpperCase() === 'SI';
          const precioMensaje = cursoMes
            ? `📢 *CURSO DE LA SEMANA*\n\n📚 Única Inversión << *S/250* o *$66 dólares*\n👉🏼 Incluye todos los beneficios\n Quedan 04 vacantes con la promoción`
            : `💰 *INVERSIÓN:*\n${opciones[0].PRECIO}`;

          client.sendMessage(numero, precioMensaje)
            .then(() => {
              console.log('✅ Precio enviado.');

              // ✅ Enviar mensaje con beneficios
              const benefi =
                `Por tu Inscripción en Programas En Vivo ⚡
Participa del Sorteo de Un Kit de Accesorios de Invierno por *Winter Days*
1 Termo Stanley, 1 sobre de Cafe para pasar Starbucks y una Taza WE ☕ 🌧️
🗓️ Fecha del sorteo: 👉🏼 Viernes 30 de Mayo - 12:00 p.m.`;
              client.sendMessage(numero, benefi)
                .then(() => {
                  console.log('✅ Beneficios enviados.');


                  // ⬇️ AQUI AGREGAS TU MENSAJE FINAL DE OPCIONES
                  const opcionesFinales = `📌 Coméntame, ¿cómo deseas proceder?
1️⃣ Deseo comunicarme con un Asesor Especializado 👩‍💼
2️⃣ Deseo una Llamada para resolver dudas 📞
3️⃣ Quiero pagar 💳`;
                  client.sendMessage(numero, opcionesFinales)
                    .then(() => {
                      console.log('✅ Opciones enviadas.');

                      // Guardar el estado
                      estados[numero] = 'esperando_seleccion_post_info'; // ← Asegúrate que 'estados' esté accesible
                    })
                    .catch(err => console.error('❌ Error enviando opciones:', err));

                })

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