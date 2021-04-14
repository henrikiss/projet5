if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', onPageLoad)
} else {
    onPageLoad()
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
            
            productContainer.innerHTML += `
            <div class="shop-item m-2 d-flex justify-content-center align-items-center">
                <span class="shop-item-id" hidden>${teddy._id}</span>
                <span class="shop-item-title">${teddy.name}</span>
                <img class="shop-item-image" src="${teddy.imageUrl}" data-id="${teddy._id}" onclick="gotoDetailPage(event)">
                <div class="shop-item-details">
                    <span class="shop-item-price">${teddy.price}€</span>
                    <button class="btn btn-primary shop-item-button" type="button" data-id="${teddy._id}" onclick="gotoDetailPage(event)">Détails</button>
                </div>
            </div>
            `
        });
    } else { 
        const erroMessage = document.querySelector('.errorMessage');
        erroMessage.textContent = `Désolé! Aucun produit disponible dans la galerie.`
    }

}).catch(error => {
    const erroMessage = document.querySelector('.errorMessage');
    erroMessage.textContent = `${error}`
})



/* Cette fonction est appellée au chargement de la page */
/*Elle permet de récupérer le nombre de produit du panier et rafraîchit la valeur du panier affichée*/
function onPageLoad() {
    let cartNumber= localStorage.getItem('cartNumbers');

    if(cartNumber){
        const mycart = document.getElementsByTagName('i')[0];
        mycart.setAttribute('data-count', cartNumber);
    } 

}

/*Cette fonction permet de naviguer vers la page détails d'un produit */
function gotoDetailPage(event){
    let buttonClicked = event.target;
    const productId = buttonClicked.dataset.id;
    let url='http://127.0.0.1:5500/Front/Pages/product.html?id='+productId;
    location.href=url;
}



