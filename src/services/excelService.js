const ExcelJS = require('exceljs');
const path = require('path');

const EXCEL_FILE_PATH = path.join(__dirname, '..', 'ProspectoBot.xlsx');
const WORKSHEET_NAME = 'Mensajes';

async function guardarMensajeEnExcel(fecha, hora, numero, nombre, mensaje) {
  try {
    const workbook = new ExcelJS.Workbook();
    let worksheet;

    try {
      await workbook.xlsx.readFile(EXCEL_FILE_PATH);
      worksheet = workbook.getWorksheet(WORKSHEET_NAME);
      if (!worksheet) {
        worksheet = workbook.addWorksheet(WORKSHEET_NAME);
        worksheet.addRow(['Fecha', 'Hora', 'Número', 'Nombre', 'Mensaje']);
      }
    } catch {
      worksheet = workbook.addWorksheet(WORKSHEET_NAME);
      worksheet.addRow(['Fecha', 'Hora', 'Número', 'Nombre', 'Mensaje']);
    }

    worksheet.addRow([fecha, hora, numero, nombre, mensaje]);
    await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
    console.log('✅ Mensaje guardado en Excel.');
  } catch (error) {
    console.error('❌ Error al guardar el mensaje en Excel:', error);
  }
}

module.exports = { guardarMensajeEnExcel };
