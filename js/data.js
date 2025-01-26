// Sample product data
const products = [
    {
        id: 1,
        name: "Parachute Jacket",
        price: 3200,
        image: "../Images/Men/img1.jpeg",
        category: "Men",
        isHighlight: true,
        description: "Premium quality parachute jacket designed for all seasons. Features water-resistant material, adjustable hood, multiple pockets, and breathable mesh lining. Perfect for outdoor activities and casual wear.",
        shortDescription: "Comfortable and stylish parachute jacket for all seasons...",
        specifications: {
            material: "100% Polyester",
            fit: "Regular Fit",
            care: "Machine washable",
            features: ["Water-resistant", "Adjustable hood", "Multiple pockets"]
        }
    },
    {
        id: 2,
        name: "Relax jacket",
        price: 1820,
        image: "../Images/Women/img1.jpg",
        category: "Women",
        isNewArrival: true,
        description: "Casual relax fit jacket perfect for daily wear"
    },
    {
        id: 3,
        name: "Villa Dress",
        price: 1350,
        image: "../images/Women/img2.jpg",
        category: "Women",
        description: "Elegant villa design perfect for special occasions"
    },
    {
        id: 4,
        name: "Kids Denim Jacket",
        price: 1250,
        image: "../images/Kids/img1.jpg",
        category: "Kids",
        description: "Stylish denim jacket for kids"
    },
    {
        id: 5,
        name: "Running Shoes",
        price: 1299,
        image: "../images/Shoes/img1.jpg",
        category: "Shoes",
        description: "Comfortable running shoes with great support"
    },
    {
        id: 6,
        name: "Leather Watch",
        price: 699,
        image: "../images/Watch/img1.jpg",
        category: "Accessories",
        description: "Classic leather watch with modern features"
    },
    {
        id: 7,
        name: "Summer Dress",
        price: 990,
        image: "../images/Women/img3.jpg",
        category: "Women",
        isHighlight: true,
        description: "Light and breezy summer dress perfect for warm days"
    },
    {
        id: 8,
        name: "Smart Watch",
        price: 1290,
        image: "../images/Watch/img2.jpg",
        category: "Accessories",
        isNewArrival: true,
        description: "Latest smartwatch with health tracking features"
    },
    {
        id: 9,
        name: "Running Shorts",
        price: 3499,
        image: "../Images/Men/img2.jpg",
        category: "Men",
        isHighlight: true,
        description: "Comfortable running shorts with moisture-wicking technology"
    },
    {
        id: 10,
        name: "Designer Handbag",
        price: 1599,
        image: "../Images/Bags/img1.jpg",
        category: "Accessories",
        isNewArrival: true,
        description: "Elegant designer handbag for any occasion"
    }
    // Add more products as needed
];

// Initialize cart and favorites
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Function to render products in sections
function renderProducts() {
    // Render highlight products
    const highlightSection = document.getElementById('highlightProducts');
    if (!highlightSection) return;
    
    const highlightProducts = products.filter(product => product.isHighlight);
    renderProductsToSection(highlightProducts, highlightSection);
    
    // Render new arrivals
    const newArrivalsSection = document.getElementById('newArrivals');
    if (newArrivalsSection) {
        const newArrivals = products.filter(product => product.isNewArrival);
        renderProductsToSection(newArrivals, newArrivalsSection);
    }
}

// Helper function to render products to a section
function renderProductsToSection(productsToRender, container) {
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition product-card cursor-pointer';
        productCard.setAttribute('data-product-id', product.id);
        productCard.onclick = (e) => {
            // Prevent clicking the card when clicking buttons inside it
            if (!e.target.closest('button')) {
                showProductDetails(product.id);
            }
        };
        productCard.innerHTML = `
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" 
                     class="w-full h-48 md:h-56 lg:h-64 object-cover group-hover:scale-105 transition duration-300">
                <button onclick="toggleFavorite(${product.id})" 
                        class="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition">
                    <i class="${favorites.includes(product.id) ? 'fas text-red-500' : 'far'} fa-heart"></i>
                </button>
                ${product.discount ? `
                    <span class="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        -${product.discount}%
                    </span>
                ` : ''}
            </div>
            <div class="p-4">
                <div class="flex items-center justify-between mb-1">
                    <h3 class="font-medium text-gray-900">${product.name}</h3>
                    <div class="flex items-center">
                        <i class="fas fa-star text-yellow-400 text-sm"></i>
                        <span class="text-sm text-gray-600 ml-1">4.5</span>
                    </div>
                </div>
                <p class="text-sm text-gray-500 mb-3">${product.category}</p>
                <div class="flex items-center justify-between">
                    <span class="font-bold text-blue-600">৳${product.price.toFixed(2)}</span>
                    <button onclick="addToCart(${product.id})" 
                            class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
}

// Function to add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Get latest cart from localStorage
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        // Only call renderCartItems if we're on the cart page
        if (document.getElementById('cartItems')) {
            renderCartItems();
        }
        showNotification('Product added to cart!');
    }
}

// Function to highlight cart icon when item is added
function highlightCartIcon() {
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        cartIcon.classList.add('text-blue-600', 'scale-110');
        setTimeout(() => {
            cartIcon.classList.remove('text-blue-600', 'scale-110');
        }, 300);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Shared notification function
function showNotification(message) {
    // You can implement a more sophisticated notification system
    alert(message);
}

// Update counts in header
function updateCounts() {
    updateCartCount();
    updateFavoriteCount();
}

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.fa-shopping-cart + span');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Update favorite count
function updateFavoriteCount() {
    const favoriteCount = document.querySelector('.fa-heart + span');
    if (favoriteCount) {
        favoriteCount.textContent = favorites.length;
    }
}

// Add this function to handle favorites
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    if (index === -1) {
        favorites.push(productId);
        if (document.getElementById('favoriteProducts')) {
            renderFavorites();
        }
        showNotification('Added to favorites');
    } else {
        favorites.splice(index, 1);
        if (document.getElementById('favoriteProducts')) {
            renderFavorites();
        }
        showNotification('Removed from favorites');
    }
    saveFavorites();
    updateFavoriteUI(productId);
    updateFavoriteCount();
}

// Update favorite button UI
function updateFavoriteUI(productId) {
    const buttons = document.querySelectorAll(`button[onclick="toggleFavorite(${productId})"]`);
    buttons.forEach(button => {
        const icon = button.querySelector('i');
        if (favorites.includes(productId)) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            button.classList.add('text-red-500');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            button.classList.remove('text-red-500');
        }
    });
}

// Function to render cart items
function renderCartItems() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

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
        cartItem.className = 'bg-white rounded-xl p-4 flex items-center gap-4 mb-4 transform transition-all duration-300';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
                <h3 class="font-medium text-gray-900">${item.name}</h3>
                <p class="text-gray-500 text-sm">${item.category}</p>
                <div class="flex items-center mt-2">
                    <button onclick="updateQuantity(${item.id}, 'decrease')" 
                            class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                        <i class="fas fa-minus text-sm"></i>
                    </button>
                    <input type="number" 
                           value="${item.quantity}" 
                           min="1" 
                           onchange="updateQuantityDirect(${item.id}, this.value)"
                           class="mx-2 w-16 text-center border rounded-lg">
                    <button onclick="updateQuantity(${item.id}, 'increase')" 
                            class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                        <i class="fas fa-plus text-sm"></i>
                    </button>
                </div>
            </div>
            <div class="text-right">
                <div class="flex flex-col items-end">
                    <span class="text-sm text-gray-500">Price per item</span>
                    <p class="font-semibold">৳${item.price.toFixed(2)}</p>
                </div>
                <div class="flex flex-col items-end mt-2">
                    <span class="text-sm text-gray-500">Subtotal</span>
                    <p class="font-semibold text-lg text-blue-600">৳${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="flex gap-2 mt-3">
                    <button onclick="toggleFavorite(${item.id})" 
                            class="${favorites.includes(item.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-600 transition">
                        <i class="${favorites.includes(item.id) ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button onclick="removeFromCart(${item.id})" 
                            class="text-red-500 hover:text-red-600 transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    updateCartSummary();
}

// Function to update quantity directly through input
function updateQuantityDirect(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity < 1) return;

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        saveCart();
        renderCartItems();
        updateCartCount();
    }
}

// Function to update cart summary with animation
function updateCartSummary() {
    const subtotal = calculateSubtotal();
    const shipping = cart.length > 0 ? 5.00 : 0;
    const total = subtotal + shipping;

    animateValue('subtotal', subtotal);
    animateValue('shipping', shipping);
    animateValue('total', total);
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

    requestAnimationFrame(update);
}

// Calculate subtotal
function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Function to update quantity
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

// Function to remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
    updateCartCount();
    showNotification('Item removed from cart');
}

// Initialize the app with cart data
document.addEventListener('DOMContentLoaded', () => {
    // Only call renderProducts if we're on the main page
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        renderProducts();
    }
    updateCartCount();
    updateFavoriteCount();
    renderCartItems();
});

// Function to handle search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    
    // If search term is empty, hide the results
    if (!searchTerm) {
        searchResults.classList.add('hidden');
        return;
    }

    // Filter products based on search term
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );

    // Show results container
    searchResults.classList.remove('hidden');
    
    // Render results
    if (filteredProducts.length === 0) {
        searchResults.innerHTML = `
            <div class="text-center py-4">
                <p class="text-gray-500">No products found</p>
            </div>
        `;
    } else {
        searchResults.innerHTML = filteredProducts.map(product => `
            <a href="#" onclick="selectProduct(${product.id}); return false;" 
               class="flex items-center gap-3 p-2 hover:bg-gray-50 transition rounded-lg">
                <img src="${product.image}" alt="${product.name}" 
                     class="w-12 h-12 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-medium text-gray-900">${product.name}</h4>
                    <p class="text-sm text-gray-500">${product.category}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-blue-600">৳${product.price}</p>
                </div>
            </a>
        `).join('');
    }
}

// Function to handle product selection from search
function selectProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Add to recent searches
        addToRecentSearches(product.name);
        
        // Clear search input and hide results
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        if (searchInput) searchInput.value = '';
        if (searchResults) searchResults.classList.add('hidden');
        
        // Scroll to product or handle product selection
        scrollToProduct(productId);
    }
}

// Function to add to recent searches
function addToRecentSearches(term) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    recentSearches = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

// Function to scroll to product
function scrollToProduct(productId) {
    const productElement = document.querySelector(`[data-product-id="${productId}"]`);
    if (productElement) {
        productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        productElement.classList.add('highlight-product');
        setTimeout(() => {
            productElement.classList.remove('highlight-product');
        }, 2000);
    }
}

// Function to handle click outside search results
function handleClickOutside(event) {
    const searchResults = document.getElementById('searchResults');
    const searchInput = document.getElementById('searchInput');
    
    if (searchResults && searchInput && 
        !searchResults.contains(event.target) && 
        !searchInput.contains(event.target)) {
        searchResults.classList.add('hidden');
    }
}

// Add this function to handle description expansion
function toggleDescription(productId) {
    const descElement = document.querySelector(`[data-desc-id="${productId}"]`);
    const btnElement = document.querySelector(`[data-desc-btn-id="${productId}"]`);
    
    if (descElement.classList.contains('line-clamp-2')) {
        descElement.classList.remove('line-clamp-2');
        btnElement.innerHTML = '<i class="fas fa-chevron-up ml-1"></i> Show Less';
    } else {
        descElement.classList.add('line-clamp-2');
        btnElement.innerHTML = '<i class="fas fa-chevron-down ml-1"></i> Read More';
    }
}

// Add this function to handle product details modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.id = 'productModal';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" 
                     class="w-full h-64 md:h-80 object-cover rounded-t-2xl">
                <button onclick="closeProductModal()"
                        class="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition">
                    <i class="fas fa-times text-gray-800"></i>
                </button>
                <button onclick="toggleFavorite(${product.id})" 
                        class="absolute top-4 right-16 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-red-500 transition">
                    <i class="${favorites.includes(product.id) ? 'fas text-red-500' : 'far'} fa-heart"></i>
                </button>
            </div>
            
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-2xl font-semibold text-gray-900">${product.name}</h2>
                    <div class="flex items-center gap-2">
                        <div class="flex items-center">
                            <i class="fas fa-star text-yellow-400"></i>
                            <span class="text-gray-600 ml-1">4.5</span>
                        </div>
                        <span class="text-gray-400">|</span>
                        <span class="text-gray-600">150 reviews</span>
                    </div>
                </div>

                <div class="flex items-center justify-between mb-6">
                    <div>
                        <span class="text-2xl font-bold text-blue-600">৳${product.price}</span>
                        ${product.oldPrice ? `
                            <span class="text-lg text-gray-400 line-through ml-2">৳${product.oldPrice}</span>
                        ` : ''}
                    </div>
                    <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        In Stock
                    </span>
                </div>

                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-2">Description</h3>
                    <p class="text-gray-600">${product.description}</p>
                </div>

                ${product.specifications ? `
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold mb-2">Specifications</h3>
                        <div class="grid grid-cols-2 gap-4">
                            ${Object.entries(product.specifications).map(([key, value]) => `
                                <div>
                                    <span class="text-gray-500 capitalize">${key}:</span>
                                    <span class="text-gray-900 ml-2">
                                        ${Array.isArray(value) ? value.join(', ') : value}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="flex gap-4">
                    <button onclick="addToCart(${product.id})" 
                            class="flex-1 bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition">
                        Add to Cart
                    </button>
                    <button onclick="buyNow(${product.id})"
                            class="flex-1 bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

// Function to close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Function to handle buy now
function buyNow(productId) {
    addToCart(productId);
    window.location.href = 'pages/cart.html';
}

// Function to save favorites
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
} 