let listCart = [];

// Function to check cart from cookies
function checkCart() {
    var cookieValue = document.cookie
        .split(';')
        .find(row => row.startsWith('listCart='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }
}

// Function to clear the cart
function clearCart() {
    listCart = [];
    document.cookie = "listCart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

checkCart();
addCartToHTML();

// Function to render cart items
function addCartToHTML() {
    let listCartHTML = document.querySelector('.returncart .checkout-list');
    listCartHTML.innerHTML = '';

    let totalQuantityHTML = document.querySelector('.totalQuantity');
    let totalPriceHTML = document.querySelector('.totalPrice');
    let totalQuantity = 0;
    let totalPrice = 0;

    // If products are in cart
    if (listCart) {
        listCart.forEach(product => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML =
                    `<img src ="${product.image}">
                  <div class= "info">
                  <div class= "hotelname">${product.hotelName}</div>
                  <div class= "dish">${product.dishName}</div>
                  <div class="price">${product.price}</div>
                  </div>
                  <div class="quantity">${product.quantity}</div>
                  <div class="returnPrice">${product.price * product.quantity}</div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity += product.quantity;
                totalPrice += (product.price * product.quantity);
            }
        })
    }
    totalQuantityHTML.innerText = totalQuantity;
    totalPriceHTML.innerText = totalPrice;
}

// Function to handle checkout process
function checkout() {
    // Perform checkout process...

    // After checkout, clear the cart
    clearCart();

    // Update the cart display
    addCartToHTML();

    // Show delivery message
    alert("Thank you for your order! Your order will be delivered soon to the provided address.");
}

// Event listener for the checkout button
document.querySelector('.buttonCheckout').addEventListener('click', function() {
    // Call the checkout function when the checkout button is clicked
    checkout();
});