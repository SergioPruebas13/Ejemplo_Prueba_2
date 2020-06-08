$(document).ready(main);

//----------------------------------------Variables de [1]
var idR,nombreR,precioR,descripcionR,imgR,stockR;
var Producto = [];
var Productos_Global =[];

//----------------------------------------Variables de [2]
var id_modal;
//Añadir un Objeto de atributo
const addAttributes = (element, attrObj) => {
	for(let attr in attrObj){
		if (attrObj.hasOwnProperty(attr)) element.setAttribute(attr,attrObj[attr])
	}
};
 // Crear Elementos con Atributos e Hijo
const createCustomElement = (element,attributes,children) => {
	let customElement = document.createElement(element);
	if (children !== undefined) children.forEach(el => {
			if (el.nodeType) {
					if (el.nodeType === 1 || el.nodeType === 11)
						customElement.appendChild(el);
				}else{
						customElement.innerHTML += el;
				}
	});
		addAttributes(customElement,attributes);
		return customElement;
};
// Inprimiendo Modal 
const printModal = content =>{
	//Crear COntenedor interno
	const modalContentEl = createCustomElement('div', {
		id: 'ed-modal-content',
		class: 'ed-modal-content'
	}, [content]);
	//crear contenedor principal
	 const modalContainerEl = createCustomElement('div',{
		id: 'ed-modal-container',
		class: 'ed-modal-container'
	},[modalContentEl]);

	 //Imprimir el modal
	 document.body.appendChild(modalContainerEl);
	 //Remover modal
	 const removeModal = () => document.body.removeChild(modalContainerEl);

	 modalContainerEl.addEventListener('click',e =>{
		 if(e.target === modalContainerEl) removeModal();
	 })
}

//-----------------------------------------Varibles [3]
var check_Cart = 0;
//-----------------------------------------variables para cantidad de total
var cant_produ_LS = [];


// ---------------------------------------------------Inicio del Java Script
function main () {
    //-----------------Llamada a la Funcion Cargar datos [1]
    cargarDatos();
    //----------------Cargar datos guardados en Local Storage
    CargarDatosLS();
     

    //-----------------Llamada a la Funcion Click para mostrar modal [2]
    $('body').on('click', '.Ver_Mas', function(){
        id_modal = $(this).attr('id');
        mostarModal();
    }) 

    //-----------------Llamada a la Funcion Click para añadir Producto a Carrito [4]
    $('body').on('click', '.Add_Cart', function(){
        id_modal = $(this).attr('id');
        GuardarDatosLS(id_modal);
        Total();
        ColorCarritos();
    }) 

    //-------------------Llamada a la funcion de Mostrar carrito [3]
    $('body').on('click', '#Butt_Cart', function(){
        if (check_Cart==0) {
            $('.container').addClass('Active');
            check_Cart=1;
        }
        else{
            $('.container').removeClass('Active');
            check_Cart=0;
        }  
        Total();     
    })

    //---------------------Llamada a la funcion de Calculat Total 
    $('body').on('click','.Canti',function(){
        id_product = $(this).attr('id');
        only_Id_Product = id_product.split(`cantidad_total`).join("");
        only_Cant_Product = document.getElementById(id_product).value;
        cargarCantidadProducLS((only_Id_Product*1),(only_Cant_Product*1));
        Total();
    })

    //---------------------Llamada a la funcion de Solicitar Producto_Button
    $('body').on('click','.Button_Solicitar',function(){
        modalSolicitud();
    });

    // --------------------Solicitud de Envio
    $('body').on('click','.email_solic',function(){
        validaciones();
    });

    // ---------------------Llamada a la Funcion de Filtro de Productos 
    $('body').on('click','#Filtro_Buscar',function(){
        CargarFiltroProducto();
    });
    
    
}

//----------------------Cargar Productos [1]
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
                stockR = respuesta.ProductosCatalogo[i].stock;
                
                var op = {idR,nombreR,precioR,descripcionR,imgR,stockR};

                Producto.push(op);
               // console.log(Producto[i]);
            }
            Cargar_Productos(Producto);
            // ---------------Cargar ComboBox de Productos
            CargarComboBox();
    });
            Producto = Productos_Global;
}
// ---------------------Mostrar Productos Y paginacion [1]
function Cargar_Productos(_Producto){
    var valor;
    for (let i = 0; i < _Producto.length; i++) {
        
        var element_ = document.getElementById('Contenedor_Izq');
        valor = new Intl.NumberFormat().format(_Producto[i].precioR*1);
            element_.innerHTML += `
            <div class="card">
                <img src="${_Producto[i].imgR}" alt="">
                <h3>${_Producto[i].nombreR}</h3>
                <p>$ ${valor}</p>
                <span><button class="Ver_Mas" id="${_Producto[i].idR}"> Ver mas</button>&nbsp&nbsp
                <button class="Add_Cart" id="${_Producto[i].idR}"> Add Cart</button></span>
            </div>
            `;
        
    }

    $('#Contenedor_Izq').paginate({
        items_per_page: 6
    });
}
// --------------------- Cargar ComboBox de Productos
function CargarComboBox(){
    var newArray = removeDuplicates(Producto, "nombreR");
    var bandera = 0;
            var selector = document.querySelector('#filtro_1');
            for (let i = 0; i < (newArray.length+1); i++) {

                if (bandera==0) {
                    selector.options[i] = new Option(`Todos`);
                    bandera=1;                     
                }else{
                    selector.options[i] = new Option(`${newArray[i-1].nombreR}`);
                }  
                            
            }
} 
// ----------------------Cargar Productos Por filtro
function CargarFiltroProducto(){
    var num_filtro = 0;
    var filtroArray = [];
    var selec = document.querySelector('#filtro_1');
    var body_Productos = document.querySelector('#Contenedor_Izq');

            for (let i = 0; i < Productos_Global.length; i++) {
                if (selec.value == Productos_Global[i].nombreR ) {
                    filtroArray[num_filtro] =  Productos_Global[i];
                    num_filtro++;
                }
            }
            if (selec.value == 'Todos') {
                  filtroArray = Productos_Global;  
            }
         body_Productos.innerHTML = "";
         Cargar_Productos(filtroArray);
        // console.log(filtroArray)
}
// ---------------------Mostrar Modal con los datos del Producto [2]
function mostarModal(){

    for (let i = 0; i < Producto.length; i++) {
        if (Producto[i].idR == id_modal) {
            var card = ` <div class="card_">
                            <img src="${Producto[i].imgR}" alt="">
                            <h3>${Producto[i].nombreR}</h3>
                            <p>$ ${Producto[i].precioR}</p>
                        </div>`;
            var Descrpcion = `  <div class="Descricion">
                                    <div class="solo_Descripcion">
                                        <h3>Descripcion.</h3>
                                        <p>${Producto[i].descripcionR}</p>
                                    </div>
                                </div>`;

            var hh = `${card}
                      ${Descrpcion}`;
            printModal(hh);
        }    
    }

}
//-----------------------Guardar Datos del Carrito de Compras en el LS [4]
function GuardarDatosLS(id_del_producto){
    var productos_Carro;
    
    for (let i = 0; i < Producto.length; i++) {
        if (Producto[i].idR == id_modal) {
            id_global = Producto[i].idR;
            productos_Carro = {
                id: Producto[i].idR,
                img: Producto[i].imgR,
                referencia: Producto[i].nombreR,
                precio: Producto[i].precioR,
                stock: Producto[i].stockR,
                cantidad: 1,
            }
        }    
    }
    if (localStorage.getItem('product_cart') === null) {
        let product_cart = [];
        product_cart.push(productos_Carro);
        localStorage.setItem('product_cart', JSON.stringify(product_cart));
            CargarDatosLS();
    }else{
        let product_cart = JSON.parse(localStorage.getItem('product_cart'));
        var verificar = buscarRepetido(id_del_producto);

        // console.log(verificar)
        if (verificar == 0) {
            product_cart.push(productos_Carro);
            localStorage.setItem('product_cart', JSON.stringify(product_cart));
            CargarDatosLS();
        }   
    }
} 

//-----------------------Cargar Datos del Carrito de Compras en el LS [4]
function CargarDatosLS(){
    
    var product_cart = JSON.parse(localStorage.getItem('product_cart'));
    let View_Carrito_Compras = document.getElementById('Scroll_Container');
    var valor;

    if (product_cart==null) {
        
    }else{
        View_Carrito_Compras.innerHTML = "";
        for (let i = 0; i < product_cart.length; i++) {
            valor = new Intl.NumberFormat().format(product_cart[i].precio*1);
            View_Carrito_Compras.innerHTML += `
            <div class="producto">
                    <div class="img">
                        <img src="${product_cart[i].img}" >
                    </div>
                    <div class="descrip">
                        <div class="desc_2">
                            <h4>${product_cart[i].referencia}</h4>
                            <h4>$ ${valor}</h4>
                        </div> 
                        <div class="cantidad">
                            <input type="number" class="Canti"  max="${product_cart[i].stock}" min="1" value="${product_cart[i].cantidad}" id="cantidad_total${product_cart[i].id}">
                        </div>                  
                    </div>
                    <div class="close">
                        <button class="Detele" onclick="EliminarDatos(${product_cart[i].id})">X</button>
                    </div>
            </div>
            <hr>
            `;
        }
    }  
}

//-----------------------Eliminar tareas de Carrito de compras 
function EliminarDatos(id){
    
    var product_cart = JSON.parse(localStorage.getItem('product_cart'));

    for (let i = 0; i < product_cart.length; i++) {
        if (product_cart[i].id == id) {
            product_cart.splice(i,1);
        }
    }
    localStorage.setItem('product_cart',JSON.stringify(product_cart));
    CargarDatosLS();
    Total();
    ColorCarritos();
}
//------------------------Funcion para Buscar si hay productos repetidos 
function  buscarRepetido(id_del_producto){
    var bol = 0;
    var dos = id_del_producto*1;
    let product_cart = JSON.parse(localStorage.getItem('product_cart'));

    for (let i = 0; i < product_cart.length; i++) {
        var uno = product_cart[i].id*1;
        
        if (uno == dos) {
            // console.log('No haga nada')
            bol=1;
        }else{
            // console.log('Ingrese Nuevo Producto')
        }
    }

    return bol;
}

//-------------------------Funcion para cargar cantidad de Productos en LS
function cargarCantidadProducLS(idProd,cantidadProd){

    var product_cart = JSON.parse(localStorage.getItem('product_cart'));

    if (product_cart==null) {
        
    }else{
        for (let i = 0; i < product_cart.length; i++) {
            if (product_cart[i].id==idProd) {
                product_cart[i].cantidad = cantidadProd;
            }
        }
    } 
    localStorage.setItem('product_cart', JSON.stringify(product_cart));
}
//-------------------------Funcion patra Evaluar el total
function Total(){
    var total=0;
    var total_cart = document.getElementById('total_cart');

    var product_cart = JSON.parse(localStorage.getItem('product_cart'));

    if (product_cart==null) {
        
    }else{
        for (let i = 0; i < product_cart.length; i++) {
               total = total + ((product_cart[i].cantidad)*product_cart[i].precio);
        }
    }  
    // console.log(total);
    total_cart.innerHTML = new Intl.NumberFormat().format(total);
}
//--------------------------Cambiar Color Carrito
function ColorCarritos(){

    var product_cart = JSON.parse(localStorage.getItem('product_cart'));
    var notify = document.getElementById('notify_');
    console.log("numero de productos: ",product_cart.length)

        if (product_cart.length < 1) {
            $('.notify').removeClass('Activate_Notify');
            $('.Button_Cart').removeClass('Button_Activate');
             notify.innerHTML = "";
        }else{
            $('.notify').addClass('Activate_Notify');
            $('.Button_Cart').addClass('Button_Activate');
            if (product_cart.length>0) {
                notify.innerHTML = `${product_cart.length}`;
            }
            
        }

}

//--------------------------Modal Para la Solicitud de Compra 
function modalSolicitud(){
            var product_cart = JSON.parse(localStorage.getItem('product_cart'));
            var Scroll_Productos = "";
            var total_factura = 0;
            if (product_cart==null) {  
            }else{
                for (let i = 0; i < product_cart.length; i++) {
                    var preci = (product_cart[i].precio)*(product_cart[i].cantidad);
                    total_factura += preci;
                    Scroll_Productos += `
                                <p>    
                                    <pre>Producto:   ${i+1} </pre>
                                    <pre>Nombre:     ${product_cart[i].referencia}</pre>
                                    <pre>Cantidad:   ${product_cart[i].cantidad} </pre>
                                    <pre>Precio:     $ ${new Intl.NumberFormat().format(preci)} </pre>
                                </p>
                                <hr>`;
                }
            } 
            total_factura += 4000;
            
            var Productos = `<div class="productos">
                                <div class="title_producto">
                                    <span>Productos</span>
                                </div>
                                <div class="scroll">
                                    <div class="product_scr">
                                        ${Scroll_Productos}
                                    </div>
                                </div>
                                <div class="precio">
                                <p>
                                    <span>Domicilio: $ 4.000</span><br>
                                    <span>Total: $ ${new Intl.NumberFormat().format(total_factura)}</span>
                                </p>
                                </div>
                            </div> `;
            var Datos_personales = ` <div class="datos_per">
                                        <div class="title_Datos_personales">
                                            <span>Datos Personales </span>
                                        </div>
                                        <div class="info">
                                            <div class="data">
                                                <label for="" name="datos_nombre">Nombre: <span class="text-danger" id="errorNombre"></span></label>
                                                <input type="text" id="datos_nombre" placeholder="Nombre" onkeypress="return soloLetras(event)">
                                            </div>
                                            <div class="data">
                                                <label for="">Correo: <span class="text-danger" id="errorCorreo"></span></label>
                                                <input type="email" id="datos_email" placeholder="Correo">
                                            </div>
                                            <div class="data">
                                                <label for="">Telefono: <span class="text-danger" id="errorTelefono"></span></label>
                                                <input type="text" id="datos_telefono" placeholder="Telefono" onkeypress="return soloNumeros(event)">
                                            </div>
                                            <div class="data">
                                                <label for="">Direccion: <span class="text-danger" id="errorDireccion"></span></label>
                                                <input type="text" id="datos_direccion" placeholder="Direccio">
                                            </div>
                                            <div class="data">
                                                <label for="">Barrio: <span class="text-danger" id="errorBarrio"></span></label>
                                               
                                                <input type="text" id="datos_barrio" placeholder="Barrio">
                                            </div>
                                            <div class="data">
                                            <label for="">Comentario:</label>
                                           <textarea name="" id="datos_comentarios" class="text_are" cols="28" rows="7" placeholder="Comentarios"></textarea>
                                        </div>
                                        </div>
                                        <div class="Solicitar_">
                                            <button class="what_solic">Solicitar&nbsp;&nbsp;<i class="fab fa-whatsapp 7x"></i></button>
                                            <button class="email_solic">Solicitar&nbsp;&nbsp;<i class="far fa-envelope"></i></button>
                                        </div>
                                    </div> `;

            var Container = `<div class="container_solicitud">
                                ${Productos}
                                ${Datos_personales}
                            </div>`;
            printModal(Container);

}

function validaciones(){
    let Error = true;
    var num_error = 0;
    var expresion = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    var nombre = document.getElementById('datos_nombre').value;
    var correo = document.getElementById('datos_email').value;
    var telefono = document.getElementById('datos_telefono').value;
    var direccio = document.getElementById('datos_direccion').value;
    var barrio = document.getElementById('datos_barrio').value; 
    var comentarios = document.getElementById('datos_comentarios').value;


    Limpiar_Errores();

    if(nombre==="") {//Validacion de Nombre
        document.getElementById("errorNombre").innerHTML= "*";
            var error_s = "ERROR, El campo Nombre no Puede estar Vacio";
            mostrarError(error_s,num_error);
            num_error=1;
            Error = false;
      }else {
        if(nombre.length > 35) {
          document.getElementById("errorNombre").innerHTML= "*";
            var error_s = "ERROR, El campo Nombre no puede superar los 35 Caracteres";
            mostrarError(error_s,num_error);
            num_error=1;
          Error = false;
        } 
    } 

    if (correo === ""){// validacion Email
        document.getElementById("errorCorreo").innerHTML= "*";
            var error_s = "ERROR, El campo Correo no Puede estar Vacio";
            mostrarError(error_s,num_error);
            num_error=1;
        Error = false;
          }else{
            if (!expresion.test(correo)){
              document.getElementById("errorCorreo").innerHTML= "*";
                 var error_s = "ERROR, El campo Correo es Incorrecto";
                mostrarError(error_s,num_error);
                num_error=1;
              Error = false;
            }
      }

    if(telefono==="") {//Validacion de Telefono
        document.getElementById("errorTelefono").innerHTML= "*";
            var error_s = "ERROR, El campo Telefono no Puede estar Vacio";
            mostrarError(error_s,num_error);
            num_error=1;
          Error = false;
      }else {
        if(telefono.length > 10 || telefono.length <10) {
          document.getElementById("errorTelefono").innerHTML= "*";
             var error_s = "ERROR, El campo Telefono Tiene que ser 10 Numeros";
            mostrarError(error_s,num_error);
            num_error=1;
          Error = false;
        } 
    } 

    if(direccio==="") {//Validacion de Direccio
        document.getElementById("errorDireccion").innerHTML= "*";
            var error_s = "ERROR, El campo Dirección no Puede estar Vacio";
            mostrarError(error_s,num_error);
            num_error=1;
          Error = false;
    } 

    if(barrio==="") {//Validacion de Bariio
        document.getElementById("errorBarrio").innerHTML= "*";
            var error_s = "ERROR, El campo Barrio no Puede estar Vacio";
            mostrarError(error_s,num_error);
            num_error=1;
          Error = false;
    } 

    var datos_personales = `<p> Nombre: ${nombre}<br>
                                Correo: ${correo}<br>
                                Telefono: ${telefono}<br>
                                Dirección: ${direccio}<br>
                                Barrio: ${barrio}<br>
                                Comentarios: ${comentarios}
                                </p>`;

    if (Error==true) {
        sendEmail(datos_personales);
    }

    
}

function sendEmail(datos_personales){// Envio de Datos por Email
    emailjs.init("user_mDl5w2iG2NaF7v5gKv3OR");
    let View_Carrito_Compras = document.getElementById('Scroll_Container');
    var notify = document.getElementById('notify_');
    var product_cart = JSON.parse(localStorage.getItem('product_cart'));
    var Scroll_Productos = "";
    var total_factura = 0;
    if (product_cart==null) {  
    }else{
        for (let i = 0; i < product_cart.length; i++) {
            var preci = (product_cart[i].precio)*(product_cart[i].cantidad);
            total_factura += preci;
            Scroll_Productos += `
                        <p>    
                            <pre>Producto:   ${i+1} </pre>
                            <pre>Nombre:     ${product_cart[i].referencia}</pre>
                            <pre>Cantidad:   ${product_cart[i].cantidad} </pre>
                            <pre>Precio:     $ ${new Intl.NumberFormat().format(preci)} </pre>
                        </p>
                        <hr>`;
        }
    } 
    total_factura += 4000;

    var message_html_ = `
                        ${datos_personales} 
                        ${Scroll_Productos}  
                        <p> Domicilio: $ 4.000 <br>
                            Total: ${new Intl.NumberFormat().format(total_factura)}
                        </p>`;


    var template_params = {
        "reply_to": "",
        "from_name": "Sergio Ivan Martinez Pulido",
        "to_name": "Jorgue Envios",
        "message_html": message_html_
        }

    var service_id = "default_service";
    var template_id = "template_aZ5pbQQ0";
    // emailjs.send(service_id, template_id, template_params);
    alert('Mensaje Enviado Correctamente')
    localStorage.removeItem('product_cart');
    // View_Carrito_Compras.innerHTML = "";
    // Total();
    // $('.notify').removeClass('Activate_Notify');
    // $('.Button_Cart').removeClass('Button_Activate');
    // notify.innerHTML = "";
    location.reload();
    
}

function soloLetras(e) {//validacion Solo Letras 
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    especiales = [8, 37, 39, 46];
  
    tecla_especial = false
    for(var i in especiales) {
        if(key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }
  
    if(letras.indexOf(tecla) == -1 && !tecla_especial)
        return false;
}

  function soloNumeros(e) {//validacion Solo numeros 
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    numeros = " 0123456789";
    especiales = [8];
  
    tecla_especial = false
    for(var i in especiales) {
        if(key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }
  
    if(numeros.indexOf(tecla) == -1 && !tecla_especial)
        return false;
}

  function Limpiar_Errores(){// limpiar Errorres de Formulario
    var errores = document.getElementsByClassName("text-danger");
    for (var i = 0; i < errores.length; i++) {
        errores[i].innerHTML = "";        
    }
}

function mostrarError(error,num){// mosstrar el error personalisado
    if (num==0) {
        alert(error);
    }
}

function removeDuplicates(originalArray, prop) {//Eliminar Duplicados de JSON
    var newArray = [];
    var lookupObject  = {};
    
    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}

