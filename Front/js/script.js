
// Action menu
document.querySelector('.menu').addEventListener('click', () => {
    document.querySelectorAll('.target').forEach((item) =>{
        item.classList.toggle('change')
    })
})

// Animation icons accueil
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


// Récupération de la balise parent (DIV Gallery)
const application = document.querySelector('.gallery')

// Appel API
var request = new XMLHttpRequest()
request.open('GET', 'http://localhost:3000/api/teddies')

request.onload = function () {

    //reception et traitement du JSON réponse
    var data = JSON.parse(this.response)

    if(request.status >= 200 && request.status < 400) {
        data.forEach((teddy) => {
            //balise <a>
            const gallerylink = document.createElement('a')
            gallerylink.setAttribute('class', 'gallery-link')
            gallerylink.setAttribute('title', 'ajouter')
            gallerylink.setAttribute('href', '#')

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
request.send()