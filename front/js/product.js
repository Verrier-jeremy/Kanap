// Récuperation de l'id du produit cliqué dans la page d'accueil 
const params = new URL(document.location).searchParams;
const id = params.get("id")

// fonction requete pour récupérer juste les élements néccessaire du produit cliqué
async function fetchProductSelect() {
    await fetch("http://localhost:3000/api/products/" + id)
        .catch(function (error) {
            console.log(error);
        })
        .then(function (respons) {
            console.log(respons);
            return respons.json();
        })

        // fonction permettant la mise en page du produit choisi avec ses differents choix 
        .then(function (objectresult) {

            const imageSection = document.querySelector(".item__img");
            imageSection.innerHTML = `<img src=${objectresult.imageUrl} alt=${objectresult.altTxt}></img>`

            const titreSection = document.querySelector("#title");
            titreSection.innerText = `${objectresult.name}`;

            const priceSection = document.querySelector("#price");
            priceSection.innerText = `${objectresult.price}`;

            const descriptionSection = document.querySelector("#description");
            descriptionSection.innerText = `${objectresult.description}`;

            const colorSection = document.querySelector("select");

            for (let i = 0; i <= objectresult.colors.length - 1; i++) {
                colorSection.innerHTML += `<option value=${objectresult.colors[i]}>${objectresult.colors[i]}</option>`;
            }

            const quantityInput = document.querySelector("#quantity");
            const addToCartButton = document.querySelector("#addToCart");
            addToCartButton.onclick = () => {
                addToCart(quantityInput.value, colorSection.value);

            }
        })
}

// fonction permattant la mise dans le localstorage de tout les elements du produit néccessaires pour la page panier.html
function addToCart(quantity, color) {
    const newElements = {
        id: id,
        quantity: parseInt(quantity),
        color: color,

    }
    const storedData = localStorage.getItem("elementsCart");
    let cartElements;

    if (!storedData) {
        cartElements = [];
    }
    else {

        cartElements = JSON.parse(storedData);

        // Verification de doublon dans le localstorage
        for (let element in cartElements) {
            console.log(cartElements[element]);
            if (cartElements[element].id == newElements.id && cartElements[element].color == newElements.color) {
                console.log(element);
                cartElements.splice(element,1);
            }
        }
    }

    // Ajout du nouveau produit dans le localstorage
    cartElements.push(newElements);


    localStorage.setItem("elementsCart", JSON.stringify(cartElements));
}




fetchProductSelect();

