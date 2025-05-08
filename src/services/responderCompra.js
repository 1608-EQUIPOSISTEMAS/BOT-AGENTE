const estados = {};
const { MessageMedia } = require('whatsapp-web.js');

async function responderCompra(client, message, texto) {
    const from = message.from;
    const body = (texto || '').toLowerCase().trim();


    console.log(`🔍 Mensaje recibido: ${body}`);

    // 🧩 Paso 1: Activar menú de pago
    if (
        body.includes('pago') ||
        body.includes('realizar pago') ||
        body.includes('quiero pagar') ||
        body.includes('como pago')
    ) {
        console.log(`✉️ El bot enviará las opciones de pago:`);

        const opcionesPago = `
Tenemos diferentes formas de pago disponibles. Por favor, selecciona una opción:
1. Pago por Yape
2. Pago por Transferencia
3. Pago en Campus
4. Pago por Tarjeta de crédito
5. Asesoría Personalizada

Escribe el número o la opción. Para salir, escribe "salir".
        `;

        estados[from] = 'esperando_respuesta_pago';
        await client.sendMessage(from, opcionesPago);
        return true;
    }
    // 🧩 Paso 2: Manejar selección de pago
        if (estados[from] === 'esperando_respuesta_pago') {
            if (body === 'salir') {
                delete estados[from];
                await client.sendMessage(from, '🔚 Has salido del menú de pagos. Si deseas volver, escribe "pago".');
                return true;
            }
            if (body === '1' || body.includes('yape')) {
                console.log(`📝 Enviando pago por Yape`);
                await message.reply(`Perfecto ✨\nTe envío el número de Yape y Código QR 👇\n📲 999 606 366 // WE Educación Ejecutiva`);
                const qr = MessageMedia.fromFilePath('./media/pago/yape.jpg');
                await client.sendMessage(from, qr);
                return true;
            } else if (body === '2' || body.includes('transferencia') || body.includes('banco')) {
                console.log(`📝 Enviando pago por Transferencia`);
                await message.reply('💳 Puedes realizar el pago mediante transferencia entre estas bancas:');
                const tran = MessageMedia.fromFilePath('./media/pago/transferencia.jpg');
                await client.sendMessage(from, tran);
                return true;
            } else if (body === '3' || body.includes('Campus')) {
                console.log(`📝 Enviando pago por Web`);
                await message.reply('💳 Puedes realizar el pago en línea aquí:\nhttps://www.youtube.com/watch?v=NcYRBhhMadk');
                return true;
            } else if (body === '4' || body.includes('token') || body.includes('tarjeta')) {
                console.log(`📝 Enviando pago por Tarjeta`);
                await message.reply(`¡Muchas gracias por todos los datos brindados!
'En estos momentos nos encontramos fuera de horario laboral. 📅 Mañana, una de nuestras asesoras especializadas 🤝 se pondrá en contacto contigo para ayudarte con todas tus dudas ❓ y apoyarte en tu proceso de inscripción 📝. 🙏 ¡Gracias por tu interés!'
`);
                return true;
            } else if (body === '5' || body.includes('asesor') || body.includes('ayuda') || body.includes('personalizada')) {
                console.log(`📝 Enviando asesoría personalizada`);
                await message.reply(`¡Muchas gracias por todos los datos brindados!
'En estos momentos nos encontramos fuera de horario laboral. 📅 Mañana, una de nuestras asesoras especializadas 🤝 se pondrá en contacto contigo para ayudarte con todas tus dudas ❓ y apoyarte en tu proceso de inscripción 📝. 🙏 ¡Gracias por tu interés!'
`);
                return true;
            }

            // 🧾 Si eligió una forma de pago válida (excepto web o asesoría), pedimos los datos
            if (
                body === '1' || body === '2' ||
                body.includes('yape') || body.includes('transferencia') || body.includes('banco')
            ) {
                await client.sendMessage(from, `Bríndame por favor, los siguientes datos:

        🔹DNI o CÉDULA:
        🔹Nombre completo:
        🔹Número:
        🔹Fecha de Inicio:
        🔹Correo (Gmail):
        🔹Foto de Voucher:
        🔹Foto de Internat o Carnet Universitario: 
        🔹Pago en Cuotas o al Contado:

        Y listo! 🌟 Cuando realices el pago y envío de tus datos, me avisas para comentarte los siguientes pasos. 🙋🏻‍♀💙`);
            }

            // 👇 Este delete lo quitamos para permitir más interacciones hasta que el usuario diga "salir"
            // delete estados[from]; ❌

            return false;
        }


}

module.exports = { responderCompra };
