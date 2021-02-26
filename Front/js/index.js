function onPageLoad(){
    let productNumbers = localStorage.getItem('cartNumbers');
    console.log("My Cart1: "+ productNumbers);
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

// Animation icons section accueil
const icons = document.querySelectorAll('.section-1-icons i')
let i = 1

setInterval(() => {
	i++
	const icon = document.querySelector('.section-1-icons .change')
	icon.classList.remove('change')

	if (i > icons.length) {
		icons[0].classList.add('change')
		i = 1
	} else {
		icon.nextElementSibling.classList.add('change')
	}
}, 4000)


// Récupération de la balise parent (section Gallery)
const application = document.querySelector('.gallery')

// Appel API
let request = new XMLHttpRequest()
request.open('GET', 'http://localhost:3000/api/teddies')

request.onload = function () {

    if(request.status >= 200 && request.status < 400) {
         //reception et traitement du JSON réponse
        let data = JSON.parse(this.response)
        data.forEach((teddy) => {
            //balise <a>
            let url='http://localhost:5500/Front/pages/produit.html?id='+teddy._id
            const gallerylink = document.createElement('a')
            gallerylink.setAttribute('class', 'gallery-link')
            gallerylink.setAttribute('title', 'ajouter')
            gallerylink.setAttribute('href', url)
            //balise <img>
            const image = document.createElement('img')
            image.setAttribute('class', 'teddy-img')
            image.setAttribute('src', `${teddy.imageUrl}`)

            //balise <h3>
            const h3 = document.createElement('h3')
            h3.setAttribute('class', 'teddy-name')
            h3.textContent = `${teddy.name} (${teddy.price} €)` 

            //balise <p>
            const p = document.createElement('p')
            p.setAttribute('class', 'teddy-description')
            p.textContent = teddy.description

            //Ajout des balises <img>, <h3> et <p> dans <a>
            gallerylink.appendChild(image)
            gallerylink.appendChild(h3)
            gallerylink.appendChild(p)

            //Ajout de la balise <a> dans la div
            application.appendChild(gallerylink)
            
        })
    } else {
        const errorMessage = document.createElement('h3')
        errorMessage.setAttribute('class', 'teddy-name')
        errorMessage.textContent = `Une erreur inattendu s'est  produite. Réessayez plus tard. Merci!`
        application.appendChild(errorMessage)
    }
}
request.send();



// Appel de la fonction
onPageLoad();