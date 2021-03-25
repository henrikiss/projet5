


if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', onPageLoad)
} else {
    onPageLoad()
}

function onPageLoad(){
    let cartNumber = localStorage.getItem('cartNumbers');

    if(cartNumber){
        const mycart = document.getElementsByTagName('i')[0];
        mycart.setAttribute('data-count', cartNumber);
    } else {
        const mycart = document.getElementsByTagName('i')[0];
        mycart.setAttribute('data-count', 0);
    }

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

//Cette fonction retourne la valeur du paramétre passer entré présent dans URL
// Retourne null si paramétre inexistant
function getParameter(parameterName){
    let parameters = new URLSearchParams(window.location.search);
    return parameters.get(parameterName);
}

// Récupération de l'identifiant du produit depuis url
const teddy_id = getParameter('id');

loadProductById(teddy_id);

function loadProductById(productId){
    if(productId == null){
        alert(`Identifiant du produit inconnu.`);
        return
    }
   
    // Appel API
    let request = new XMLHttpRequest()
    request.open('GET', 'http://127.0.0.1:3000/api/teddies/'+productId);
    request.setRequestHeader('content-type','application/json')

    request.send();

    request.onload = function (){

        if(request.status >= 200 && request.status < 400){
            //reception et traitement du JSON réponse
            let teddyData = JSON.parse(this.response);
            console.log(JSON.stringify(teddyData));
            let html = '';
            let teddyColors = JSON.stringify(teddyData.colors);
        
            let modif1 = teddyColors.replace(/\"/g,"");
            let modif2 = modif1.replace(/\[/g,"");
            let mycolors = modif2.replace(/\]/g,"");
            
            //Créer un tableau de couleurs
            let itemCouleurs = mycolors.split(',');
            
            
            
            let htmlSegment = `
                                <section class="section product-detail">
                                <div class="details container-md">
                                <div class="left">
                                    <div class="main">
                                    <img src="${teddyData.imageUrl}" alt="">
                                    </div>
                                </div>
                                <div class="right">
                                    <span>Shop/Teddies</span>
                                    <h1>${teddyData.name}</h1>
                                    <div class="price">${teddyData.price} €</div>
                                    <form>
                                    <div>
                                        <select id="colorSelect">
                                        <option value="Choisir une couleur" selected disabled>Couleur</option>
                                        <option value="1">${itemCouleurs[0]}</option>
                                        <option value="2">${itemCouleurs[1]}</option>
                                        <option value="3">${itemCouleurs[2]}</option>
                                        </select>
                                        <span><i class='bx bx-chevron-down'></i></span>
                                    </div>
                                    </form>
                            
                                    <form class="form">
                                    <input type="number" value="1" class="quantiteId">
                                    <a href="#" class="addCart">Ajouter au panier</a>
                                    </form>
                                    <h3>Descriptions</h3>
                                    <p>${teddyData.description}</p>
                                </div>
                                </div>
                            </section>
                                `;

            html += htmlSegment;

            let container = document.querySelector('.container');
            container.innerHTML = html;

            // attacher l'evenement click au bouton 'Ajouter au panier'
            document.querySelector('.addCart').addEventListener('click', () => {

                // récupération de la valeur de la couleur sélectionnée.
                let myColor = "Undefined";
                let selectedColor = document.getElementById("colorSelect");
            
                if(selectedColor.options.length > 0){
                    myColor = selectedColor.options[selectedColor.selectedIndex].text;
                }

                //récupérer la quantité
                let quantityElement = document.getElementsByClassName('quantiteId')[0];
                let qte = parseInt(quantityElement.value);

                // construction du produit a ajouté au panier
                let product = {
                    color:myColor,
                    _id: teddyData._id,
                    name: teddyData.name,
                    price: teddyData.price,
                    imageUrl:teddyData.imageUrl,
                    quantite: qte
                }
            
                SetProductsInCart(product);
                TotalCartCost(product);
            })
            
        } else {
            //TODO: Afficher un message pour signaler l'erreur
        }
    }
   
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
}

function SetProductsInCart(product){
    //Récupération des produits existant du panier
    let cartItems = localStorage.getItem('productsInCart');

    // Conversion du panier de string en object(JSON)
    cartItems = JSON.parse(cartItems);

    //Test si le panier existe
    if(cartItems != null){
        //test si le produit n'existe pas dans le panier
        if(cartItems[product._id] == undefined){
            //  ajouter le produit dans le panier 
            cartItems = {
                ...cartItems,
                [product._id] : product
            }
           cartNumbers(product);
        } else {
           // sinon increment la quantite du produit de 1
            cartItems[product._id].quantite += product.quantite;
        }

    } else {
        //Ajouter le premier produit dans le panier
        cartItems = {
            ...cartItems,
            [product._id] : product
        }
        cartNumbers(product);
    }

    // Mise à jour du panier dans le loaclaStorage
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));

}

function TotalCartCost(product){
    let cartCost = localStorage.getItem('totalCartCost');

    if(cartCost != null){
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCartCost', cartCost + parseInt(product.price * product.quantite));
    } else {
        localStorage.setItem('totalCartCost', parseInt(product.price * product.quantite));
    }
}




