function obtenerSaludoPersonalizado() {
    const hora = new Date().getHours();
    let saludoBase = "";

    if (hora < 12) saludoBase = "¡Buenos días!";
    else if (hora < 18) saludoBase = "¡Buenas tardes!";
    else saludoBase = "¡Buenas noches!";

    const variaciones = [
        `${saludoBase} Gracias por escribirnos.`,
        `${saludoBase} Me alegra saber que te interesa el programa.`,
        `${saludoBase} A continuación te envío los detalles.`,
    ];

    return variaciones[Math.floor(Math.random() * variaciones.length)];
}

module.exports = { obtenerSaludoPersonalizado };
