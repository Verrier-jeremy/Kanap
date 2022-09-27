function fetchProducts(){
    fetch("http://localhost:3000/api/products")
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


        /* <a href="./product.html?id=42">
            <article>
              <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
              <h3 class="productName">Kanap name1</h3>
              <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
            </article>
          </a> */