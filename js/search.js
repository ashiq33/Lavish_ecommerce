let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

function renderRecentSearches() {
    const container = document.getElementById('recentSearches');
    const searchesHTML = recentSearches.map(term => `
        <button onclick="searchProducts('${term}')" 
                class="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
            ${term}
        </button>
    `).join('');
    
    container.querySelector('div').innerHTML = searchesHTML;
}

function addToRecentSearches(term) {
    if (!term) return;
    
    recentSearches = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    renderRecentSearches();
}

function searchProducts(searchTerm) {
    const resultsContainer = document.getElementById('searchResults');
    const noResultsElement = document.getElementById('noResults');
    
    // If searchTerm is provided, update the input
    if (searchTerm) {
        document.getElementById('searchInput').value = searchTerm;
    } else {
        searchTerm = document.getElementById('searchInput').value;
    }

    // Add to recent searches
    addToRecentSearches(searchTerm);

    // Filter products
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Show/hide no results message
    noResultsElement.classList.toggle('hidden', filteredProducts.length > 0);
    
    // Render results
    renderSearchResults(filteredProducts);
}

// Render search results
function renderSearchResults(products) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = products.map(product => `
        <div class="bg-white rounded-xl p-4 flex items-center gap-4">
            <img src="${product.image}" alt="${product.name}" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
                <h3 class="font-medium text-gray-900">${product.name}</h3>
                <p class="text-sm text-gray-500">${product.category}</p>
                <div class="flex items-center justify-between mt-2">
                    <span class="font-bold text-blue-600">৳${product.price.toFixed(2)}</span>
                    <button onclick="addToCart(${product.id})" 
                            class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize search page
document.addEventListener('DOMContentLoaded', () => {
    renderRecentSearches();
    
    // Search input handler
    const searchInput = document.getElementById('searchInput');
    let debounceTimeout;
    
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            searchProducts();
        }, 300);
    });
}); 