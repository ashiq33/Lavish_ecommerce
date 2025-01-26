// Initialize orders page
function initOrders() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || { orders: [] };
    const ordersList = document.getElementById('ordersList');
    const emptyState = document.getElementById('emptyState');

    if (userProfile.orders.length === 0) {
        ordersList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    ordersList.innerHTML = userProfile.orders.map(order => `
        <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="font-medium">Order #${order.id}</h3>
                    <p class="text-sm text-gray-500">${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-sm ${getStatusClass(order.status)}">
                    ${order.status}
                </span>
            </div>
            <div class="border-t border-gray-100 pt-4">
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Total Items</span>
                    <span>${order.items.length}</span>
                </div>
                <div class="flex items-center justify-between mt-2 text-sm">
                    <span class="text-gray-600">Total Amount</span>
                    <span class="font-semibold">৳${order.total.toFixed(2)}</span>
                </div>
            </div>
            <button onclick="viewOrderDetails('${order.id}')" 
                    class="w-full mt-4 py-2 text-blue-600 text-sm hover:bg-blue-50 rounded-lg transition">
                View Details
            </button>
        </div>
    `).join('');
}

// Get status class for order status
function getStatusClass(status) {
    const classes = {
        'Processing': 'bg-yellow-100 text-yellow-800',
        'Shipped': 'bg-blue-100 text-blue-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
}

// View order details
function viewOrderDetails(orderId) {
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || { orders: [] };
    const order = userProfile.orders.find(o => o.id === orderId);
    
    if (!order) {
        showNotification('Order not found');
        return;
    }

    // Create modal for order details
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b sticky top-0 bg-white">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-semibold">Order Details</h2>
                    <button onclick="closeOrderModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Order ID</p>
                        <p class="font-medium">#${order.id}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-600">Order Date</p>
                        <p class="font-medium">${new Date(order.date).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            
            <div class="p-6">
                <div class="mb-6">
                    <h3 class="font-medium mb-3">Items</h3>
                    <div class="space-y-4">
                        ${order.items.map(item => `
                            <div class="flex items-center gap-4">
                                <img src="${item.image}" alt="${item.name}" 
                                     class="w-16 h-16 object-cover rounded-lg">
                                <div class="flex-1">
                                    <h4 class="font-medium">${item.name}</h4>
                                    <p class="text-sm text-gray-500">Quantity: ${item.quantity}</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-semibold">৳${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="mb-6 border-t pt-4">
                    <h3 class="font-medium mb-3">Delivery Details</h3>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-600">Name</p>
                            <p class="font-medium">${order.delivery.fullName}</p>
                        </div>
                        <div>
                            <p class="text-gray-600">Phone</p>
                            <p class="font-medium">${order.delivery.phone}</p>
                        </div>
                        <div class="col-span-2">
                            <p class="text-gray-600">Address</p>
                            <p class="font-medium">
                                ${order.delivery.street}, ${order.delivery.city}, 
                                ${order.delivery.postalCode}, ${order.delivery.country}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="border-t pt-4">
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Subtotal</span>
                            <span>৳${(order.total - 5).toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Shipping</span>
                            <span>৳5.00</span>
                        </div>
                        <div class="flex justify-between font-semibold pt-2 border-t">
                            <span>Total</span>
                            <span class="text-lg">৳${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close order details modal
function closeOrderModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', initOrders); 