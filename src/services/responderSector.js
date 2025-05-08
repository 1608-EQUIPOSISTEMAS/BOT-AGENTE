const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');

// / Mapeo manual de áreas y cursos por nivel
const estructuraPorArea = {
    // DATOS
    "Ciencia de Datos": {
        PRACTICANTE: ["Excel Intermedio", "Data Analytics", "Python", "SQL Server"],
        ASISTENTE: ["Excel Avanzado", "SQL Server Avanzado", "Python Avanzado: Machine Learning"],
        ANALISTA: ["IA & Deep Learning"],
        COORDINADOR: ["Gestión Ágil de Proyectos"]
    },

    "Análisis de Datos": {
        PRACTICANTE: ["Excel Intermedio", "Power BI", "SQL Server"],
        ASISTENTE: ["Excel Avanzado", "SQL Server Avanzado", "VBA Macros", "Python"],
        ANALISTA: ["Python Avanzado: Machine Learning", "Data Analytics"],
        COORDINADOR: ["Gestión Ágil de Proyectos"]
    },

    "Business Intelligence": {
        PRACTICANTE: ["Excel Intermedio", "Power BI", "SQL Server"],
        ASISTENTE: ["Excel Avanzado", "Power BI Avanzado", "SQL Server Avanzado"],
        ANALISTA: ["VBA Macros"],
        COORDINADOR: ["Gestión Ágil de Proyectos"]
    },

    // PROCESOS
    "Gestión de Procesos": {
        PRACTICANTE: ["Gestión de Procesos Básico"],
        ASISTENTE: ["Gestión de Procesos Avanzado"],
        ANALISTA: ["Gestión Ágil de Proyectos", "Lean Six Sigma"],
        COORDINADOR: ["Gestión Estratégica de Procesos"]
    },

    "Gestión de la Mejora Continua": {
        PRACTICANTE: ["Introducción a la Mejora Continua"],
        ASISTENTE: ["Lean Six Sigma"],
        ANALISTA: ["Gestión Ágil de Proyectos"],
        COORDINADOR: ["ISO CALIDAD"]
    },

    "Gestión de la Calidad": {
        PRACTICANTE: ["ISO 9001"],
        ASISTENTE: ["Gestión de la Calidad Básica"],
        ANALISTA: ["Gestión de la Calidad Avanzada"],
        COORDINADOR: ["Gestión de Calidad Total"]
    },

    "Transformación & Automatización de Procesos": {
        PRACTICANTE: ["Introducción a la Automatización"],
        ASISTENTE: ["RPA Básico"],
        ANALISTA: ["Automatización Avanzada con RPA"],
        COORDINADOR: ["Gestión de la Transformación Digital"]
    },

    // LOGÍSTICA
    "Gestión de la Cadena de Suministro": {
        PRACTICANTE: ["Introducción a la Logística"],
        ASISTENTE: ["Gestión de Inventarios", "Logística Internacional"],
        ANALISTA: ["Logística Estratégica"],
        COORDINADOR: ["Gestión de la Cadena de Suministro Avanzada"]
    },

    "Gestión de Inventarios": {
        PRACTICANTE: ["Control de Inventarios Básico"],
        ASISTENTE: ["Gestión de Inventarios Avanzada"],
        ANALISTA: ["Optimización de Inventarios"],
        COORDINADOR: ["Gestión de Inventarios Estratégicos"]
    },

    "Gestión de Transporte y Distribución": {
        PRACTICANTE: ["Gestión Básica de Transporte"],
        ASISTENTE: ["Gestión Avanzada de Transporte"],
        ANALISTA: ["Optimización en Distribución y Transporte"],
        COORDINADOR: ["Logística Global"]
    },

    "Gestión de Almacenes": {
        PRACTICANTE: ["Operaciones de Almacén"],
        ASISTENTE: ["Gestión de Almacenes Avanzada"],
        ANALISTA: ["Optimización en Almacenes"],
        COORDINADOR: ["Gestión de Almacenes Estratégicos"]
    }
};

const removeAccents = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

async function responderSector(mensaje, client, numero) {
    const texto = removeAccents(mensaje.trim());

    let respuesta = "";

    // Paso 1: Si el mensaje contiene un sector, mostrar las áreas disponibles
    if (texto.includes("datos")) {
        respuesta = `📊 En el sector *Datos* puedes elegir una de estas áreas:\n- Ciencia de Datos\n- Análisis de Datos\n- Business Intelligence`;
    } else if (texto.includes("procesos")) {
        respuesta = `⚙ En el sector *Procesos* puedes elegir una de estas áreas:\n- Gestión de Procesos\n- Gestión de la Mejora Continua\n- Gestión de la Calidad\n- Transformación & Automatización de Procesos`;
    } else if (texto.includes("logistica") || texto.includes("logística")) {
        respuesta = `🚛 En el sector *Logística* puedes elegir una de estas áreas:\n- Gestión de la Cadena de Suministro\n- Gestión de Inventarios\n- Gestión de Transporte y Distribución\n- Gestión de Almacenes`;
    }

    // Paso 2: Buscar coincidencia flexible con el nombre del área
    else {
        const areaCoincidente = Object.keys(estructuraPorArea).find(area => {
            return removeAccents(area) === texto;
        });

        if (areaCoincidente) {
            const cursos = estructuraPorArea[areaCoincidente];
            respuesta = `📚 Estos son los cursos disponibles en *${areaCoincidente}*:\n`;
            for (const nivel in cursos) {
                respuesta += `\n🔸 *${nivel}*: ${cursos[nivel].join(', ')}`;
            }
        } else {
            respuesta = `🔍 Veo que no has preguntado por un programa en específico. 
🔎 Te guiaré un poco: ¿Te interesa información sobre alguno de estos sectores?
📊 Datos  
⚙ Procesos  
🚛 Logística`;
        }
    }

    await client.sendMessage(numero, respuesta);
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

module.exports = {
    responderSector
  };
  