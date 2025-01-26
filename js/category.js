// Get category from the current page URL
function getCurrentCategory() {
    const path = window.location.pathname;
    const category = path.split('/').pop().replace('.html', '');
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Filter products by category
function filterProducts(category) {
    return products.filter(product => product.category === category);
}

// Render products grid
function renderProducts(filteredProducts) {
    const productGrid = document.getElementById('productGrid');
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <i class="fas fa-box-open text-gray-300 text-5xl mb-4"></i>
                <p class="text-gray-500">No products found in this category</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition">
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" 
                     class="w-full h-48 object-cover group-hover:scale-105 transition duration-300">
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
                    <div>
                        <span class="font-bold text-blue-600">৳${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `
                            <span class="text-sm text-gray-400 line-through ml-2">$${product.oldPrice}</span>
                        ` : ''}
                    </div>
                    <button onclick="addToCart(${product.id})" 
                            class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize category page
document.addEventListener('DOMContentLoaded', () => {
    const category = getCurrentCategory();
    const filteredProducts = filterProducts(category);
    renderProducts(filteredProducts);
}); 