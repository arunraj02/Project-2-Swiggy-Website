document.addEventListener('DOMContentLoaded', function () {
    const signInForm = document.getElementById('signin-form');
    const signUpForm = document.getElementById('signup-form');
    const signInSection = document.querySelector('.sigin-up-container'); // Assuming the sign-in section has this class
    const websiteSection = document.getElementById('website');

    // Initially hide the website section
    websiteSection.style.display = 'none';

    // Function to handle sign in
    signInForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = signInForm.querySelector('.email').value;
        const password = signInForm.querySelector('.password').value;

        // Retrieve users from local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the provided credentials match any user
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            alert('Login successful');
            // Show the website section
            websiteSection.style.display = 'block';
            // Hide the sign-in section
            signInSection.style.display = 'none';
        } else {
            alert('Invalid email or password');
        }
    });

    // Function to handle sign up
    signUpForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = signUpForm.querySelector('.username').value;
        const email = signUpForm.querySelector('.email').value;
        const password = signUpForm.querySelector('.password').value;

        // Validate email address
        if (!email.includes('@')) {
            alert('Please enter a valid email address.');
            return; // Prevent further execution of sign-up process
        }

        // Validate password complexity
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            alert('Password should contain at least one uppercase letter, one lowercase letter, one number, and one symbol, and be at least 8 characters long.');
            return; // Prevent further execution of sign-up process
        }

        // Retrieve users from local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the username already exists
        const existingUser = users.find(user => user.username === username);

        if (existingUser) {
            alert('Username already exists. Please choose a different username.');
        } else {
            // Check if the email already exists
            const existingEmail = users.find(user => user.email === email);

            if (existingEmail) {
                alert('User with this email already exists. Please use a different email.');
            } else {
                // Add the new user to the array
                users.push({ username, email, password });

                // Store updated user data back to local storage
                localStorage.setItem('users', JSON.stringify(users));

                alert('Sign up successful');
            }
        }
    });

    // Hide or show sign-in or sign-up forms based on links clicked
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const loginLink = document.getElementById('login');
    const createLink = document.getElementById('create');

    // Initially show the sign-up form and hide the sign-in form
    signinForm.classList.add('hidden');
    signupForm.classList.remove('hidden');

    // Event listener for the "login" link
    loginLink.addEventListener('click', function (event) {
        event.preventDefault();
        signinForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    });

    // Event listener for the "create" link
    createLink.addEventListener('click', function (event) {
        event.preventDefault();
        signinForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });
});

let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let body = document.querySelector('body');

openShopping.addEventListener('click', () => {
    body.classList.add('active');
});

closeShopping.addEventListener('click', () => {
    body.classList.remove('active');
});

let products = null;

// Get data from JSON file
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
    });

// Show product data in list
function addDataToHTML() {
    let list = document.querySelector('.list');
    list.innerHTML = '';

    // Add new data
    if (products != null) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML =
                `<img src="${product.image}" alt="">
            <h2 class="hotel">${product.hotelName}</h2>
            <h2 class="title">${product.dishName}</h2>
            <div class="price">${product.price}</div>
            <button onclick="addCart(${product.dishId})">Add To Cart</button>`;

            list.appendChild(newProduct);
        });
    }
}

let listCart = [];

// Check cart from cookies
function checkCart() {
    var cookieValue = document.cookie
        .split(';')
        .find(row => row.startsWith('listCart='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    } else {
        listCart = [];
    }
}

checkCart();

// Add item to cart
function addCart(dishId) {
    let productsCopy = JSON.parse(JSON.stringify(products));

    if (!listCart[dishId]) {
        listCart[dishId] = productsCopy.filter(product => product.dishId == dishId)[0];
        listCart[dishId].quantity = 1;
    } else {
        // Increment quantity
        listCart[dishId].quantity++;
    }

    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";

    addCartToHTML();
}

addCartToHTML();

// Add cart items to HTML
function addCartToHTML() {
    let listCard = document.querySelector('.listCard');
    listCard.innerHTML = '';

    let quantity = document.querySelector('.quantity');
    let totalQuantity = 0;

    // If product in cart
    if (listCart) {
        Object.values(listCart).forEach(product => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML =
                    `<div class="hotel">${product.hotelName}</div>
                    <div class="title">${product.dishName}</div>
                    <div class="price">${product.price.toLocaleString()}</div>
                    <div>
                    <button onclick="changeQuantity(${product.dishId}, ${product.quantity - 1})">-</button>
                    <div class="count">${product.quantity}</div>
                    <button onclick="changeQuantity(${product.dishId}, ${product.quantity + 1})">+</button>
                    </div>`;

                listCard.appendChild(newCart);
                totalQuantity += product.quantity;
            }
        })
    }
    quantity.innerText = totalQuantity;
}

// Change quantity of cart item
function changeQuantity(dishId, newQuantity) {
    if (newQuantity <= 0) {
        delete listCart[dishId];
    } else {
        listCart[dishId].quantity = newQuantity;
    }

    // Save new data in cookie
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    // Reload HTML view cart
    addCartToHTML();
}

// Function to render dishes based on the selected category
function renderDishes(category) {
    let list = document.querySelector('.list');
    list.innerHTML = '';

    // Filter products based on the selected category
    let filteredProducts = products.filter(product => product.dishCategory.toLowerCase() === category.toLowerCase());

    // Display filtered products
    filteredProducts.forEach(product => {
        let newProduct = document.createElement('div');
        newProduct.classList.add('item');
        newProduct.innerHTML =
            `<img src="${product.image}" alt="">
            <h2 class="hotel">${product.hotelName}</h2>
            <h2 class="title">${product.dishName}</h2>
            <div class="price">${product.price}</div>
            <button onclick="addCart(${product.dishId})">Add To Cart</button>`;

        list.appendChild(newProduct);
    });

    // Scroll to the list of products
    list.scrollIntoView({ behavior: 'smooth' });
}

// Event listeners for each category
document.querySelector('.pizza').addEventListener('click', function() {
    renderDishes('Pizza');
});

document.querySelector('.biryani').addEventListener('click', function() {
    renderDishes('Biryani');
});

document.querySelector('.burger').addEventListener('click', function() {
    renderDishes('Burger');
});

document.querySelector('.noodles').addEventListener('click', function() {
    renderDishes('Noodles');
});

document.querySelector('.dosa').addEventListener('click', function() {
    renderDishes('Dosa');
});

document.querySelector('.parotta').addEventListener('click', function() {
    renderDishes('Parotta');
});


//function to filter the restaurants

let restaurants =  [
    {
        dishId: "1",
        image: "Images/salem rr.jpg",
        hotelName: "Salem RR Biryani Unavagam",
        dishName: "Chicken Biryani",
        price: "220",
        ratings: "4.3",
        deliveryTime:"25 mins",
        varieties: "Indian,Chinese,Chettinad",
        Category: "Non Veg",
        hotelLocation: "Virugambakkam"
    },
    {
        dishId: "2",
        image: "Images/khalids.jpg",
        hotelName: "Khalids Biryani",
        dishName: "Mutton Biryani",
        price: "280",
        ratings: "3.6",
        deliveryTime:"25 mins",
        varieties: "Indian,Chinese,Desserts",
        Category: "Non Veg",
        hotelLocation: "Chromepet"
    },
    {
        dishId: "3",
        image: "Images/star.jpg",
        hotelName: "Ambur Star Biryani",
        dishName: "Mutton Biryani",
        price: "320",
        ratings: "4.2",
        deliveryTime:"35 mins",
        varieties: "Indian,Chinese,Desserts",
        Category: "Non Veg",
        hotelLocation: "Velacherry"
    },
    {
        dishId: "4",
        image: "Images/biryani.png",
        hotelName: "Mani's Dum Biryani",
        dishName: "Chicken Biryani",
        price: "320",
        ratings: "4.4",
        deliveryTime:"19 mins",
        varieties: "Indian,Chinese,Desserts",
        Category: "Non Veg",
        hotelLocation: "Karapakkam"
    },
    {
        dishId: "5",
        image: "Images/dindigul thalapakatti.jpg",
        hotelName: "Dindigul Thalapakatti",
        dishName: "Chicken 65 Biryani",
        price: "320",
        ratings: "4.3",
        deliveryTime:"16 mins",
        varieties: "Indian,Chinese,Desserts",
        Category: "Non Veg",
        hotelLocation: "Karapakkam"
    },
    {
        dishId: "6",
        image: "Images/biryani 2.jpg",
        hotelName: "Veg Daawot by Behrouz",
        dishName: "Veg Biryani",
        price: "300",
        ratings: "4.3",
        deliveryTime:"15 mins",
        varieties: "Indian,Chinese,Desserts",
        Category: "Pure Veg",
        hotelLocation: "Medavakkam"
    },
    {
        dishId: "7",
        image: "Images/behrouz.jpg",
        hotelName: "Behrouz Biryani",
        dishName: "Paneer Biryani",
        price: "420",
        ratings: "4.3",
        deliveryTime:"14 mins",
        varieties: "Indian,Chinese,Desserts",
        Category: "Non Veg",
        hotelLocation: "Virugambakkam"
    },
    {
        dishId: "8",
        image: "Images/biryani 1.jpg",
        hotelName: "Rasavid",
        dishName: "Chicken Biryani",
        price: "320",
        ratings: "3.6",
        deliveryTime:"13 mins",
        varieties: "Indian,Chinese,Desserts",
        Category: "Non Veg",
        hotelLocation: "Vinayaganagar"
    },
    {
        dishId: "9",
        image: "Images/dominos.jpg",
        hotelName: "Dominos Pizza",
        dishName: "Chicken Pepperoni Gourmet Pizza",
        price: "699",
        ratings: "4.3",
        deliveryTime:"12 mins",
        varieties: "Pizzas, Italian",
        Category: "Non Veg",
        hotelLocation: "Shollinganallur"
    },
    {
        dishId: "10",
        image: "Images/pizza.png",
        hotelName: "La Pino'z Pizza",
        dishName: "Farm Villa Pizza",
        price: "286",
        ratings: "4.3",
        deliveryTime:"11 mins",
        varieties: "Pizzas, Pastas",
        Category: "Non Veg",
        hotelLocation: "Velacherry"
    },
    {
        dishId: "11",
        image: "Images/pizza 2.jpg",
        hotelName: "The Secret Story",
        dishName: "Chicken Pizza",
        price: "320",
        ratings: "4.3",
        deliveryTime:"10 mins",
        varieties: "Pizzas, Pasta",
        Category: "Non Veg",
        hotelLocation: "Karapakkam"
    },
    {
        dishId: "12",
        image: "Images/pizza 3.jpg",
        hotelName: "Ovenfresh Pizzas",
        dishName: "Tandoori Chicken Pizza",
        price: "299",
        ratings: "4.3",
        deliveryTime:"37 mins",
        varieties: "Bakery, Pizzas",
        Category: "Non Veg",
        hotelLocation: "Perumbakkam"
    },
    {
        dishId: "13",
        image: "Images/pizza 4.jpg",
        hotelName: "Tuscana Pizzeria",
        dishName: "Agnello Pizza",
        price: "625",
        ratings: "3.9",
        deliveryTime:"33 mins",
        varieties: "Itallian",
        Category: "Non Veg",
        hotelLocation: "Akkarai"
    },
    {
        dishId: "14",
        image: "Images/burger king.jpg",
        hotelName: "Burger King",
        dishName: "Crispy Chicken Double Patty Burger",
        price: "229",
        ratings: "4.3",
        deliveryTime:"32 mins",
        varieties: "Burgers, American",
        Category: "Non Veg",
        hotelLocation: "Virugambakkam"
    },
    {
        dishId: "15",
        image: "Images/pizza 2.jpg",
        hotelName: "Wendy's Flavor Fresh Burgers",
        dishName: "Nachoburg Cheese Chicken Burger",
        price: "229",
        ratings: "3.5",
        deliveryTime:"24 mins",
        varieties: "Burgers, American",
        Category: "Non Veg",
        hotelLocation: "Medavakkam"
    },
    {
        dishId: "16",
        image: "Images/pizza 3.jpg",
        hotelName: "BurgerMan",
        dishName: "Crispy Chicken Burger",
        price: "148",
        ratings: "4.3",
        deliveryTime:"44 mins",
        varieties: "American, Burgers",
        Category: "Non Veg",
        hotelLocation: "Thuraipakkam"
    },
    {
        dishId: "17",
        image: "Images/pizza 4.jpg",
        hotelName: "The High Joint",
        dishName: "Schezwan Veg Burger",
        price: "175",
        ratings: "4.6",
        deliveryTime:"38 mins",
        varieties: "American, Burgers",
        Category: "Non Veg",
        hotelLocation: "Navallur"
    },
    {
        dishId: "18",
        image: "Images/chinese.png",
        hotelName: "Hotel Vasantham",
        dishName: "Veg Noodles",
        price: "120",
        ratings: "4.3",
        deliveryTime:"17 mins",
        varieties: "South Indian, Chinese",
        Category: "Pure Veg",
        hotelLocation: "Sholinganallur"
    },
    {
        dishId: "19",
        image: "Images/noodles 1.jpg",
        hotelName: "Guntur Gongura",
        dishName: "Gobi Noodles",
        price: "120",
        ratings: "4.3",
        deliveryTime:"29 mins",
        varieties: "Andhra, North Indian",
        Category: "Non Veg",
        hotelLocation: "Virugambakkam"
    },
    {
        dishId: "20",
        image: "Images/noodles 2.jpg",
        hotelName: "SSS HYDERABAD BRIYANI",
        dishName: "Chicken Noodles",
        price: "220",
        ratings: "4.3",
        deliveryTime:"20 mins",
        varieties: "Indian,Chinese,Desserts",
        Category: "Non Veg",
        hotelLocation: "OMR Navalur"
    },
    {
        dishId: "21",
        image: "Images/noodles 3.jpg",
        hotelName: "Shawarma & Grill",
        dishName: "Chicken Noodles",
        price: "200",
        ratings: "3.7",
        deliveryTime:"36 mins",
        varieties: "Indian,Chinese,Desserts",
        Category: "Non Veg",
        hotelLocation: "Virugambakkam"
    },
    {
        dishId: "22",
        image: "Images/noodles 4.jpg",
        hotelName: "Arab Station",
        dishName: "Prawn Noodles",
        price: "320",
        ratings: "3.8",
        deliveryTime:"28 mins",
        varieties: "Arabian, North Indian",
        Category: "Non Veg",
        hotelLocation: "Kanathur"
    },
    {
        dishId: "23",
        image: "Images/noodles 5.jpg",
        hotelName: "Chai Galli",
        dishName: "Veg Noodles",
        price: "320",
        ratings: "4.3",
        deliveryTime:"21 mins",
        varieties: "Fast Food",
        Category: "Non Veg",
        hotelLocation: "Virugambakkam"
    },
    {
        dishId: "24",
        image: "Images/noodles 6.jpg",
        hotelName: "Hotel Aathira's",
        dishName: "Chicken Noodles",
        price: "120",
        ratings: "3.6",
        deliveryTime:"23 mins",
        varieties: "Chinese, North Indian",
        Category: "Non Veg",
        hotelLocation: "Karapakkam"
    },
    {
        dishId: "25",
        image: "Images/dosa 1.jpg",
        hotelName: "Shree Chaats",
        dishName: "Dosa",
        price: "120",
        ratings: "4.4",
        deliveryTime:"46 mins",
        varieties: "Chaat, Sweets",
        Category: "Pure Veg",
        hotelLocation: "Sri Sowdeswari Nagar"
    },
    {
        dishId: "26",
        image: "Images/Mysore Masala Dosa.jpg",
        hotelName: "Pure Veg Meals By Lunchbox",
        dishName: "Mysore Masala Dosa",
        price: "220",
        ratings: "4.3",
        deliveryTime:"24 mins",
        varieties: "Indian,Chinese,Desserts",
        Category: "Pure Veg",
        hotelLocation: "Virugambakkam"
    },
    {
        dishId: "27",
        image: "Images/cheese dosa.jpg",
        hotelName: "Hotel Vasantha Bhavan",
        dishName: "Cheese Dosa",
        price: "160",
        ratings: "4.3",
        deliveryTime:"25 mins",
        varieties: "South Indian, Biryani",
        Category: "Pure Veg",
        hotelLocation: "ECR-Kottivakkam"
    },
    {
        dishId: "28",
        image: "Images/Onion dosa.jpg",
        hotelName: "Hot Chips",
        dishName: "Onion Dosa",
        price: "90",
        ratings: "4.2",
        deliveryTime:"21 mins",
        varieties: "North Indian, South Indian",
        Category: "Pure Veg",
        hotelLocation: "Karapakkam"
    },
    {
        dishId: "29",
        image: "Images/paneer dosa.jpg",
        hotelName: "SAI SAKSHI BHAVAN",
        dishName: "Paneer Dosa",
        price: "320",
        ratings: "3.9",
        deliveryTime:"32 mins",
        varieties: "Indian,Chinese,Desserts",
        Category: "Pure Veg",
        hotelLocation: "Sholinganallur"
    },
    {
        dishId: "30",
        image: "Images/dosa.jpg",
        hotelName: "Astoria Veg",
        dishName: "Plain Dosa",
        price: "65",
        ratings: "4.4",
        deliveryTime:"35 mins",
        varieties: "Indian,Chinese,Desserts",
        Category: "Pure Veg",
        hotelLocation: "Karapakkam"
    }
];

// Function to filter restaurants by category
function filterByCategory(category) {
    return restaurants.filter(restaurant => restaurant.Category === category);
}

// Function to filter restaurants by delivery time
function filterByDeliveryTime() {
    return restaurants.slice().sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
}

// Function to filter restaurants by ratings
function filterByRatings(minRating) {
    return restaurants.filter(restaurant => parseFloat(restaurant.ratings) >= minRating);
}

// Function to sort restaurants by price (low to high)
function sortByPriceLowToHigh() {
    return restaurants.slice().sort((a, b) => parseInt(a.price) - parseInt(b.price));
}

// Function to sort restaurants by price (high to low)
function sortByPriceHighToLow() {
    return restaurants.slice().sort((a, b) => parseInt(b.price) - parseInt(a.price));
}

// Function to display filtered restaurants
function displayFilteredRestaurants(filteredRestaurants) {
    let restaurantList = document.querySelector('.restaurantlist');
    restaurantList.innerHTML = ""; // Clear previous content

    filteredRestaurants.forEach(restaurant => {
        let restaurantCard = document.createElement('div');
        restaurantCard.classList.add('restaurant-card');

        restaurantCard.innerHTML = `
            <img src="${restaurant.image}" alt="${restaurant.hotelName}">
            <h2>${restaurant.hotelName}</h2>
            <p>${restaurant.dishName}</p>
            <p>Price: ${restaurant.price}</p>
            <p>Ratings: ${restaurant.ratings}</p>
            <p>Delivery Time: ${restaurant.deliveryTime}</p>
            <p>Varieties: ${restaurant.varieties}</p>
            <p>Category: ${restaurant.Category}</p>
            <p>Location: ${restaurant.hotelLocation}</p>
        `;

        restaurantList.appendChild(restaurantCard);
    });
}

// Event listener for filter buttons
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('restaurant-selection').addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            let option = event.target.textContent;
            let filteredRestaurants;

            switch (option) {
                case 'Cost: Low to High':
                    filteredRestaurants = sortByPriceLowToHigh();
                    break;
                case 'Cost: High to Low':
                    filteredRestaurants = sortByPriceHighToLow();
                    break;
                case 'Fast Delivery':
                    filteredRestaurants = filterByDeliveryTime();
                    break;
                case 'Ratings 4.0+':
                    filteredRestaurants = filterByRatings(4.0);
                    break;
                case 'Pure Veg':
                    filteredRestaurants = filterByCategory('Pure Veg');
                    break;
                case 'Non Veg':
                    filteredRestaurants = filterByCategory('Non Veg');
                    break;
                default:
                    filteredRestaurants = restaurants;
                    break;
            }

            displayFilteredRestaurants(filteredRestaurants);
        }
    });

    // Display all restaurants initially
    displayFilteredRestaurants(restaurants);
});

function handleCheckout() {
    // Retrieve the list of products from localStorage or any other storage mechanism
    let productsInCart = JSON.stringify(listCards);
    
    // Store the products in sessionStorage to pass them to the checkout page
    sessionStorage.setItem('productsInCart', productsInCart);
}