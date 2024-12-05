let cart = []; // Array to store items in the cart

// Initialize the cart display to start with 0 items
document.addEventListener('DOMContentLoaded', function () {
    recalculateCart(); // Update the cart count and total price on page load
});

// Function to handle quantity changes (Increase or Decrease)
function changeQuantity(event, amount) {
    let quantityInput = event.target.parentElement.querySelector('.quantity');
    let currentQuantity = parseInt(quantityInput.value);

    // Ensure quantity starts from 0 and never goes below 0
    let newQuantity = Math.max(0, currentQuantity + amount);
    quantityInput.value = newQuantity;

    // Get the price of the product (strip the ₱ symbol before parsing)
    let priceText = event.target.parentElement.previousElementSibling.textContent;
    let price = parseFloat(priceText.replace('₱', '').trim()); // Strip the ₱ symbol and parse as number

    // Update the total price for this product
    let itemTotalPrice = newQuantity * price;
    event.target.parentElement.nextElementSibling.textContent = formatPrice(itemTotalPrice); // Format the price

    // Update the cart
    updateCart(price, newQuantity);
}

// Update the cart data (add or update an item in the cart)
function updateCart(price, quantity) {
    if (quantity === 0) {
        // Remove the item if quantity is 0
        cart = cart.filter(item => item.price !== price);
    } else {
        // Check if the product already exists in the cart
        let productIndex = cart.findIndex(item => item.price === price);

        if (productIndex !== -1) {
            // Update the product's quantity
            cart[productIndex].quantity = quantity;
        } else {
            // Add a new product to the cart
            cart.push({ price: price, quantity: quantity });
        }
    }

    recalculateCart(); // Update cart totals
}

// Function to recalculate the total quantity and price in the cart
function recalculateCart() {
    let totalQuantity = 0;
    let totalPrice = 0;

    // Calculate total quantity and price
    cart.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    // Update cart quantity and total price in the UI
    document.getElementById('cart-count').textContent = totalQuantity;
    document.getElementById('total-price').textContent = formatPrice(totalPrice);

    // Save cart data to localStorage for the checkout page
    localStorage.setItem('orderDetails', JSON.stringify(cart.map(item => ({
        price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity
    }))));
}

// Helper function to format price
function formatPrice(amount) {
    return '₱' + amount.toFixed(2); // Format as PHP currency
}
