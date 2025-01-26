// Get cart from localStorage or initialize empty
// At the top of cart.js
console.log('Available products:', products);

function renderCartItems() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return; // Guard clause if not on cart page
    
    cartContainer.innerHTML = ''; // Clear previous content

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
                <p class="text-gray-500">Your cart is empty</p>
                <a href="../index.html" class="text-blue-600 hover:underline mt-2 inline-block">
                    Continue Shopping
                </a>
            </div>
        `;
        updateCartSummary();
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'bg-white rounded-xl p-4 flex items-center gap-4 mb-4';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
                <h3 class="font-medium text-gray-900">${item.name}</h3>
                <p class="text-gray-500 text-sm">${item.category}</p>
                <div class="flex items-center mt-2">
                    <button onclick="updateQuantity(${item.id}, 'decrease')" 
                            class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                        <i class="fas fa-minus text-sm"></i>
                    </button>
                    <span class="mx-4">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 'increase')" 
                            class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                        <i class="fas fa-plus text-sm"></i>
                    </button>
                </div>
            </div>
            <div class="text-right">
                <p class="font-semibold text-lg">৳${(item.price * item.quantity).toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})" 
                        class="text-red-500 hover:text-red-600 mt-2">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    updateCartSummary();
}

// Function to add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        console.log('Cart after adding:', cart); // Debug log
        showNotification('Product added to cart!');
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Saved cart to localStorage:', JSON.parse(localStorage.getItem('cart'))); // Debug log
}

function updateQuantity(productId, action) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity -= 1;
        }
        saveCart();
        renderCartItems();
        updateCartCount();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
    updateCartCount();
    showNotification('Item removed from cart');
}

function updateCartSummary() {
    const subtotal = calculateSubtotal();
    const shipping = cart.length > 0 ? 5.00 : 0;
    const total = subtotal + shipping;

    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = `৳${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `৳${shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `৳${total.toFixed(2)}`;
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    console.log('Initial localStorage cart:', savedCart);
    
    try {
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('Parsed cart:', cart);
        } else {
            cart = [];
        }
        renderCartItems();
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
        renderCartItems();
    }

    updateCartCount();
    
    // Setup checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty');
                return;
            }
            
            const cartSummary = {
                subtotal: calculateSubtotal(),
                shipping: cart.length > 0 ? 5.00 : 0,
                total: calculateSubtotal() + (cart.length > 0 ? 5.00 : 0)
            };
            localStorage.setItem('cartSummary', JSON.stringify(cartSummary));
            
            window.location.href = 'delivery-details.html';
        });
    }
});

// Function to handle checkout process
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showNotification('Please login to continue');
        window.location.href = 'login.html?redirect=cart';
        return;
    }

    // Save cart summary for next steps
    const cartSummary = {
        items: cart,
        subtotal: calculateSubtotal(),
        shipping: cart.length > 0 ? 5.00 : 0,
        total: calculateSubtotal() + (cart.length > 0 ? 5.00 : 0),
        orderId: generateOrderId(),
        date: new Date().toISOString()
    };
    localStorage.setItem('cartSummary', JSON.stringify(cartSummary));

    // Proceed to delivery details
    window.location.href = 'delivery-details.html';
}

// Function to generate order ID
function generateOrderId() {
    return 'ORD' + Date.now().toString().slice(-8);
}

// Function to complete purchase
function completePurchase(deliveryDetails, paymentDetails) {
    const cartSummary = JSON.parse(localStorage.getItem('cartSummary'));
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Create order object
    const order = {
        id: cartSummary.orderId,
        items: cart,
        total: cartSummary.total,
        status: 'Processing',
        date: new Date().toISOString(),
        delivery: deliveryDetails,
        payment: paymentDetails,
        userId: currentUser.id
    };

    // Add order to user's orders
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || { orders: [] };
    userProfile.orders.unshift(order);
    localStorage.setItem('userProfile', JSON.stringify(userProfile));

    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.removeItem('cartSummary');

    // Show success notification
    showNotification('Order placed successfully!');

    // Redirect to order confirmation
    window.location.href = `order-confirmation.html?orderId=${order.id}`;
}

// Function to show notification
function showNotification(message) {
    alert(message); // You can replace this with a better notification system
}

// Function to animate price changes
function animateValue(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const oldValue = parseFloat(element.textContent.replace('৳', ''));
    const duration = 500; // Animation duration in milliseconds
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = oldValue + (newValue - oldValue) * progress;
        element.textContent = `৳${currentValue.toFixed(2)}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
} 