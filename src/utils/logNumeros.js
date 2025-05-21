// logNumeros.js
const fs = require('fs');
const path = require('path');

const rutaJSON = path.join(__dirname, '../../log_numeros.json');

function cargarLogNumeros() {
  if (!fs.existsSync(rutaJSON)) return {};
  try {
    const contenido = fs.readFileSync(rutaJSON, 'utf-8');
    return JSON.parse(contenido);
  } catch (e) {
    console.error("❌ Error al leer o parsear log_numeros.json:", e);
    return {};
  }
}

function guardarLogNumeros(log) {
  try {
    fs.writeFileSync(rutaJSON, JSON.stringify(log, null, 2), 'utf-8');
  } catch (e) {
    console.error("❌ Error al guardar log_numeros.json:", e);
  }
}

// logNumeros.js
function esNumeroNuevo(numero) {
  const log = cargarLogNumeros();
  return !log[numero]; // Si el número no está en el log, es nuevo
}


function registrarNumero(numero) {
  const log = cargarLogNumeros();
  log[numero] = true;
  guardarLogNumeros(log);
}

function logNumero(numero) {
  console.log(`Número registrado: ${numero}`);
  registrarNumero(numero);  // Registra el número en el archivo JSON
}

module.exports = {
  esNumeroNuevo,
  registrarNumero,
  logNumero,
  cargarLogNumeros  // Asegúrate de exportar logNumero
};
