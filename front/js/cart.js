
let allCart = JSON.parse(localStorage.getItem("elementsCart"));

if (allCart.length < 1) {
    let emptyCart = document.querySelector('h1');
    emptyCart.innerText = 'Votre Panier est vide !';
}
else {
    let allCartWithInfo = [];

    async function fetchProductInCart() {
        let promiseArray = [];
        for (let i = 0; i < allCart.length; i++) {
            promiseArray.push(new Promise((resolve) => {
                fetch("http://localhost:3000/api/products/" + allCart[i].id)
                    .then(function (respons) {
                        return respons.json();
                    })
                    .then(function (cartResult) {
                        const dataCart = { ...cartResult, ...allCart[i] };
                        /*const dataCart =[
                            id:allCart[i].id,
                            color: allCart[i].color,
                            quantity: allCart[i].quantity,
                            imageUrl
                        ]*/
                        resolve(dataCart);
                    })
            }))
        }

        const results = await Promise.all(promiseArray);
        return results;

    }

    async function displayCart() {
        const results = await fetchProductInCart();
        allCartWithInfo = results;
        let quantity = 0;
        let price = 0;
        let totalQuantity = document.querySelector("#totalQuantity");
        let totalPrice = document.querySelector("#totalPrice");
        const elementCart = document.querySelector("#cart__items");


        for (let i = 0; i < allCartWithInfo.length; i++) {
            const id = allCart[i].id;
            const color = allCart[i].color;
            const productQuantity = allCart[i].quantity;
            const productPrice = allCartWithInfo[i].price;

            quantity += allCartWithInfo[i].quantity;
            price += allCartWithInfo[i].quantity * allCartWithInfo[i].price;
            totalQuantity.innerText = `${quantity}`;
            totalPrice.innerText = `${price}`;


            // Déclaration de la variable articleCart en créant un article avec le parent elementCart
            let articleCart = document.createElement('article');
            articleCart.classList.add('cart__item');
            articleCart.setAttribute("data-id", `${allCartWithInfo[i].id}`);
            articleCart.setAttribute("data-color", `${allCartWithInfo[i].color}`);
            elementCart.appendChild(articleCart);

            // Déclaration de la variable imageDiv en créant une div avec le parent articleCart
            let imageDiv = document.createElement('div');
            imageDiv.classList.add('cart__item__img');
            articleCart.appendChild(imageDiv);

            // Déclaration de la variable imageProduct en créant une image avec le parent imageDiv
            let imageProduct = document.createElement('img');
            imageProduct.src += `${allCartWithInfo[i].imageUrl} `;
            imageProduct.alt += `alt=${allCartWithInfo[i].altTxt}`;
            imageDiv.appendChild(imageProduct);

            // Déclaration de la variable globalDescriptionProduct en créant une div avec le parent articleCart
            let globalDescriptionProduct = document.createElement('div');
            globalDescriptionProduct.classList.add('cart__item__content');
            articleCart.appendChild(globalDescriptionProduct);

            // Déclaration de la variable descriptionProduct en créant une div avec le parent globalDescriptionProduct
            let descriptionProduct = document.createElement('div');
            descriptionProduct.classList.add('cart__item__content__description');
            descriptionProduct.innerHTML += `<h2>${allCartWithInfo[i].name}</h2>
            <p>${allCartWithInfo[i].color}</p>
            <p>${allCartWithInfo[i].price} €</p>`;
            globalDescriptionProduct.appendChild(descriptionProduct);

            // Déclaration de la variable cartSetting en créant une div avec le parent globalDescriptionProduct
            let cartSetting = document.createElement('div');
            cartSetting.classList.add('cart__item__content__settings');
            globalDescriptionProduct.appendChild(cartSetting);

            // Déclaration de la variable divQuantity en créant une div avec le parent cartSetting
            let divQuantity = document.createElement('div');
            divQuantity.classList.add('cart__item__content__settings__quantity');
            cartSetting.appendChild(divQuantity);

            // Déclaration de la variable paraQuantity en créant une input avec le parent divQuantity
            let paraQuantity = document.createElement('p');
            divQuantity.appendChild(paraQuantity);
            paraQuantity.innerText = "Qte : ";

            // Déclaration de la variable inputQuantity en créant une input avec le parent paraQuantity
            let inputQuantity = document.createElement('input');
            paraQuantity.appendChild(inputQuantity);
            inputQuantity.classList.add('itemQuantity');
            inputQuantity.setAttribute("type", "number");
            inputQuantity.setAttribute("min", "1");
            inputQuantity.setAttribute("max", "100");
            inputQuantity.setAttribute("name", "itemQuantity");
            inputQuantity.value = allCartWithInfo[i].quantity;

            inputQuantity.addEventListener('change', (event) => {

                let quantitySelectedValue = inputQuantity.value;
                let indexProduct = allCart.findIndex(item => item.id == id && item.color == color)
                let deltaQuantity = allCart[indexProduct].quantity - Number(quantitySelectedValue);
                allCart[indexProduct].quantity = Number(quantitySelectedValue);
                localStorage.setItem("elementsCart", JSON.stringify(allCart));
                totalQuantity.innerText -= `${deltaQuantity}`;
                totalPrice.innerText -= `${deltaQuantity} ` * productPrice;

            });


            // Déclaration de la variable inputQuantity en créant une input avec le parent cartSetting
            let deleteCartProduct = document.createElement('div');
            deleteCartProduct.classList.add('cart__item__content__settings__delete');
            cartSetting.appendChild(deleteCartProduct);

            // Déclaration de la variable inputQuantity en créant une input avec le parent cartSetting
            let deleteProduct = document.createElement('p');
            deleteProduct.classList.add('deleteItem');
            deleteProduct.innerText = 'supprimer';
            deleteCartProduct.appendChild(deleteProduct);

            deleteProduct.addEventListener('click', () => {

                let indexProduct = allCart.findIndex(item => item.id == id && item.color == color)

                allCart.splice(indexProduct, 1);
                allCartWithInfo.splice(indexProduct, 1);
                localStorage.setItem('elementsCart', JSON.stringify(allCart));
                alert('Votre article a bien été supprimé.');
                articleCart.remove();
                quantity -= productQuantity;
                price -= productPrice * productQuantity;
                totalQuantity -= `${quantity}`;
                totalPrice.innerText = `${price}`;
            })
        }
    }

    displayCart();
}

//**************** fonction de vérification des données saisies par l'utilisateur**********

function getForm() {

    // selection du formulaire
    let form = document.querySelector('.cart__order__form');

    // Mise en place des différentes expressions régulières pour le formulaire
    let charRegexp = new RegExp(`[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+`, 'g');
    let emailRegexp = new RegExp(`^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$`, 'g');
    let addressRegexp = new RegExp(`^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç, ]+$)`, 'g');

    // test des differentes valeurs données dans le formulaire avec les Regexp
    //Test du prénom avec le regexp char
    let validFirstName;
    form.firstName.addEventListener('change', () => {
        let firstNameValidation = form.firstName;
        let valueFirstNameValidation = firstNameValidation.value;
        validFirstName = validationCharRegexp(valueFirstNameValidation, firstNameValidation);
        console.log(validFirstName);
    });

    //Test du nom avec le regexp char
    let validLastName;
    form.lastName.addEventListener('change', () => {
        let lastNameValidation = form.lastName;
        let valueLastNameValidation = lastNameValidation.value;
        validLastName = validationCharRegexp(valueLastNameValidation, lastNameValidation);
    });

    //Test de l'adresse avec le regexp adresse
    let validAddress;
    form.address.addEventListener('change', () => {
        let addressValidation = form.address;
        let valueaddressValidation = addressValidation.value;
        validAddress = validationAddressRegexp(valueaddressValidation);
    });

    //Test de la ville avec le regexp char
    let validCity;
    form.city.addEventListener('change', () => {
        let cityValidation = form.city;
        let valueCityValidation = cityValidation.value;
        console.log(valueCityValidation);
        validCity = validationCharRegexp(valueCityValidation, cityValidation);
    });

    //Test de l'email avec le regexp email
    let validEmail;
    form.email.addEventListener('change', () => {
        let emailValidation = form.email;
        let valueEmailValidation = emailValidation.value;
        validEmail = validationEmailRegexp(valueEmailValidation);
    });

    //Fonctions permettant de contrôler les valeurs saisies par l'utilisateur
    //Fonction de test regexp char
    function validationCharRegexp(input, Element) {
        let idElement = Element.id;
        let inputTestChar = charRegexp.test(input);
        let idParagrapheselector = idElement + "ErrorMsg";
        if (inputTestChar) {
            document.getElementById(idParagrapheselector).textContent = '';
        }
        else {
            console.log(idElement, charRegexp, input )
            document.getElementById(idParagrapheselector).textContent = 'Votre saisie doit contenir uniquement des lettres';
        }
        return inputTestChar;
    }

    //Fonction de test regexp adresse
    function validationAddressRegexp(input) {
        let inputTestAddress = addressRegexp.test(input);
        if (inputTestAddress) {
            document.getElementById('addressErrorMsg').textContent = '';
        }
        else {
            document.getElementById('addressErrorMsg').textContent = 'Votre saisie n\'est pas valid ex: 28 rue des oiseaux';
        }
        return inputTestAddress;
    }

    //Fonction de test regexp email
    function validationEmailRegexp(input) {
        let inputTestEmail = emailRegexp.test(input);
        if (inputTestEmail) {
            document.getElementById('emailErrorMsg').textContent = '';
        }
        else {
            document.getElementById('emailErrorMsg').textContent = 'Votre saisie n\'est pas valid ex: votreEmail@kanap.fr';
        }
        return inputTestEmail;
    }

    let products = allCart;
    // condition pour valider la construction de l'objet contact avant de le POST
    const btnValidate = document.getElementById('order');
    btnValidate.addEventListener('click', (e) => {
        e.preventDefault();
        if (validFirstName &&
            validLastName &&
            validAddress &&
            validCity &&
            validEmail
        ) {
            // Création de l'objet contact en récuperant toutes les saisies valides
            let contact = {
                firstName: document.querySelector("#firstName").value,
                lastName: document.querySelector("#lastName").value,
                address: document.querySelector("#address").value,
                city: document.querySelector("#city").value,
                email: document.querySelector("#email").value,
            }
            console.log(contact);
            let products = allCart.map((item) => {
                return item.id;})
                console.log(products);
            let allDataToPost = {contact, products};
            let reqInit= {
                method: "post",
                headers: {
                    ["Content-Type"]: "application/json"
                },
                body: JSON.stringify(allDataToPost)
            };

            fetch("http://localhost:3000/api/products/order", reqInit )           
            .then(function (respons) {
                return respons.json();
            })
            .then(function (kanap) {
                console.log(kanap.orderId);
                location.href="confirmation.html?orderId="+ kanap.orderId;
            })

             
        } 
        else {
            alert("Le formulaire n'est pas correctement rempli.\r Veuillez verifier vos saisies.");
        }
    });
}


getForm();






