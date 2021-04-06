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
    alert('Merci pour votre achat!');
    window.localStorage.clear();
    // Retour à la boutique
    let url='http://127.0.0.1:5500/Front/Pages/store.html';
    location.href=url;
}