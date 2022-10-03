var params = new URL(document.location).searchParams;
var id = params.get("id")
console.log(id);

function fetchProducts(){
    fetch("http://localhost:3000/api/products/"+ id)
    .catch(function(error){
        console.log(error);
    })
    .then(function(respons){
        console.log(respons);
        return respons.json();
    })
    .then(function(datasucessresult){
        const imageSection = document.querySelector(".item__img");        
        imageSection.innerHTML +=`<img src=${datasucessresult.imageUrl} alt=${datasucessresult.altTxt}></img>`
        const titreSection = document.querySelector("#title");        
        titreSection.innerHTML +=`${datasucessresult.name}`;
        const descriptionSection = document.querySelector("#description");        
        descriptionSection.innerHTML +=`${datasucessresult.description}`;
        const colorSection = document.querySelector("#colors");        
        colorSection.innerHTML +=`<option value="vert">${datasucessresult.color[0]}</option>
        <option value="blanc">${datasucessresult.color[1]}</option>`;
        
        
        console.log(datasucessresult);
    })
}

fetchProducts();