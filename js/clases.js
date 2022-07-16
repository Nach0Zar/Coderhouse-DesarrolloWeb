export class Articulo{
    static idCounter = 0;
    constructor(nombreArticulo, descripcion, precio, imgSrc, cantidad, id){
        (id == 0) ? (this.id = Articulo.getIdCounter(),
            Articulo.idCounter++) : (this.id = id);
        
        this.nombreArticulo = nombreArticulo;
        this.descripcion = descripcion;
        this.precio = parseInt(precio);
        this.imgSrc = imgSrc;
        this.cantidad = cantidad;
        this.agregado = false;
    }
    static getIdCounter(){
        return Articulo.idCounter;
    }
    agregar(){
        this.agregado = true;
    }
    quitar(){
        this.agregado = false;
    }
    sumarCantidad(){
        this.cantidad++;
    }
    restarCantidad(){
        (this.cantidad!=1) && (this.cantidad--)
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
        articulo.agregar();
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
            (id == articulo.id)&& (articuloSumar = articulo);
        }
        articuloSumar.sumarCantidad();
        this.recalcularPrecioTotal();
        sessionStorage.setItem('ListadoItems',JSON.stringify(this.articulosSeleccionados));
    }
    restarCantidadArticulo(id){
        let articuloRestar;
        for (const articulo of this.articulosSeleccionados){
            (id == articulo.id) && (articuloRestar = articulo);
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
export class InterfazCarrito{
    constructor(){
        this.calculador = new Calculador();
    }
    crearArticulos(listadoItems){
        for (const item of listadoItems){
            let {id, nombreArticulo, descripcion, precio, imgSrc, cantidad} = item;
            let articulo = new Articulo(nombreArticulo, descripcion, precio, imgSrc, cantidad, id);
            this.calculador.getCarritoCompras().agregarArticulo(articulo);
        }
    }
    cargarArticulosListado(){
        let articulos = this.calculador.getCarritoCompras().getArticulosSeleccionados();
        let listaCarrito = document.getElementById('listaCarrito');
        if (articulos.length > 0){
            for(const articulo of articulos){
                let {id, nombreArticulo, precio, imgSrc, cantidad} = articulo;
                let elementoCarrito = document.createElement("div");
                elementoCarrito.setAttribute("class", "elementoCarrito");
                elementoCarrito.innerHTML = `
                <div class="containerImagen">
                    <img src="${imgSrc}" alt="">
                </div>
                <div class="containerTextosBotonCarrito">
                    <div class="containerTextos">
                        <div class="tituloPrecioCarrito">
                            <h4 class="nombreElemento">${nombreArticulo}</h4>
                            <h5 class="precioElemento">$${precio}</h5>
                        </div>
                    </div>
                    <div class="containerBotones">
                        <div class="containerCantidad">
                            <div class="containerCantidadBotones">
                                <div class="input-group w-auto align-items-center">
                                    <input type="button" value="-" class="botonRestar" id="boton${id}">
                                    <div class="cantidadElemento">${cantidad}</div>
                                    <input type="button" value="+" class="botonAgregar" id="boton${id}">
                                </div>
                            </div>
                        </div>   
                        <div class="containerBotonEliminar">
                            <div class="containerBoton">
                                <button type="button" class="btn btn-outline-dark botonEliminar" id="boton${id}">Quitar Articulo</button>
                            </div>
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
                            <p class="descripcionElemento" hidden></p>
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
                let {nombreArticulo, precio, cantidad} = articulo;
                listaElementos.innerHTML += `<div class='containerElementosResumen'><div class='nombreElementoTicket'>${nombreArticulo}</div><div class='precioMultiplicador'><div class='precioElementoTicket'>$${precio}</div><div class='precioElementoTicket'>X${cantidad}</div></div></div>`;
            }
        }
        else{
            listaElementos.innerHTML = `<div class='containerElementosResumen'><div class='nombreElementoTicket'>No hay items seleccionados</div><div class='precioElementoTicket'>$0</div></div></div>`;
        }
        subtotalTicket.innerHTML += `
        <div class='containerElementosResumen'>
            <div class='nombreElementoTicket'>Sub-Total</div>
            <div class='precioElementoTicket'>$${this.calculador.costoSubTotal()}</div>
        </div>
        <div class='containerElementosResumen'>
            <div class='nombreElementoTicket'>
                <div class='nombreElementoTicket'>Costo Servicio</div>
                <div id="infoicon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                </div>
                <div id="info">Por cada articulo agregado al carrito se sumará un importe de $750. No se sumará por cantidad del mismo artículo.</div>
            </div>
            <div class='precioElementoTicket'>$${this.calculador.costoServicios()}</div>
        </div>`;
        totalTicket.innerHTML += `<div class='containerElementosResumen'><div class='nombreElementoTicket'>TOTAL</div><div class='precioElementoTicket'>$${this.calculador.costoTotal()}</div></div>`;
        let estilo;
        (this.calculador.getCarritoCompras().getArticulosSeleccionados().length > 0) ? estilo = "btn-outline-dark" : estilo = "btn-secondary disabled";
        let containerBoton = document.getElementById('containerBotonCompra');
        containerBoton.innerHTML = 
        `<div class="containerBoton">                        
            <button type="button" class="btn ${estilo}" id="botonCompra">Realizar compra</button>
        </div>
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">Realizar compra</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form class="form-horizontal" role="form" method="POST" action="">
                        <div class="modal-body centered">
                            <p>¿Estas a punto de finalizar tu compra, estás seguro de querer hacerlo?
                            <p>Confirmar que su información de contacto es la correcta. De no ser asi, modificarla desde su perfil.
                                <div class="form-group">
                                    <div class="input-group mb-1">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1">@</span>
                                        </div>
                                    <input type="text" class="form-control" placeholder="Nombre de Usuario" name="username" default="username" readonly="readonly" default="nach0zar">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group mb-1">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1">Mail de contacto</span>
                                        </div>
                                    <input type="email" class="form-control" placeholder="Mail del usuario" name="email" default="email" readonly="readonly" default="ignaciozarlenga@hotmail.com">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group mb-1">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1">Nombre</span>
                                        </div>
                                    <input type="text" class="form-control" placeholder="Nombre del usuario" name="nombre" default="nombre" readonly="readonly" default="Ignacio">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1">Apellido</span>
                                        </div>
                                    <input type="text" class="form-control" placeholder="Apellido del usuario" name="apellido" default="apellido" readonly="readonly" default="Zarlenga">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group mb-1">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1">Tarjeta del usuario</span>
                                        </div>
                                    <input type="number" class="form-control" maxlength="16" oninput="this.value=this.value.slice(0,this.maxLength)" placeholder="XXXXXXXXXXXXXXXX" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group mb-1">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1">Fecha de Vto.</span>
                                        </div>
                                        <input type="month" class="form-control" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1">Codigo de seguridad</span>
                                        </div>
                                        <input type="number" maxlength="4" oninput="this.value=this.value.slice(0,this.maxLength)" class="form-control" placeholder="XXXX" required>
                                    </div>
                                </div>
                                <div class="form-group mb-3">
                                    <div class="input-group mb-1">
                                        <div class="input-group-text">
                                            <input class="form-check-input mt-0" type="radio" name="cuotas" aria-label="Radio button for following text input" value="1" checked="checked">
                                        </div>
                                        <input type="text" class="form-control" aria-label="Text input with radio button" placeholder="1 Cuota sin interés" readonly="readonly" disabled >
                                    </div>
                                    <div class="input-group mb-1">
                                        <div class="input-group-text">
                                            <input class="form-check-input mt-0" type="radio" name="cuotas" aria-label="Radio button for following text input" value="3">
                                        </div>
                                        <input type="text" class="form-control" aria-label="Text input with radio button" placeholder="3 Cuotas sin interés" readonly="readonly" disabled >
                                    </div>
                                    
                                    <div class="input-group mb-1">
                                        <div class="input-group-text">
                                            <input class="form-check-input mt-0" type="radio" name="cuotas" aria-label="Radio button for following text input" value="6">
                                        </div>
                                        <input type="text" class="form-control" aria-label="Text input with radio button" placeholder="6 Cuotas sin interés" readonly="readonly" disabled >
                                    </div>
                                    <div class="input-group">
                                        <div class="input-group-text">
                                            <input class="form-check-input mt-0" type="radio" name="cuotas" aria-label="Radio button for following text input" value="12">
                                        </div>
                                        <input type="text" class="form-control" aria-label="Text input with radio button" placeholder="12 Cuotas sin interés" readonly="readonly" disabled >
                                    </div>
                                </div>
                            <p>El monto a pagar por los servicios totales es de <strong>$${this.calculador.costoTotal()}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar Compra</button>
                            <button type="submit" class="btn btn-outline-secondary" name="comprar" id="realizarCompra" value="Submit">Realizar Compra</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>`
        let modalElemento = new bootstrap.Modal(document.querySelector(".modal"));
        const botonComprar = document.querySelectorAll("#botonCompra");
        botonComprar.forEach((btn) => {
            btn.onclick = () => {
                modalElemento.show();
            };
        });
        //por ahora va de 1 en 1 hasta ver la siguiente clase para poder tomar posts
        let exampleForm =  document.querySelector('form');
        exampleForm.addEventListener('submit', event => {
        event.preventDefault();
        let inputElements = exampleForm.querySelectorAll("input");
        let cuotas;
        inputElements.forEach(function(input) {
            if(input.name == "cuotas" && input.checked){
                cuotas = input.value;
                console.log(input.type +" "+ input.value);
            }
            else{
                if(!(input.disabled || input.type == "radio")){
                    console.log(input.type +" "+ input.value);
                }
            }
        });
        alert("El valor total fue divido en "+ cuotas + " cuotas de $" + this.calculador.calcularCuotas(parseInt(cuotas)) + " cada una, ya que el valor total es de $" + this.calculador.costoTotal());
    });
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
            (id == articulo.id) && (articuloEliminar = articulo);
        }
        this.calculador.getCarritoCompras().removerArticulo(articuloEliminar);
        articuloEliminar.quitar();
        this.recargarTicketArticulos();
        this.recargarListadoArticulos();
        
    }
    agregarCantidadArticulo(id){
        let articulos = this.calculador.getCarritoCompras().getArticulosSeleccionados();
        let articuloSumar;
        for (const articulo of articulos){
        (id == articulo.id)&& (articuloSumar = articulo);
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
        this.articulos = [];
        this.cargarArticulosArchivo();
    }
    //leo el json con el listado de articulos, los creo como objetos Articulo y los agrego al listado
    cargarArticulosArchivo(){
        const crearArticulos = () => {
            for(const articulo of JSON.parse(sessionStorage.getItem('json'))){
                let {nombreArticulo, descripcion ,precio, imgSrc} = articulo;
                const articuloObjeto = new Articulo (nombreArticulo, descripcion, precio, imgSrc, 1, 0)
                this.articulos.push(articuloObjeto);
            }
        }
        const cargarData = async () => {
            const fetchData = await fetch('../json/catalogo.json').then((respuesta) => respuesta.json()).then((json) => {
                sessionStorage.setItem('json',JSON.stringify(json.articulos))
            })
            crearArticulos();
            if (!(sessionStorage.getItem('ListadoItems')==null || sessionStorage.getItem('ListadoItems')=="[]")){
                let articulosAgregados;
                articulosAgregados = JSON.parse(sessionStorage.getItem('ListadoItems'));
                this.cargarArticulosAgregados(articulosAgregados);
            }
            this.cargarArticulosListado();
        };
        cargarData();
        
    }
    cargarArticulosAgregados(articulosAgregados){
        for(let articuloCambiar of articulosAgregados){
            let id = articuloCambiar.id;
            id = (parseInt(id));
            for (const articulo of this.articulos){
                id == articulo.id && (this.carritoCompras.agregarArticulo(articulo))
            }
        }
        
    }
    cargarArticulosListado(){
        let catalogo = document.getElementById('listaDeObjetos');
        for(const articulo of this.articulos){
            let elemento = document.createElement("div");
            elemento.setAttribute("class", "elemento");
            let texto, estilo;
            (!articulo.agregado) ? (texto = "Agregar Articulo", estilo = "btn-outline-dark") : (texto = "Articulo Añadido", estilo = "btn-dark");
            let {id, nombreArticulo, descripcion ,precio, imgSrc} = articulo;
            elemento.innerHTML = `
                <div class="containerImagen">
                    <img src="${imgSrc}" alt="">
                </div>
                <div class="containerTextosBoton">
                    <div class="containerTextosElementos">
                        <div class="tituloprecio">
                            <h4 class="nombreElemento">${nombreArticulo}</h4>
                            <h5 class="precioElemento">$${precio}</h5>
                        </div>
                        <p class="descripcionElemento">${descripcion}</p>
                    </div>
                    <div class="containerBotonElemento">
                        <button type="button" class="btn ${estilo} botonAgregarCarrito" id="boton${id}">${texto}</button>
                    </div>
                </div>`
            let br = document.createElement("br");
            catalogo.append(elemento);
            catalogo.append(br.cloneNode(true));
            
        }
        let botonesAgregar = document.querySelectorAll(".botonAgregarCarrito");
        botonesAgregar.forEach((btn) => {
            btn.onclick = () => {
                if(btn.innerHTML==`Agregar Articulo`){
                    let id = btn.id.replace("boton","");
                    id=(parseInt(id));
                    for (const articulo of this.articulos){
                        (id == articulo.id) && (this.carritoCompras.agregarArticulo(articulo),Toastify({
                            text: "Agregaste el articulo \n" + articulo.nombreArticulo + "\n a tu carrito!",
                            duration: 3000,
                            style: {
                                background: "linear-gradient(0deg, rgba(61,42,138,1) 0%, rgba(172,34,195,1) 70%)",
                              },
                        }).showToast());
                    }
                    btn.innerHTML = `Articulo Añadido`;
                    btn.classList.remove("btn-outline-dark");
                    btn.setAttribute("class", "btn btn-dark");
                    
                }
            };            
        });
    }
}