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


$(document).ready(function(){

	var Descrpcion = `<div class="Descricion">
						<div class="solo_Descripcion">
							<h3>Descripcion.</h3>
							<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
							Quaerat dolor laborum sequi.
							</p>
						</div>
						<div class="buton_Add">
							<button id="agregar_carro">Agregar Carro</button>
						</div>
					  </div>`;



	$('body').on('click', '#Contenedor_Izq .card', function(){
		var htm = $(this).html();
		console.log(htm)
		var htm2 = htm.split(`<button class="Ver_Mas"> Ver mas</button>`).join("");
		var htm3 = htm2.split(`<button class="Ver_Mas"> Add Cart</button>`).join("");
		//alert(htm2);
		var hh = `<div class="card_">
				  ${htm3}
				 </div>
				 ${Descrpcion}`;
	 	printModal(hh);
	})
  })







