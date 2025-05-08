function obtenerSaludoPersonalizado() {
    const variaciones = [
        "¡Hola! Gracias por escribirnos.",
        "¡Hola! Me alegra saber que te interesa el programa.",
        "¡Hola! A continuación te envío los detalles.",
    ];

    return variaciones[Math.floor(Math.random() * variaciones.length)];
}

module.exports = { obtenerSaludoPersonalizado };
