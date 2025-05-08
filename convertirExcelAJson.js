const xlsx = require('xlsx');
const fs = require('fs');

// Columnas que deseas convertir a fecha
const columnasDeFecha = ['INICIO1', 'INICIO2', 'INICIO3', 'INICIO4', 'INICIO5', 'INICIO']; // Modifica según tus columnas reales
// Función para convertir los números de fechas a formato legible
function convertirFecha(valor) {
    if (typeof valor === 'number') {
        const fecha = xlsx.SSF.parse_date_code(valor);
        return fecha ? `${fecha.y}-${(fecha.m).toString().padStart(2, '0')}-${fecha.d.toString().padStart(2, '0')}` : valor;
    }
    return valor;
}

// Ruta al archivo Excel
const archivoExcel = './src/SEGUIMIENTO.xlsx'; // Ajusta si es necesario

// Cargar el archivo Excel
const wb = xlsx.readFile(archivoExcel);
const hoja = wb.Sheets[wb.SheetNames[0]];
const jsonData = xlsx.utils.sheet_to_json(hoja);

// Convertir solo ciertas columnas a fechas
const jsonDataConFechas = jsonData.map(row => {
    const rowConFechas = { ...row };
    columnasDeFecha.forEach(col => {
        if (rowConFechas[col]) {
            rowConFechas[col] = convertirFecha(rowConFechas[col]);
        }
    });
    return rowConFechas;
});

// Guardar el JSON con fechas convertidas
fs.writeFileSync('./src/seguimiento.json', JSON.stringify(jsonDataConFechas, null, 2), 'utf-8');

console.log('El archivo Excel ha sido convertido a JSON con fechas solo en columnas seleccionadas.');
