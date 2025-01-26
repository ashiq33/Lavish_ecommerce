// Toggle favorite status
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    if (index === -1) {
        favorites.push(productId);
        showNotification('Added to favorites');
    } else {
        favorites.splice(index, 1);
        showNotification('Removed from favorites');
    }
    saveFavorites();
    updateFavoriteUI(productId);
    updateFavoriteCount();
    
    // If we're on the favorites page, re-render the products
    if (document.getElementById('favoriteProducts')) {
        renderFavorites();
    }
}

// Render favorite products
function renderFavorites() {
    const favoriteContainer = document.getElementById('favoriteProducts');
    if (!favoriteContainer) return;

    favoriteContainer.innerHTML = '';

    if (favorites.length === 0) {
        favoriteContainer.innerHTML = `
            <div class="w-full h-screen flex items-center justify-center -mt-20">
                <div class="text-center px-4 max-w-sm mx-auto">
                    <i class="far fa-heart text-gray-300 text-6xl mb-6"></i>
                    <p class="text-gray-500 text-lg mb-6">Your favorites list is empty</p>
                    <a href="../index.html" 
                       class="inline-block px-8 py-3 text-blue-600 hover:text-blue-700 hover:underline">
                        Continue Shopping
                    </a>
                </div>
            </div>
        `;
        return;
    }

    const favoriteItems = products.filter(product => favorites.includes(product.id));

    favoriteItems.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition';
        productCard.innerHTML = `
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" 
                     class="w-full h-48 object-cover group-hover:scale-105 transition duration-300">
                <button onclick="toggleFavorite(${product.id})" 
                        class="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:text-red-600 transition">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="p-4">
                <h3 class="font-medium text-gray-900 mb-2">${product.name}</h3>
                <p class="text-sm text-gray-500 mb-2">${product.category}</p>
                <p class="text-sm text-gray-600 mb-4 line-clamp-2">${product.description}</p>
                <div class="flex items-center justify-between mt-4">
                    <span class="font-bold text-blue-600">৳${product.price.toFixed(2)}</span>
                    <div class="flex gap-2">
                        <button onclick="addToCart(${product.id})" 
                                class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        favoriteContainer.appendChild(productCard);
    });
}

// Update favorite count in header
function updateFavoriteCount() {
    const favoriteCount = document.querySelector('.fa-heart + span');
    if (favoriteCount) {
        favoriteCount.textContent = favorites.length;
    }
}

// Save favorites to localStorage
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

//favourite buttons
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

// Initialize favorites page
document.addEventListener('DOMContentLoaded', () => {
    renderFavorites();
    updateFavoriteCount();
}); 