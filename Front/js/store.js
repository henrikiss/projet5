if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

// Fixed Nav
const navBar = document.querySelector(".nav");
const navHeight = navBar.getBoundingClientRect().height;
window.addEventListener("scroll", () => {
  const scrollHeight = window.pageYOffset;
  if (scrollHeight > navHeight) {
    navBar.classList.add("fix-nav");
  } else {
    navBar.classList.remove("fix-nav");
  }
});

// Scroll To
const links = [...document.querySelectorAll(".scroll-link")];
links.map(link => {
  if (!link) return;
  link.addEventListener("click", e => {
    e.preventDefault();

    const id = e.target.getAttribute("href").slice(1);

    const element = document.getElementById(id);
    const fixNav = navBar.classList.contains("fix-nav");
    let position = element.offsetTop - navHeight;

    window.scrollTo({
      top: position,
      left: 0,
    });

    navBar.classList.remove("show");
    menu.classList.remove("show");
    document.body.classList.remove("show");
  });
});

let product;

async function fetchTeddies() {
    const response = await fetch('http://127.0.0.1:3000/api/teddies');

    if(response.ok){
        return await response.json();
    } else {
        const message = `Une erreur inattendu s'est  produite. Réessayez plus tard. Merci! ${response.status}`;
        throw new Error(message);
    }
}

// Récuperation des teddies depuis le server
fetchTeddies().then(teddies => {
    let productContainer = document.querySelector('.shop-items');
    if(teddies && teddies.length > 0){
        productContainer.innerHTML = '';
        Object.values(teddies).map(teddy => {
            let url='http://127.0.0.1:5500/pages/produit-detail.html?id='+teddy._id
            productContainer.innerHTML += `
            <div class="shop-item m-2 d-flex justify-content-center align-items-center">
                <span class="shop-item-id" hidden>${teddy._id}</span>
                <span class="shop-item-title">${teddy.name}</span>
                <img class="shop-item-image" src="${teddy.imageUrl}" id="teddyImage" href="${url}">
                <div class="shop-item-details">
                    <span class="shop-item-price">${teddy.price}€</span>
                    <button class="btn btn-primary shop-item-button" type="button" onclick="ready()">Ajouter au panier</button>
                </div>
            </div>
            `
        });
    } else {
        // No teddies found in Database
    }

}).catch(error => {

})

function showDetails(url){
    location.href=url;
}


function ready() {
    let cartNumber= localStorage.getItem('cartNumbers');

    if(cartNumber){
        const mycart = document.getElementsByTagName('i')[0];
        mycart.setAttribute('data-count', cartNumber);
    } 

    let addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (let i = 0; i < addToCartButtons.length; i++) {
        let button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

}


function addToCartClicked(event) {
    let button = event.target
    let shopItem = button.parentElement.parentElement
    let id = shopItem.getElementsByClassName('shop-item-id')[0].innerText
    let title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    let price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    let imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    product = {
        _id: id,
        title: title,
        price: price,
        imageUrl: imageSrc,
        quantite: 1
    }
    cartNumbers(product);
}



function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let price = parseFloat(priceElement.innerText.replace('€', ''))
        let quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '€' + total
}

/* GESTION DU PANIER*/

function cartNumbers(product){
    let nombreProduit = localStorage.getItem('cartNumbers');
    
    nombreProduit = parseInt(nombreProduit);

    if(nombreProduit){
        localStorage.setItem('cartNumbers', nombreProduit + 1);
        // Mise à jour du contenu panier sur le menu
        document.querySelector('.badge').setAttribute('data-count',  nombreProduit + 1); 
    } else {
        localStorage.setItem('cartNumbers', 1);
        // Mise à jour du contenu panier sur le menu
        document.querySelector('.badge').setAttribute('data-count', 1);
    } 
    
    SetProductsInCart(product);
    TotalCartCost(product);
}

function SetProductsInCart(product){
    //Récupération des produits existant du panier
    let cartItems = localStorage.getItem('productsInCart');

    // Conversion du panier de string en object(JSON)
    cartItems = JSON.parse(cartItems);

    //Test si le panier existe
    if(cartItems != null){
        //test si le produit existe dans le panier
        if(cartItems[product._id] == undefined){
            //  ajouter le produit dans le panier en incramentant sa quantite de 1
            product.quantite = 1
            cartItems = {
                ...cartItems,
                [product._id] : product
            }
           
        } else {
           // sinon increment la quantite du produit de 1
            cartItems[product._id].quantite += 1;
        }

    } else {
        //Ajouter le premier produit dans le panier
        product.quantite = 1
        cartItems = {
            ...cartItems,
            [product._id] : product
        }
    }

    // Mise à jour du panier dans le loaclaStorage
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));

}

function TotalCartCost(product){
    let cartCost = localStorage.getItem('totalCartCost');

    if(cartCost != null){
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCartCost', cartCost + parseInt(product.price));
    } else {
        localStorage.setItem('totalCartCost', parseInt(product.price));
    }
}