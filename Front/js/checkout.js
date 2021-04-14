if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', onCheckoutLoad)
} else {
    onCheckoutLoad()
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

let data = {
  contact : {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    email: ''
  },
  products: ['']
}


function onCheckoutLoad(){
    //Mise à jour du nombre d'article dans le panier
    let cartNumber= localStorage.getItem('cartNumbers');

    if(cartNumber){
        const mycart = document.getElementsByTagName('i')[0];
        mycart.setAttribute('data-count', cartNumber);
    } 

    // Total cart cost
    let totalCost = localStorage.getItem('totalCartCost');

    let btnSubmit = document.getElementsByClassName('btn-purchase')[0];
    btnSubmit.innerText = `Valider (${totalCost}) €`;
}

function checkout(){
  orderTeddies().then(teddies => {
      let productContainer = document.querySelector('.confirmation');
      let checkoutContainer = document.querySelector('.container');
      if(teddies){
        checkoutContainer.remove();
          productContainer.innerHTML = '';
              productContainer.innerHTML += `
              <div class="m-2 d-flex flex-column justify-content-center align-items-center">
                  <div>
                    <span>Commande N°: </span>
                    <span><strong>${teddies.orderId}</strong> enrégistré avec succés.</span>

                    <p>Pour suivre le statut de traitement de votre commande, consultez régulièrement votre boîte mail: <strong>${teddies.contact.email}</strong></p>
                  </div>
                  <div>
                    <p>Nous vous remercions pour votre achat.</p>
                  </div>
                  <div>
                  <button class="btn btn-primary shop-item-button" type="button"  onclick="gotoStore()">Retour à la boutique</button>
                  </div>
              </div>
              `;
          
      } else { 
          const erroMessage = document.querySelector('.errorMessage');
          erroMessage.textContent = `Echec traitement de votre commande. Merci de réessayer plus tard.`
      }
    
    }).catch(error => {
      const erroMessage = document.querySelector('.errorMessage');
      erroMessage.textContent = `${error}`
    })
}

function gotoStore(){
  window.localStorage.clear();
  // Retour à la boutique
  let url='http://127.0.0.1:5500/Front/Pages/store.html';
  location.href=url;
}

function formatCheckoutData(){
  // récupération des identifiants produit
  let products = localStorage.getItem('productsInCart');
  products = JSON.parse(products);
  let productData = [];
  Object.values(products).map(item => {
    productData.push(item._id);
  })
  data.products = productData;

  //remplir les information du contact
  let contactData = {
    firstName: document.getElementById('firstname').value,
    lastName: document.getElementById('lastname').value,
    address: document.getElementById('adress').value,
    city: document.getElementById('city').value,
    email: document.getElementById('email').value
  }

  data.contact = contactData;

  return data;
}

async function orderTeddies() {
  let order = formatCheckoutData();
  const response = await fetch('http://127.0.0.1:3000/api/teddies/order', {
    method: 'POST',
    body: JSON.stringify(order),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  });

  if(response.ok){
      return await response.json();
  } else {
      const message = `Une erreur inattendu s'est  produite. Réessayez plus tard. Merci! ${response.status}`;
      throw new Error(message);
  }
}

// Récuperation des teddies depuis le server
