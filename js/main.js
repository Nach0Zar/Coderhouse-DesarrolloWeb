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
class Articulo{
    static idCounter = 0;
    constructor(nombreArticulo, descripcion, precio, imgSrc){
        this.id = Articulo.getIdCounter();
        Articulo.idCounter += 1;
        this.nombreArticulo = nombreArticulo;
        this.descripcion = descripcion;
        this.precio = parseInt(precio);
        this.imgSrc = imgSrc;
    }
    static getIdCounter(){
        return Articulo.idCounter;
    }
}
class CarritoCompras{
    constructor(){
        this.articulosSeleccionados = [];
        this.precioTotal = 0;
    }
    getArticulosSeleccionados(){
        return this.articulosSeleccionados;
    }
    agregarArticulo(articulo){
        this.articulosSeleccionados.push(articulo);
        this.precioTotal += articulo.precio;
    }
    removerArticulo(articulo){
        this.precioTotal -= articulo.precio;
        this.articulosSeleccionados.splice(this.articulosSeleccionados.indexOf(articulo), 1);
    }
}
class Calculador{
    constructor(carritoCompras){
        this.carritoCompras = carritoCompras;
    }
    getCarritoCompras(){
        return this.carritoCompras;
    }
    costoServicios(){
        //calculo 750 pesos de servicio por item comprado para agregarle a la compra total.
        return 750*this.carritoCompras.articulosSeleccionados.length;
    }
    costoTotal(){
        return this.carritoCompras.precioTotal+ this.costoServicios();
    }
    calcularCuotas(cuotas){
        return (this.costoTotal())/parseInt(cuotas);
    }
    costoSubTotal(){
        return this.carritoCompras.precioTotal;
    }
    
}
//esta clase se encargará en un futuro de la inserción de toda la información en el HTML en base a los articulos cargados
class Interfaz{
    constructor(calculador){
        this.calculador = calculador;
    }
    crearArticulos(){
        //por ahora carga articulos de la lista hardcodeada
        const listado = [{nombreElemento: 'Monitor 24" LG Modelo ABsCs24w', descripcionElemento: 'CARACTERÍTICAS GENERALES · Tamaño: 27“/68.6cm. Tipo de panel: TN · Color Gamut (CIE1931): 72%. Prof. de Color: 16.7M colores · Pixel pitch(mm): 0.31125 x 0.31125.', precio: 25000, imgSrc: "https://www.lg.com/us/images/tvs/50pk540/gallery/large01.jpg" },
        {nombreElemento: 'Combo cosmeticos AVON', descripcionElemento: 'Cosmeticos Avon Combo Completo Cremas:6 CREMAS AVON CARE DE 100 G:2 RESTAURADORAS DE PUNTA +1 ACEITE DE ARGAN PARA EL CABELLO+1 CREMA FOREVER 200ml', precio: 45000, imgSrc: "https://cdn.static.escuelamakeup.com/imagenes/de-que-estan-hechos-los-cosmeticos_905x603.jpg" },
        {nombreElemento: 'Aceite de girasol COCINERO X12', descripcionElemento: 'Pack x12 aceite cocinero venta al por mayor. Aceite de girasol de marca de primera linea a nivel sudamerica', precio: 5000, imgSrc: "https://jumboargentina.vtexassets.com/arquivos/ids/614663/Aceite-De-Girasol-Cocinero-900-Ml-1-32670.jpg?v=637409202878630000" },
        {nombreElemento: 'Pack escolar Lapices de colores + goma + sacapuntas', descripcionElemento: 'Pack para inicio de clases. 50 Lapices para colorear y de regalo un pack de goma y sacapuntas', precio: 2000, imgSrc: "https://http2.mlstatic.com/D_NQ_NP_968821-MLA31587799913_072019-O.jpg" }];
        for (const item of listado){ 
            let articulo = new Articulo(item.nombreElemento, item.descripcionElemento, item.precio, item.imgSrc);
            calculador.getCarritoCompras().agregarArticulo(articulo);
        }
    }
    cargarArticulosListado(){
        let articulos = calculador.getCarritoCompras().getArticulosSeleccionados();
        let listaCarrito = document.getElementById('listaCarrito');
        if (articulos.length > 0){
            for(const articulo of articulos){
                let elementoCarrito = document.createElement("div");
                elementoCarrito.setAttribute("class", "elementoCarrito");
                elementoCarrito.innerHTML = `
                <div class="containerImagen">
                    <img src="${articulo.imgSrc}" alt="">
                </div>
                <div class="containerTextosBoton">
                    <div class="containerTextos">
                        <div class="tituloPrecioCarrito">
                            <h4 class="nombreElemento">${articulo.nombreArticulo}</h4>
                            <h5 class="precioElemento">$${articulo.precio}</h5>
                            <p class="descripcionElemento" hidden>Pack para inicio de clases. 50 Lapices para colorear y de regalo un pack de goma y sacapuntas</p>
                        </div>
                    </div>
                    <div class="containerBotones">
                        <button type="button" class="btn btn-outline-dark botonEliminar" id="boton${articulo.id}">Quitar Articulo</button>
                    </div>
                </div>`
                let br = document.createElement("br");
                listaCarrito.append(elementoCarrito);
                listaCarrito.append(br.cloneNode(true));
            }
        }
        else{
            let elementoCarrito = document.createElement("div");
                elementoCarrito.setAttribute("class", "elementoCarrito");
                elementoCarrito.innerHTML = `
                <div class="containerImagen">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/GHS-pictogram-unknown.svg" alt="">
                </div>
                <div class="containerTextosBoton">
                    <div class="containerTextos">
                        <div class="tituloPrecioCarrito">
                            <h4 class="nombreElemento">No se selecciono ningun elemento</h4>
                            <h5 class="precioElemento"></h5>
                            <p class="descripcionElemento" hidden>Pack para inicio de clases. 50 Lapices para colorear y de regalo un pack de goma y sacapuntas</p>
                        </div>
                    </div>
                </div>`
                let br = document.createElement("br");
                listaCarrito.append(elementoCarrito);
                listaCarrito.append(br.cloneNode(true));
        }
        
        const botonesEliminar = document.querySelectorAll(".botonEliminar");
        botonesEliminar.forEach((btn) => {
            btn.onclick = () => {
                let id = btn.id.replace("boton","");
                interfaz.removerArticulo(parseInt(id));};
        });
    }
    cargarTicketArticulos(){
        const ticket = document.getElementById('listaRecibo');
        let listaElementos = document.createElement("div");
        listaElementos.setAttribute("id", "listaElementos");
        let subtotalTicket = document.createElement("div");
        subtotalTicket.setAttribute("id", "subtotalTicket");
        let totalTicket = document.createElement("div");
        totalTicket.setAttribute("id", "totalTicket");
        let hr = document.createElement("hr");
        ticket.append(listaElementos);
        ticket.append(hr);
        ticket.append(subtotalTicket);
        ticket.append(hr.cloneNode(true));
        ticket.append(totalTicket);
        if (calculador.getCarritoCompras().getArticulosSeleccionados().length > 0){
            listaElementos.innerHTML = "";
            for(const articulo of calculador.getCarritoCompras().getArticulosSeleccionados()){
                listaElementos.innerHTML += `<div class='containerElementosResumen'><div class='nombreElemento'>${articulo.nombreArticulo}</div><div class='precioElemento'>$${articulo.precio}</div></div>`;
            }
        }
        else{
            listaElementos.innerHTML = `<div class='containerElementosResumen'><div class='nombreElemento'>No hay items seleccionados</div><div class='precioElemento'>$0</div></div>`;
        }
        subtotalTicket.innerHTML += `<div class='containerElementosResumen'><div class='nombreElemento'>Sub-Total</div><div class='precioElemento'>$${this.calculador.costoSubTotal()}</div></div><div class='containerElementosResumen'><div class='nombreElemento'>Costo Servicio</div><div class='precioElemento'>$${this.calculador.costoServicios()}</div></div>`;
        totalTicket.innerHTML += `<div class='containerElementosResumen'><div class='nombreElemento'>TOTAL</div><div class='precioElemento'>$${this.calculador.costoTotal()}</div></div>`;
    }
    borrarArticulosListado(){
        const listaCarrito = document.getElementById('listaCarrito');
        listaCarrito.innerHTML = "";
    }
    borrarTicketArticulos(){
        const ticket = document.getElementById('listaRecibo');
        ticket.innerHTML = "";
    }
    recargarListadoArticulos(){
        this.borrarArticulosListado();
        this.cargarArticulosListado();
    }
    recargarTicketArticulos(){
        this.borrarTicketArticulos();
        this.cargarTicketArticulos();
    }
    removerArticulo(id){
        let articulos = calculador.getCarritoCompras().getArticulosSeleccionados();
        let articuloEliminar;
        for (const articulo of articulos){
            if(id == articulo.id){
                articuloEliminar = articulo;
            }
        }
        calculador.getCarritoCompras().removerArticulo(articuloEliminar);
        this.recargarTicketArticulos();
        this.recargarListadoArticulos();
        
    }
}

const carrito = new CarritoCompras();
const calculador = new Calculador(carrito);
const interfaz = new Interfaz(calculador);
interfaz.crearArticulos();
interfaz.cargarArticulosListado();
interfaz.cargarTicketArticulos();


console.log("El valor total fue divido en 12 cuotas de $" + calculador.calcularCuotas(12) + " cada una.");