const path = require('path');
const fs = require('fs');

// Cargar el JSON de sinónimos una vez al iniciar
const sinonimosPath = path.join(__dirname, '..', 'sinonimos.json');
const sinonimos = JSON.parse(fs.readFileSync(sinonimosPath, 'utf-8'));

// Esta función analiza el texto y devuelve la clave del programa si lo encuentra
function identificarPrograma(mensaje) {
  const mensajeLimpio = mensaje.toLowerCase();

  for (const clave in sinonimos) {
    const sinonimosLista = sinonimos[clave];

    // Verifica si el mensaje contiene la clave tal cual
    if (mensajeLimpio.includes(clave.toLowerCase())) {
      return clave;
    }

    // Verifica si contiene alguno de los sinónimos
    for (const sinonimo of sinonimosLista) {
      if (mensajeLimpio.includes(sinonimo.toLowerCase())) {
        return clave;
      }
    }
  }

  return null; // No encontró ningún programa
}

module.exports = { identificarPrograma };
