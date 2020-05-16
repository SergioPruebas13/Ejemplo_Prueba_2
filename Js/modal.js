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
	$('body').on('click', '#Contenedor_Izq .Productos .card', function(){
		var htm = $(this).html();
		var htm2 = htm.split(`<a class="Ver_Mas" href="#">Ver mas</a>`).join("");
		//alert(htm2);
		var hh = `<div class="card_">
				  ${htm2}
				  
		         </div>`;
	 	printModal(hh);
	})
  })



