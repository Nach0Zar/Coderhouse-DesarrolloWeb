export class Articulo{
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
export class CarritoCompras{
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
export class Calculador{
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
export class InterfazCarrito{
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
                this.removerArticulo(parseInt(id));};
        });
        const botonAgregar = document.querySelectorAll(".botonAgregar");
        botonAgregar.forEach((btn) => {
            btn.onclick = () => {
                let id = btn.id.replace("boton","");
                this.agregarCantidadArticulo(parseInt(id));};
        });
        const botonRestar = document.querySelectorAll(".botonRestar");
        botonRestar.forEach((btn) => {
            btn.onclick = () => {
                let id = btn.id.replace("boton","");
                this.restarCantidadArticulo(parseInt(id));};
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
export class InterfazCatalogo{
    constructor(){
        this.carritoCompras = new CarritoCompras();
    }
    cargarArticulosArchivo(){
        function readTextFile(file, callback) {
            let rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", file, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4 && rawFile.status == "200") {
                    callback(rawFile.responseText);
                }
            }
            rawFile.send(null);
        }
        readTextFile("../json/catalogo.json", function(texto){
            let articulosArchivo = JSON.parse(texto); //parse JSON
            sessionStorage.setItem('prueba',JSON.stringify(articulosArchivo.articulos));
        });
        return JSON.parse(sessionStorage.getItem('prueba'));
    }
}