document.addEventListener('DOMContentLoaded', function () {
    // Get the order details from localStorage (assuming it's stored in localStorage)
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails')) || [];

    // Function to calculate the total amount for all items in the cart (only using total_price)
    const calculateTotalAmount = () => {
        return orderDetails.reduce((total, item) => {
            // Ensure valid total_price
            const totalPrice = isNaN(item.total_price) ? 0 : item.total_price;
            return total + totalPrice;
        }, 0);
    };

    // Function to update the total amount displayed
    const updateTotalAmountDisplay = () => {
        const totalAmount = calculateTotalAmount();
        document.getElementById('total-amount').textContent = `₱${totalAmount.toFixed(2)}`;
    };

    // Populate the order details section with items from localStorage
    const orderItemsContainer = document.getElementById('order-details');
    orderItemsContainer.innerHTML = ''; // Clear any existing rows

    orderDetails.forEach(item => {
        // Calculate total price for each item
        item.total_price = item.price * item.quantity;

        const row = document.createElement('div');
        row.classList.add('order-item');
        row.innerHTML = `
            <div>
                <img src="${item.image}" alt="${item.product_name}" width="50" height="50">
            </div>
            <div>
                <strong>Product Name: </strong>${item.product_name}
            </div>
            <div>
                <strong>Quantity: </strong>${item.quantity}
            </div>
            <div>
                <strong>Total Price: </strong>₱${(item.total_price).toFixed(2)}
            </div>
            <hr>
        `;
        orderItemsContainer.appendChild(row);
    });

    // Initial total amount calculation and display
    updateTotalAmountDisplay();

    // Handle the form submission with AJAX
    $('#checkout-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        const password = $('#password').val();
        const orderDetails = $('#order-details').val();

        // Send data to the server using AJAX
        $.ajax({
            url: 'process_order.php', // PHP file to process the order
            type: 'POST',
            data: {
                password: password,
                order_details: orderDetails
            },
            success: function (response) {
                $('#message').text(response); // Show the response message

                // If the order is successful, redirect to the purchase page after a delay
                if (response.includes('Order placed successfully')) {
                    setTimeout(function () {
                        window.location.href = 'purchase.html'; // Redirect to purchase page
                    }, 2000); // Wait 2 seconds before redirecting
                }
            },
            error: function () {
                $('#message').text("There was an error processing your order.");
            }
        });
    });
});
