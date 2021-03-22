if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', loadCartItems)
} else {
    loadCartItems()
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

function loadCartItems() {
    //Mise à jour du nombre d'article dans le panier
    let cartNumber= localStorage.getItem('cartNumbers');

    if(cartNumber){
        const mycart = document.getElementsByTagName('i')[0];
        mycart.setAttribute('data-count', cartNumber);
    } 

    let products = localStorage.getItem('productsInCart');
    products = JSON.parse(products);
    

    let cartItems = document.getElementsByClassName('cart-items')[0]
    cartItems.innerHTML = ''
    Object.values(products).map(item =>{
        let cartRowContents = `
        <div class="cart-row">
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${item.imageUrl}" width="100" height="100">
                <span class="cart-item-title">${item.name}</span>
            </div>
            <span class="cart-price cart-column">${item.price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="${item.quantite}" onchange="quantityChanged(event)">
            </div>
            <div class="cart-command cart-column">
                <button class="btn btn-danger" type="button" onclick="removeCartItem(event)" data-id="${item._id}">Supprimer</button>
            </div>
        </div>`
        cartItems.innerHTML += cartRowContents
      
    });
   
  
    updateCartTotal();
}

function purchaseClicked() {
    alert('Merci pour votre achat!')
    let cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(event) {
    let buttonClicked = event.target
    if(buttonClicked){
        const productId = buttonClicked.dataset.id;
        updateCart(productId);
    }
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    let input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
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
    document.getElementsByClassName('cart-total-price')[0].innerText = total + '€'
}

function updateCart(productId){
    //Mise à jour du nombre d'article dans le panier
    let cartNumber= localStorage.getItem('cartNumbers');
    cartNumber = parseInt(cartNumber) - 1;
   
    //
    let products = localStorage.getItem('productsInCart');
    products = JSON.parse(products);

    //
    let product = Object.values(products).find(p => p._id == productId);
   
    if (product) {

        products = Object.values(products).filter(p => p._id != productId);
        
        let totalCost = localStorage.getItem('totalCartCost');
        totalCost = parseInt(totalCost) - (parseInt(product.quantite) * parseInt(product.price));
        document.querySelector('.badge').setAttribute('data-count',  cartNumber); 
        //Mise à jour globale
        localStorage.setItem('cartNumbers',cartNumber);
        localStorage.setItem('totalCartCost', totalCost);
        localStorage.setItem('productsInCart', JSON.stringify(products));
    }

}

