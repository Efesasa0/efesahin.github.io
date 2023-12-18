// Get the modal
var modal = document.getElementById('pdfModal');

// Get the button that opens the modal
var btn = document.querySelector('.navbar a[href="./assets/content/Efe_Sahin_Raw.pdf"]');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function (event) {
    event.preventDefault();
    modal.style.display = "block";
    setTimeout(function () { // Timeout to allow for CSS transition
        modal.classList.add("show");
    }, 10); // Start the show animation shortly after displaying the modal
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.classList.remove("show");
    setTimeout(function () { // Timeout to allow for CSS transition
        modal.style.display = "none";
    }, 250); // Delay hiding the modal until after the transition
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.classList.remove("show");
        setTimeout(function () { // Timeout to allow for CSS transition
            modal.style.display = "none";
        }, 250); // Delay hiding the modal until after the transition
    }
}