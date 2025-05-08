const path = require('path');
const fs = require('fs');

const jsonPath = path.join(__dirname, '..', 'seguimiento.json');

function buscarDetallesPrograma(nombrePrograma) {
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const programas = JSON.parse(raw);
  const resultado = programas.find(p =>
    p.PROGRAMA.toUpperCase().includes(nombrePrograma.toUpperCase())
  );
  return resultado || null;
}

module.exports = { buscarDetallesPrograma };
