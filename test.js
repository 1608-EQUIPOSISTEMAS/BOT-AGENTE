const { guardarConsulta, obtenerFechaHora } = require('./src/bot/guardarConsulta');

const { fecha, hora } = obtenerFechaHora();
guardarConsulta(fecha, hora, '999999999', 'Tester', 'Solo probando...', 'Logística');
