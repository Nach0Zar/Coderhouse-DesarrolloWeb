import {InterfazCatalogo} from './clases.js';
let interfaz = new InterfazCatalogo();
console.log(JSON.parse(sessionStorage.getItem('ListadoItems')));