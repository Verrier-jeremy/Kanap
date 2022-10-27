// Recupération de l'id commande et mise en page du numerode commande
const params = new URL(document.location).searchParams;
const orderId = params.get("orderId");
console.log(orderId);

document.getElementById('orderId').innerText = `${orderId}`;