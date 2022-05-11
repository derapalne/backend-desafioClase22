import {normalize, denormalize, schema} from "normalizr";
import util from "util";

import originalData from "./holding.js";

//console.log(util.inspect(originalData, true, 7, true));

// DEFINIR EL ESQUEMA DE NORMALIZACION

const persona = new schema.Entity("personas");
const gerente = new schema.Entity("gerentes", {
    gerente: persona
})
const encargado = new schema.Entity("encargados", {
    encargado: persona
})
const empleado = new schema.Entity("empleados", {
    empleado: persona
})
const empresa = new schema.Entity("empresas", {
    gerente: gerente,
    encargado: encargado,
    empleados: [empleado],
});
const holding = new schema.Entity("holding", {
    empresas: [empresa],
});

// OBTENER EL OBJETO NORMALIZADO E IMPRIMIRLO POR CONSOLA

const normalizedData = normalize(originalData, holding);
console.log(util.inspect(normalizedData, true, 7, true));

// DESNORMALIZAR EL OBJETO OBTENIDO EN EL PUNTO ANTERIOR

const denormalizedData = denormalize(normalizedData.result, holding, normalizedData.entities);


const normalizedLength = JSON.stringify(normalizedData).length;
const deormalizedLength = JSON.stringify(denormalizedData).length;
const originalLength = JSON.stringify(originalData).length

// IMPRIMIR LA LONGITUD DEL OBJETO ORIGINAL, DEL NORMALIZADO Y DEL DESNORMALIZADO

console.log(`original Length: ${originalLength}, normalized Length: ${normalizedLength}, denormalized Length: ${deormalizedLength}.`);

const compressionRate = Math.abs((normalizedLength / originalLength) * 100 -100);

// IMPRIMIR EL PORCENTAJE DE COMPRESIÓN DEL PROCESO DE NORMALIZACIÓN

console.log(`compressionRate : ${compressionRate.toString().substring(0,4)}%`);
