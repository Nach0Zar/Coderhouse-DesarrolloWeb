//esta funcion podrá cambiar cuando veamos como interactuar con el HTML
function crearArticulo(){
    let nombreArticulo=prompt("Ingrese el nombre del articulo");
    while(nombreArticulo==''){
        alert("El nombre no puede quedar vacio.")
        nombreArticulo=prompt("Ingrese el nombre del articulo");
    }
    let descripcion=prompt("Ingrese una breve descripcion del articulo");
    let precio=parseInt(prompt("Ingrese un valor positivo para el precio del articulo"));

    //reviso si el precio es un numero y si es mayor a 0
    while(!(/^(\d)+$/g.test(precio)) || precio<=0){
        alert("Error, valor incorrecto.")
        precio=parseInt(prompt("Ingrese un valor positivo para el precio del articulo"));
    }
    const articuloNuevo = new Articulo(nombreArticulo, descripcion, precio);
    alert("Se agregó exitosamente el artículo al carrito de compras.")
    return articuloNuevo;
}
//falta ver como tomar hijos dentro de un elemento ya tomado
function cargarArticulos(carrito){
    const articulos = document.getElementsByClassName('elementoCarrito');
    for(const articulo of articulos){
        const nombreElemento = articulo.getElementsByClassName('nombreElemento')[0].textContent;
        const descripcion = "Prueba";
        const precioElemento = articulo.getElementsByClassName('precioElemento')[0].textContent.replace("$","");
        const articuloCreado = new Articulo(nombreElemento, descripcion, precioElemento);
        carrito.agregarArticulo(articuloCreado);
    }
}

class Articulo{
    constructor(nombreArticulo, descripcion, precio){
        this.nombreArticulo = nombreArticulo;
        this.descripcion = descripcion;
        this.precio = parseInt(precio);
    }
    
}

class CarritoCompras{
    constructor(){
        this.articulosSeleccionados = [];
        this.precioTotal = 0;
    }
    agregarArticulo(articulo){
        this.articulosSeleccionados.push(articulo);
        this.precioTotal += articulo.precio;
    }
    removerArticulo(articulo){
        this.articulosSeleccionados.splice(Array.indexOf(articulo, this.articulosSeleccionados), 1);
        this.precioTotal -= articulo.precio;
    }
}

class Calculador{
    constructor(carritoCompras){
        this.carritoCompras = carritoCompras;
    }
    calcularCuotas(cuotas){
        //calculo 750 pesos de servicio por item comprado para agregarle a la compra total.
        const costoServicio = 750*this.carritoCompras.articulosSeleccionados.length;
        return (this.carritoCompras.precioTotal+costoServicio)/parseInt(cuotas);
    }
    costoTotal(){
        return this.carritoCompras;
    }
}

//leo los articulos a raiz del html, los creo como objetos, los agrego al carrito y pago en 12 cuotas el valor total + costo de servicio.

const carrito = new CarritoCompras();
const calculador = new Calculador(carrito);
cargarArticulos(carrito);
console.log("El valor total fue divido en 12 cuotas de $" + calculador.calcularCuotas(12) + " cada una.");