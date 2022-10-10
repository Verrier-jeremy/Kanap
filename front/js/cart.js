const allCart = JSON.parse(localStorage.getItem("elementsCart"));
console.log(allCart);
let allCartWithInfo =[];

async function fetchProductInCart(){
    let promiseArray =[];

    for(let i=0; i<allCart.length; i++){
        promiseArray.push(new Promise((resolve)=>{
            fetch("http://localhost:3000/api/products/"+ allCart[i].id)
            .then(function(respons){
                return respons.json();
            })
            .then(function(cartResult){
                const dataCart = {...cartResult,...allCart[i]};
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

async function displayCart(){
    const results = await fetchProductInCart();
    allCartWithInfo = results;
    let quantity = 0;
    let price = 0;
    let totalQuantity = document.querySelector("#totalQuantity");
    let totalPrice = document.querySelector("#totalPrice");
    const elementCart = document.querySelector("#cart__items");
    for(let i=0; i< allCartWithInfo.length; i++){
        quantity += allCartWithInfo[i].quantity;
        elementCart.innerHTML +=
        `<article class="cart__item" data-id="${allCartWithInfo[i].id}" data-color="${allCartWithInfo[i].color}">
        <div class="cart__item__img">
        <img src=${allCartWithInfo[i].imageUrl} alt=${allCartWithInfo[i].altTxt}>
        </div>
        <div class="cart__item__content">
        <div class="cart__item__content__description">
            <h2>${allCartWithInfo[i].name}</h2>
            <p>${allCartWithInfo[i].color}</p>
            <p>${allCartWithInfo[i].price} €</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${allCartWithInfo[i].quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
            </div>
        </div>
        </div>
        </article>`;
    }
    totalQuantity.innerText=`${quantity}`;
    totalPrice.innerText=`${price}`;
}
displayCart();





 
 



