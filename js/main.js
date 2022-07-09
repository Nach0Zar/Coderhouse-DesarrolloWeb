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
class Articulo{
    static idCounter = 0;
    constructor(nombreArticulo, descripcion, precio, imgSrc, cantidad){
        this.id = Articulo.getIdCounter();
        Articulo.idCounter++;
        this.nombreArticulo = nombreArticulo;
        this.descripcion = descripcion;
        this.precio = parseInt(precio);
        this.imgSrc = imgSrc;
        this.cantidad = cantidad;
    }
    static getIdCounter(){
        return Articulo.idCounter;
    }
    sumarCantidad(){
        this.cantidad++;
    }
    restarCantidad(){
        if(this.cantidad!=1){
            this.cantidad--;
        }
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
        this.precioTotal += (articulo.precio*articulo.cantidad);
        sessionStorage.setItem('ListadoItems',JSON.stringify(this.articulosSeleccionados));
    }
    removerArticulo(articulo){
        this.precioTotal -= articulo.precio;
        this.articulosSeleccionados.splice(this.articulosSeleccionados.indexOf(articulo), 1);
        sessionStorage.setItem('ListadoItems',JSON.stringify(this.articulosSeleccionados));
    }
    recalcularPrecioTotal(){
        this.precioTotal = 0;
        for (let item of this.articulosSeleccionados){
            this.precioTotal += (item.precio*item.cantidad); 
        }
    }
    sumarCantidadArticulo(id){
        let articuloSumar;
        for (const articulo of this.articulosSeleccionados){
            if(id == articulo.id){
                articuloSumar = articulo;
            }
        }
        articuloSumar.sumarCantidad();
        this.recalcularPrecioTotal();
        sessionStorage.setItem('ListadoItems',JSON.stringify(this.articulosSeleccionados));
    }
    restarCantidadArticulo(id){
        let articuloRestar;
        for (const articulo of this.articulosSeleccionados){
            if(id == articulo.id){
                articuloRestar = articulo;
            }
        }
        articuloRestar.restarCantidad();
        this.recalcularPrecioTotal();
        sessionStorage.setItem('ListadoItems',JSON.stringify(this.articulosSeleccionados));
    }
}
class Calculador{
    constructor(){
        this.carritoCompras = new CarritoCompras();
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
    constructor(){
        this.calculador = new Calculador();
    }
    crearArticulos(listadoItems){
        //por ahora carga articulos de la lista hardcodeada desde un listado de objetos
        for (const item of listadoItems){ 
            let articulo = new Articulo(item.nombreArticulo, item.descripcion, item.precio, item.imgSrc,item.cantidad);
            this.calculador.getCarritoCompras().agregarArticulo(articulo);
        }
    }
    cargarArticulosListado(){
        let articulos = this.calculador.getCarritoCompras().getArticulosSeleccionados();
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
                        <div class="containerCantidad">
                            <div class="container">
                                <div class="input-group w-auto align-items-center">
                                    <input type="button" value="-" class="button-minus border rounded-circle  icon-shape icon-sm mx-1 botonRestar" id="boton${articulo.id}">
                                    <div class="cantidadElemento">${articulo.cantidad}</div>
                                    <input type="button" value="+" class="button-plus border rounded-circle icon-shape icon-sm botonAgregar" id="boton${articulo.id}">
                                </div>
                            </div>
                        </div>   
                        <div class="containerBotonEliminar">
                            <button type="button" class="btn btn-outline-dark botonEliminar" id="boton${articulo.id}">Quitar Articulo</button>
                        </div>
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
        const botonAgregar = document.querySelectorAll(".botonAgregar");
        botonAgregar.forEach((btn) => {
            btn.onclick = () => {
                let id = btn.id.replace("boton","");
                interfaz.agregarCantidadArticulo(parseInt(id));};
        });
        const botonRestar = document.querySelectorAll(".botonRestar");
        botonRestar.forEach((btn) => {
            btn.onclick = () => {
                let id = btn.id.replace("boton","");
                interfaz.restarCantidadArticulo(parseInt(id));};
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
        if (this.calculador.getCarritoCompras().getArticulosSeleccionados().length > 0){
            listaElementos.innerHTML = "";
            for(const articulo of this.calculador.getCarritoCompras().getArticulosSeleccionados()){
                listaElementos.innerHTML += `<div class='containerElementosResumen'><div class='nombreElementoTicket'>${articulo.nombreArticulo}</div><div class='precioMultiplicador'><div class='precioElementoTicket'>$${articulo.precio}</div><div class='precioElementoTicket'>X${articulo.cantidad}</div></div></div>`;
            }
        }
        else{
            listaElementos.innerHTML = `<div class='containerElementosResumen'><div class='nombreElementoTicket'>No hay items seleccionados</div><div class='precioElementoTicket'>$0</div></div></div>`;
        }
        subtotalTicket.innerHTML += `<div class='containerElementosResumen'><div class='nombreElementoTicket'>Sub-Total</div><div class='precioElementoTicket'>$${this.calculador.costoSubTotal()}</div></div><div class='containerElementosResumen'><div class='nombreElementoTicket'>Costo Servicio</div><div class='precioElementoTicket'>$${this.calculador.costoServicios()}</div></div>`;
        totalTicket.innerHTML += `<div class='containerElementosResumen'><div class='nombreElementoTicket'>TOTAL</div><div class='precioElementoTicket'>$${this.calculador.costoTotal()}</div></div>`;
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
        let articulos = this.calculador.getCarritoCompras().getArticulosSeleccionados();
        let articuloEliminar;
        for (const articulo of articulos){
            if(id == articulo.id){
                articuloEliminar = articulo;
            }
        }
        this.calculador.getCarritoCompras().removerArticulo(articuloEliminar);
        this.recargarTicketArticulos();
        this.recargarListadoArticulos();
        
    }
    agregarCantidadArticulo(id){
        let articulos = this.calculador.getCarritoCompras().getArticulosSeleccionados();
        let articuloSumar;
        for (const articulo of articulos){
            if(id == articulo.id){
                articuloSumar = articulo;
            }
        }
        this.calculador.getCarritoCompras().sumarCantidadArticulo(id);
        this.recargarTicketArticulos();
        this.recargarListadoArticulos();
    }
    restarCantidadArticulo(id){
        this.calculador.getCarritoCompras().restarCantidadArticulo(id);
        this.recargarTicketArticulos();
        this.recargarListadoArticulos();
    }
}
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
    interfaz = new Interfaz();
    interfaz.crearArticulos(listadoDefaultItems);
    sessionStorage.setItem('Interfaz',JSON.stringify(interfaz));
}
else{
    interfazStorage = JSON.parse(sessionStorage.getItem('Interfaz'));
    interfaz = new Interfaz (interfazStorage);
    let listadoItems = JSON.parse(sessionStorage.getItem('ListadoItems'));
    interfaz.crearArticulos(listadoItems);
}
interfaz.cargarArticulosListado();
interfaz.cargarTicketArticulos();
console.log("El valor total fue divido en 12 cuotas de $" + interfaz.calculador.calcularCuotas(12) + " cada una.");

