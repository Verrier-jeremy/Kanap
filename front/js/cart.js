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


function getForm() {

    // selection du formulaire
    let form = document.querySelector('.cart__order__form');
    console.log(form.firstName);

    //selection du boutton de validation du formulaire
    /*let validForm = document.getElementById('order');
    let formOK = false;

    //Creation de la condition que le boutton est cliquable après que toutes les données rentrées soient validées par les regexp
    validForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (formOK) {
            console.log("formulaire valid");
        }
    })*/

    // Mise en place des différentes expressions régulières pour le formulaire
    let charRegexp = new RegExp(`^[a-zA-Z ,.'-]+$`, 'g');
    let emailRegexp = new RegExp(`^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$`, 'g');
    let addressRegexp = new RegExp(`^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+$)`, 'g');


    // test des differentes valeurs données dans le formulaire avec les Regexp
    form.firstName.addEventListener('change', () => {
        validationFirstNameRegexp(this);
    });

    form.lastName.addEventListener('change', () => {
        validationLastNameRegexp(this);
    });

    form.address.addEventListener('change', () => {
        validationaddressRegexp(this);
    });

    form.city.addEventListener('change', () => {
        validationCityRegexp(this);
    });

    form.email.addEventListener('change', () => {
        validationEmailRegexp(this);
    });

    const validationFirstNameRegexp = function (inputName) {
        let inputTestFirstName = charRegexp.test(inputName.value);
        if (inputTestFirstName) {
            console.log('test validé');
            console.log(inputTestFirstName);
        }
        else {
            console.log(inputTestFirstName);
        }
        return inputTestFirstName;
    }

    const validationLastNameRegexp = function (input) {
        let inputTestLastName = charRegexp.test(input.value);
        if (inputTestLastName) {
            console.log('test validé');
            console.log(inputTestLastName);
            return inputTestLastName;
        }
        else {
            console.log(inputTestLastName);
        }

    }

    // function validationaddressRegexp(input){
    const validationaddressRegexp = function (input) {
        let inputTestAddress = addressRegexp.test(input.value);
        if (inputTestAddress) {
            console.log('test validé');
            console.log(inputTestAddress);
            return inputTestAddress;
        }
        else {
            console.log(inputTestAddress);
        }
    }

    const validationCityRegexp = function (input) {
        let inputTestCity = charRegexp.test(input.value);
        if (inputTestCity) {
            console.log('test validé');
            console.log(inputTestCity);
            return inputTestCity;
        }
        else {
            console.log(inputTestCity);
        }
    }

    const validationEmailRegexp = function (input) {
        let inputTestemail = emailRegexp.test(input.value);
        if (inputTestemail) {
            console.log('test validé');
            console.log(inputTestemail);
            return inputTestemail;
        }
        else {
            console.log(inputTestemail);
        }
    }
}
getForm();







