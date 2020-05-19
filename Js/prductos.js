$(document).ready(main);

//----------------------------------------Variables de [1]
var idR,nombreR,precioR,descripcionR,imgR;
var Producto = [];

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


// ---------------------------------------------------Inicio del Java Script
function main () {
    //-----------------Llamada a la Funcion Cargar datos [1]
    cargarDatos();

    //-----------------Llamada a la Funcion Click para mostrar modal [2]
    $('body').on('click', '.Ver_Mas', function(){
        id_modal = $(this).attr('id');
        mostarModal();
    }) 
}

//----------------------Cargar Productos [1]
function cargarDatos(){
    $.ajax({
        url: "https://sergiopruebas13.github.io/Ejemplo_Prueba_2/Datos/datos.json"
    }).done(function(respuesta){
            
            for (let i = 0; i < respuesta.ProductosCatalogo.length; i++) {
                
                idR = respuesta.ProductosCatalogo[i].id;
                nombreR = respuesta.ProductosCatalogo[i].nombre;
                precioR = respuesta.ProductosCatalogo[i].precio;
                descripcionR = respuesta.ProductosCatalogo[i].descripcion;
                imgR = respuesta.ProductosCatalogo[i].img;
                
                var op = {idR,nombreR,precioR,descripcionR,imgR};

                Producto.push(op);
               // console.log(Producto[i]);
            }
            Cargar_Productos();
    });
}
// ---------------------Mostrar Productos Y paginacion [1]
function Cargar_Productos(){

    for (let i = 0; i < Producto.length; i++) {
        
        var element_ = document.getElementById('Contenedor_Izq');

            element_.innerHTML += `
            <div class="card">
                <img src="${Producto[i].imgR}" alt="">
                <h3>${Producto[i].nombreR}</h3>
                <p>$ ${Producto[i].precioR}</p>
                <span><button class="Ver_Mas" id="${Producto[i].idR}"> Ver mas</button>&nbsp&nbsp
                <button class="Add_Cart" id="${Producto[i].idR}"> Add Cart</button></span>
            </div>
            `;
        
    }

    $('#Contenedor_Izq').paginate({
        items_per_page: 6
    });
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
                                    <div class="buton_Add">
                                        <button class="agregar_carro" id="${Producto[i].idR}">Agregar Carro</button>
                                    </div>
                                </div>`;

            var hh = `${card}
                      ${Descrpcion}`;
            printModal(hh);
        }    
    }

}
