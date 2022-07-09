import {Articulo, InterfazCatalogo} from './clases.js';
//leo el json con el listado de articulos y lo asigno a la variable articulos para que sea el listado de objetos
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
let articulos;
readTextFile("../json/catalogo.json", function(texto){
    let articulosArchivo = JSON.parse(texto); //parse JSON
    sessionStorage.setItem('prueba',JSON.stringify(articulosArchivo.articulos));
});
articulos = JSON.parse(sessionStorage.getItem('prueba'));
let articulosObjetos = [];
//creacionObjetos
for(const articulo of articulos){
    const articuloObjeto = new Articulo (articulo.nombreArticulo, articulo.descripcion, articulo.precio, articulo.imgSrc, articulo.cantidad)
    articulosObjetos.push(articuloObjeto);
}
//creacion divs
let catalogo = document.getElementById('listaDeObjetos');
for(const articulo of articulosObjetos){
    let elemento = document.createElement("div");
    elemento.setAttribute("class", "elemento");
    elemento.innerHTML = `
    <div class="containerImagen">
        <img src="${articulo.imgSrc}" alt="">
    </div>
    <div class="containerTextosBoton">
        <div class="containerTextosElementos">
            <div class="tituloprecio">
                <h4 class="nombreElemento">${articulo.nombreArticulo}</h4>
                <h5 class="precioElemento">$${articulo.precio}</h5>
            </div>
            <p class="descripcionElemento">CARACTERÍTICAS GENERALES · Tamaño: 27“/68.6cm. Tipo de panel: TN · Color Gamut (CIE1931): 72%. Prof. de Color: 16.7M colores · Pixel pitch(mm): 0.31125 x 0.31125.</p>
        </div>
        <div class="containerBotonElemento">
            <button type="button" class="btn btn-outline-dark botonAgregar" id="boton${articulo.id}">Agregar Articulo</button>
        </div>
    </div>
    `
    let br = document.createElement("br");
    catalogo.append(elemento);
    catalogo.append(br.cloneNode(true));
}

let articulosAgregados = [];

const botonesAgregar = document.querySelectorAll(".botonAgregar");
    botonesAgregar.forEach((btn) => {
            btn.onclick = () => {
                let id = btn.id.replace("boton","");
                id=(parseInt(id));
                for (const articulo of articulosObjetos){
                    if(id == articulo.id){
                        let articuloAgregado = articulo;
                        articulosAgregados.push(articuloAgregado);
                        console.log(articulosAgregados);
                    }
                }
            };
                
        });
