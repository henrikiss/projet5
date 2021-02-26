function onPageLoad(){
    let productNumbers = localStorage.getItem('cartNumbers');

    if(productNumbers){
        document.querySelector('.cart').textContent = productNumbers;
    } else{
        document.querySelector('.cart').textContent = 0;
    }
}


// Action click sur menu
document.querySelector('.menu').addEventListener('click', () => {
    document.querySelectorAll('.target').forEach((item) =>{
        item.classList.toggle('change')
    })
})

//Cette fonction retourne la valeur du paramétre passer entré présent dans URL
// Retourne null si paramétre inexistant
function getParameter(parameterName){
    let parameters = new URLSearchParams(window.location.search);
    return parameters.get(parameterName);
}

// Récupération de l'identifiant du produit depuis url
const teddy_id = getParameter('id');

if(teddy_id != null){
    // Appel API
    let request = new XMLHttpRequest()
    request.open('GET', 'http://localhost:3000/api/teddies/'+teddy_id);
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
           
           
            let htmlSegment = `<div class="d-flex align-items-center ">
                                <div class="w-50 pl-2">
                                    <img src="${teddyData.imageUrl}" class="img-fluid">
                                </div>
                                <div class="p-2 ml-3 w-75">
                                    <h1><strong>${teddyData.name}</strong></h1>
                                    <h4 class="p-2 price">${teddyData.price} €</h4>
                                    <h3>Sélectionnez une couleur</h3>
                                    <div >
                                        <form>
                                            <div>
                                            <select>
                                                <option value="Select Color" selected disabled></option>
                                                <option value="1">${itemCouleurs[0]}</option>
                                                <option value="2">${itemCouleurs[1]}</option>
                                                <option value="3">${itemCouleurs[2]}</option>
                                            </select>
                                            <span><i class='bx bx-chevron-down'></i></span>
                                            </div>
                                        </form>
                                    </div>
                                    <p class="taille">${teddyData.description}</p>
                                    <div class="btn btn-primary addCart">Ajouter au panier</div>
                                </div>
                            </div>        
                             `;

                              html += htmlSegment;

                              let container = document.querySelector('.container');
                              container.innerHTML = html;

                            // attacher l'evenement click au bouton 'Ajouter au panier'
                              document.querySelector('.addCart').addEventListener('click', () => {
                               
                                cartNumbers();
                            })

            
        } else {

        }
    }


} else {

}

/* GESTION DU PANIER*/

function cartNumbers(){
    let nombreProduit = localStorage.getItem('cartNumbers');
    
    nombreProduit = parseInt(nombreProduit);

    if(nombreProduit){
        localStorage.setItem('cartNumbers', nombreProduit + 1);
        // Mise à jour du contenu panier sur le menu
        document.querySelector('.cart').textContent = nombreProduit + 1; 
    } else {
        localStorage.setItem('cartNumbers', 1);
        // Mise à jour du contenu panier sur le menu
        document.querySelector('.cart').textContent = 1; 
    }                          
}

// Appel de la fonction
onPageLoad();
