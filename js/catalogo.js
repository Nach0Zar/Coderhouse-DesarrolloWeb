import {InterfazCatalogo} from './clases.js';
let interfaz = new InterfazCatalogo();
if (!(sessionStorage.getItem('ListadoItems')==null || sessionStorage.getItem('ListadoItems')=="[]")){
    let articulosAgregados;
    articulosAgregados = JSON.parse(sessionStorage.getItem('ListadoItems'));
    interfaz.cargarArticulosAgregados(articulosAgregados);
}
interfaz.cargarArticulosListado();