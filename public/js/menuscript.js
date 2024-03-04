$(document).ready(function() {
	$('.cards:first').show();
	$('.ul-menu li:first').addClass('active');

	$('.ul-menu li').click(function(event) {
		index = $(this).index();
		$('.ul-menu li').removeClass('active');
		$(this).addClass('active');
		$('.block').hide();
		$('.block').eq(index).show();
	});
});

const addToCartCreation = (parent, title, price, imgSrc) => {
	let cart = document.createElement('img');
	cart.className = 'add-to-cart';
	cart.src = 'img/add-to-cart.png';
	parent.appendChild(cart);
	/* unique data attribute name */
	let dataIdName = title; //imgSrc.split('/').pop().split('.')[0];
	cart.setAttribute('data-id', `${dataIdName}`);
	/* adding click event to the card */
	cart.addEventListener('click', (event) => {
		cardClick(event, title, price, imgSrc)
	});
	//quantityFunc(title);
}
  
document.addEventListener('DOMContentLoaded', () => {

	//add a cart if logged in, if not removing it
	var allAllMenu = document.querySelector('.all-all-menu');
    var cartCreationString = allAllMenu.getAttribute('data-cart-creation');
	cartCreation = JSON.parse(cartCreationString);

	let i=0;
	const section = document.querySelector('.menu');
	const jsonFunc = async () => {
		try {
			const response = await fetch('foods.json');
			if(!response.ok) throw new Error('Failed to fetch data');
			const data = await response.json();

			data.forEach((sect) => {
				
				Object.keys(sect).forEach((category) => {
					console.log(sect[category])
					let blockLev = document.createElement('div');
					blockLev.className = 'block';

					if(i===0) {
						blockLev.style.display = 'block';
					}
					i++;

					sect[category].forEach((cards) => {
						let cardsLev = document.createElement('div');
						cardsLev.className = 'cards';

						cards.cards.forEach((card) => {
							let cardLev = document.createElement('div');
							cardLev.className = 'card';

							let img = document.createElement('img');
							img.className = 'card-img';
							img.src = card.imgSrc;
							cardLev.appendChild(img);

							let price = document.createElement('h4');
							price.className = 'price';
							price.textContent = card.price;
							cardLev.appendChild(price);

							let title = document.createElement('h5');
							title.className = 'titlefood';
							title.textContent = card.title;
							cardLev.appendChild(title);

							let description = document.createElement('p');
							description.className = 'description';
							description.textContent = card.description;
							cardLev.appendChild(description);

							if(cartCreation === true){
								addToCartCreation(cardLev, card.title, card.price, card.imgSrc);
							}

							cardsLev.appendChild(cardLev);
						})
						blockLev.appendChild(cardsLev);
					})
					section.appendChild(blockLev);
				})
			})
		} catch(error) {
			console.log('errors: ', error);
		}
	}

	jsonFunc();

})

/* loader */

document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("loader");
    loader.style.display = "block";
	
	const mainContent = document.querySelector(".all-all-menu");
	mainContent.style.display = "none";

    setTimeout(function () { //after 4s
        loader.style.display = "none"; 
        mainContent.style.display = "flex";
    }, 4000); 
});

/* card click event */
const helpFoods = [];
const cardClick = (event, titleArg, priceArg, imgArg) => {
	const dataId = event.target.dataset.id;
	console.log(dataId);
	const selectedCard = document.querySelector(`div.card > .add-to-cart[data-id="${dataId}"]`).closest('.card');
	const addToCart = document.querySelector(`.add-to-cart[data-id="${dataId}"]`);
	addToCart.remove();
	//selectedCard.style.backgroundColor = 'black';

	/* create the valid img */	
	let validMark = document.createElement('img');
	validMark.className = 'valid-mark';
	validMark.src = 'https://img.icons8.com/?size=1x&id=B1CQFz2kuk8P&format=png';
	selectedCard.appendChild(validMark);

	/* create the quantity element */
	let quantity = document.createElement('div');
	quantity.className = 'quantity';
	quantity.setAttribute('data-quantity', titleArg);
	
	let minus = document.createElement('span'); minus.className = 'minus'; 
	let num = document.createElement('span'); num.className = 'num-quantity';
	let plus = document.createElement('span'); plus.className = 'plus';

	minus.textContent = '-';
	let quantityValue = 1;
	num.textContent = quantityValue;
	plus.textContent = '+';

	quantity.append(minus, num, plus);
	selectedCard.appendChild(quantity);

	//creating objects to add in localStorage later
	const selectedFood = {
		titleFood: titleArg,
		imgFood: imgArg,
		priceFood: priceArg,
		quantityFood: 1
	};

	helpFoods.push(titleArg);

	localStorage.setItem(`${dataId}`, JSON.stringify(selectedFood));

	minus.addEventListener('click', () => {
		if (num.textContent > 1) {
			num.textContent--;
			updateQuantity(dataId, num.textContent, selectedFood);
		}
	});
	
	plus.addEventListener('click', () => {
		num.textContent++;
		updateQuantity(dataId, num.textContent, selectedFood);
	});

	// remove selection
	validMark.addEventListener('click', () => {
		validMark.remove();
		quantity.remove();
		addToCartCreation(selectedCard, titleArg, priceArg, imgArg);
		//remove object from localStorage
		localStorage.removeItem(`${dataId}`, JSON.stringify(selectedFood));
	})
}

const updateQuantity = (titleObj, newQuantity, storedFood) => {
	storedFood.quantityFood = newQuantity; 
	localStorage.setItem(`${titleObj}`, JSON.stringify(storedFood));
};

const addInfoLocalStorage = () => {
	localStorage.setItem('selectedFoods', JSON.stringify([]));
	const storedFoods = [];

	for(let i = 0; i < helpFoods.length; i++) {
		storedFoods.push(JSON.parse(localStorage.getItem(helpFoods[i]))); 
		localStorage.removeItem(helpFoods[i]);
	}
	localStorage.setItem('selectedFoods', JSON.stringify(storedFoods));
	
	function convertPrice(price) {
		return parseFloat(price.replace('$',''));
	}

	const foodOrder = JSON.parse(localStorage.getItem('selectedFoods'));
	const sumPrice = foodOrder.reduce((total, food) => total + (convertPrice(food.priceFood)*parseFloat(food.quantityFood)), 0);
	console.log(sumPrice);
	if(foodOrder && foodOrder.length > 0) { //if statement added
		window.location.href = `/food_order?foodData=${JSON.stringify(foodOrder)}&priceSum=${sumPrice}`;
	} else {
		window.location.href = `/indexlogout`;
	}
}

//back to select a seat
const back = () => {
	window.location.href = '/store_radio_value';
}










//JSON.stringify: js object => json string for storage (STORE)
//JSON.parse: vice-versa for js work (RETRIEVE)

/* TODO:
		
*/