import {InterfazCarrito} from './clases.js';
let interfaz = new InterfazCarrito();
//revisa si fue creado previamente el objeto interfaz que posee toda la informacion
if (!(sessionStorage.getItem('ListadoItems')==null || sessionStorage.getItem('ListadoItems')=="[]")){
    let listadoItems = JSON.parse(sessionStorage.getItem('ListadoItems'));
    interfaz.crearArticulos(listadoItems);
}
interfaz.cargarArticulosListado();
interfaz.cargarTicketArticulos();
console.log("El valor total fue divido en 12 cuotas de $" + interfaz.calculador.calcularCuotas(12) + " cada una.");