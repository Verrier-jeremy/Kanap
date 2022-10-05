const params = new URL(document.location).searchParams;
const id = params.get("id")
console.log(id);

async function fetchProductSelect(){
    await fetch("http://localhost:3000/api/products/"+ id)
    .catch(function(error){
        console.log(error);
    })
    .then(function(respons){
        console.log(respons);
        return respons.json();
    })
    .then(function(objectresult){

        const imageSection = document.querySelector(".item__img");        
        imageSection.innerHTML =`<img src=${objectresult.imageUrl} alt=${objectresult.altTxt}></img>`
       
        const titreSection = document.querySelector("#title");        
        titreSection.innerText =`${objectresult.name}`;

        const priceSection = document.querySelector("#price");        
        priceSection.innerText =`${objectresult.price}`;
        
        const descriptionSection = document.querySelector("#description");        
        descriptionSection.innerText =`${objectresult.description}`;
        
        const colorSection = document.querySelector("select");

        for (let i=0; i<=objectresult.colors.length-1; i++){       
            colorSection.innerHTML +=`<option value=${objectresult.colors[i]}>${objectresult.colors[i]}</option>`;
        }

        const quantityInput = document.querySelector("#quantity");
        const addToCartButton = document.querySelector("#addToCart");    
        addToCartButton.onclick = () =>{
            addToCart(quantityInput.value, colorSection.value) 
        }
    
         
    })
}

function addToCart(quantity,color){
       const newElements ={
                id: id,
                quantity: Number(quantity),
                color: color
            }
            const storedData = localStorage.getItem("elementsCart");
            let cartElements;
            if (!storedData){
                cartElements=[];
            }
            else{
                cartElements =JSON.parse(storedData)
            }
            cartElements.push(newElements);
            localStorage.setItem("elementsCart",JSON.stringify(cartElements));
}
fetchProductSelect();

