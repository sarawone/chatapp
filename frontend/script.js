const quoteDiv = document.getElementById("display");
const button = document.getElementById("getQuote");

button.addEventListener("click",() =>{
    fetch("http://localhost:3000/")
    .then(response => response.text())
    .then(data => quoteDiv.textContent = data)
    .catch(error => {
        quoteDiv.textContent = "Error while getting Quotes"
    });
});