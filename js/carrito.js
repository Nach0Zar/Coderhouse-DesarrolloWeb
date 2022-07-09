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
let interfaz;
let listadoDefaultItems = [{nombreArticulo: 'Monitor 24" LG Modelo ABsCs24w', descripcion: 'CARACTERÍTICAS GENERALES · Tamaño: 27“/68.6cm. Tipo de panel: TN · Color Gamut (CIE1931): 72%. Prof. de Color: 16.7M colores · Pixel pitch(mm): 0.31125 x 0.31125.', precio: 25000, imgSrc: "https://www.lg.com/us/images/tvs/50pk540/gallery/large01.jpg", cantidad: 1},
        {nombreArticulo: 'Combo cosmeticos AVON', descripcion: 'Cosmeticos Avon Combo Completo Cremas:6 CREMAS AVON CARE DE 100 G:2 RESTAURADORAS DE PUNTA +1 ACEITE DE ARGAN PARA EL CABELLO+1 CREMA FOREVER 200ml', precio: 45000, imgSrc: "https://cdn.static.escuelamakeup.com/imagenes/de-que-estan-hechos-los-cosmeticos_905x603.jpg", cantidad: 2},
        {nombreArticulo: 'Aceite de girasol COCINERO X12', descripcion: 'Pack x12 aceite cocinero venta al por mayor. Aceite de girasol de marca de primera linea a nivel sudamerica', precio: 5000, imgSrc: "https://jumboargentina.vtexassets.com/arquivos/ids/614663/Aceite-De-Girasol-Cocinero-900-Ml-1-32670.jpg?v=637409202878630000", cantidad: 3},
        {nombreArticulo: 'Pack escolar Lapices de colores + goma + sacapuntas', descripcion: 'Pack para inicio de clases. 50 Lapices para colorear y de regalo un pack de goma y sacapuntas', precio: 2000, imgSrc: "https://http2.mlstatic.com/D_NQ_NP_968821-MLA31587799913_072019-O.jpg", cantidad: 4}];
if (sessionStorage.getItem('ListadoItems')==null){
    sessionStorage.setItem('ListadoItems',JSON.stringify(listadoDefaultItems));
}
//revisa si fue creado previamente el objeto interfaz que posee toda la informacion
if (sessionStorage.getItem('Interfaz')==null){
    interfaz = new InterfazCarrito();
    interfaz.crearArticulos(listadoDefaultItems);
    sessionStorage.setItem('Interfaz',JSON.stringify(interfaz));
}
else{
    let interfazStorage = JSON.parse(sessionStorage.getItem('Interfaz'));
    interfaz = new InterfazCarrito(interfazStorage);
    let listadoItems = JSON.parse(sessionStorage.getItem('ListadoItems'));
    interfaz.crearArticulos(listadoItems);
}
interfaz.cargarArticulosListado();
interfaz.cargarTicketArticulos();
console.log("El valor total fue divido en 12 cuotas de $" + interfaz.calculador.calcularCuotas(12) + " cada una.");

