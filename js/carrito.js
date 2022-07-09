//esta funcion podrá cambiar cuando veamos como interactuar con el HTML
// function crearArticulo(){
//     let nombreArticulo=prompt("Ingrese el nombre del articulo");
//     while(nombreArticulo==''){
//         alert("El nombre no puede quedar vacio.")
//         nombreArticulo=prompt("Ingrese el nombre del articulo");
//     }
//     let descripcion=prompt("Ingrese una breve descripcion del articulo");
//     let precio=parseInt(prompt("Ingrese un valor positivo para el precio del articulo"));

//     //reviso si el precio es un numero y si es mayor a 0
//     while(!(/^(\d)+$/g.test(precio)) || precio<=0){
//         alert("Error, valor incorrecto.")
//         precio=parseInt(prompt("Ingrese un valor positivo para el precio del articulo"));
//     }
//     const articuloNuevo = new Articulo(nombreArticulo, descripcion, precio);
//     alert("Se agregó exitosamente el artículo al carrito de compras.")
//     return articuloNuevo;
// }
import {InterfazCarrito} from './clases.js';
let interfaz = new InterfazCarrito();
//revisa si fue creado previamente el objeto interfaz que posee toda la informacion
if (!(sessionStorage.getItem('ListadoItems')==null || sessionStorage.getItem('ListadoItems')=="[]")){
    console.log(sessionStorage.getItem('ListadoItems'))
    let listadoItems = JSON.parse(sessionStorage.getItem('ListadoItems'));
    interfaz.crearArticulos(listadoItems);
}
interfaz.cargarArticulosListado();
interfaz.cargarTicketArticulos();
console.log("El valor total fue divido en 12 cuotas de $" + interfaz.calculador.calcularCuotas(12) + " cada una.");

