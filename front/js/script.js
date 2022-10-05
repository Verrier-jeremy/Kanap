 async function fetchProducts(){
    await fetch("http://localhost:3000/api/products")
    .catch(function(error){
        console.log(error);
    })
    .then(function(respons){
        console.log(respons);
        return respons.json();
    })
    .then(function(datasucessresult){
        const itemSection = document.querySelector(".items");
        console.log(datasucessresult);

        for (let i=0;i<=datasucessresult.length;i++){
        itemSection.innerHTML +=
        `<a href="./product.html?id=${datasucessresult[i]._id}">
        <article>
          <img src=${datasucessresult[i].imageUrl} alt=${datasucessresult[i].altTxt}>
          <h3 class="productName">${datasucessresult[i].name}</h3>
          <p class="productDescription">${datasucessresult[i].description}</p>
        </article>
      </a>`}
    })

}
fetchProducts();
