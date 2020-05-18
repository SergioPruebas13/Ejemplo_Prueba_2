var idR,nombreR,precioR,descripcionR,imgR;
var Producto = [];


$(document).ready(function () {
    cargarDatos();
});

function cargarDatos(){
    $.ajax({
        url: "http://127.0.0.1:5500/Datos/datos.json"
    }).done(function(respuesta){
            
            for (let i = 0; i < respuesta.ProductosCatalogo.length; i++) {
                
                idR = respuesta.ProductosCatalogo[i].id;
                nombreR = respuesta.ProductosCatalogo[i].nombre;
                precioR = respuesta.ProductosCatalogo[i].precio;
                descripcionR = respuesta.ProductosCatalogo[i].descripcion;
                imgR = respuesta.ProductosCatalogo[i].img;
                
                var op = {idR,nombreR,precioR,descripcionR,imgR};

                Producto.push(op);
                console.log(Producto[i]);
            }
            Cargar_Productos();
    });
}

function Cargar_Productos(){

    for (let i = 0; i < Producto.length; i++) {
        
        var element_ = document.getElementById('Contenedor_Izq');

            element_.innerHTML += `
            <div class="card">
                <img src="${Producto[i].imgR}" alt="">
                <h3 id="h3_">${Producto[i].nombreR}</h3>
                <p>$ ${Producto[i].precioR}</p>
                <span><button class="Ver_Mas"> Ver mas</button>&nbsp&nbsp
                <button class="Ver_Mas"> Add Cart</button></span>
            </div>
            `;
        
    }

    $('#Contenedor_Izq').paginate({
        items_per_page: 3
    });
}