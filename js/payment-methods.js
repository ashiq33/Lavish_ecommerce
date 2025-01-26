// Initialize payment methods
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || { paymentMethods: [] };

// Initialize page
function initPaymentMethods() {
    renderPaymentMethods();
    setupEventListeners();
}

// Render payment methods
function renderPaymentMethods() {
    const list = document.getElementById('paymentMethodsList');
    const emptyState = document.getElementById('emptyState');

    if (userProfile.paymentMethods.length === 0) {
        list.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    list.innerHTML = userProfile.paymentMethods.map(payment => `
        <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-start justify-between">
                <div>
                    <div class="flex items-center gap-2">
                        <i class="fas fa-credit-card text-gray-400"></i>
                        <h3 class="font-medium">•••• ${payment.cardNumber.slice(-4)}</h3>
                        ${payment.isDefault ? `
                            <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Default
                            </span>
                        ` : ''}
                    </div>
                    <p class="text-gray-600 mt-1">${payment.cardHolder}</p>
                    <p class="text-gray-500 text-sm">Expires ${payment.expiryDate}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="editPaymentMethod('${payment.id}')" 
                            class="text-gray-400 hover:text-blue-600">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deletePaymentMethod('${payment.id}')" 
                            class="text-gray-400 hover:text-red-600">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Show add payment modal
function showAddPaymentModal() {
    document.getElementById('modalTitle').textContent = 'Add Payment Method';
    document.getElementById('paymentId').value = '';
    document.getElementById('paymentForm').reset();
    document.getElementById('paymentModal').classList.remove('hidden');
    document.getElementById('paymentModal').classList.add('flex');
}

// Close payment modal
function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('flex');
    document.getElementById('paymentModal').classList.add('hidden');
}

// Save payment method
function savePaymentMethod(event) {
    event.preventDefault();

    const paymentId = document.getElementById('paymentId').value || Date.now().toString();
    const payment = {
        id: paymentId,
        cardHolder: document.getElementById('cardHolder').value,
        cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value,
        isDefault: document.getElementById('isDefault').checked
    };

    if (payment.isDefault) {
        userProfile.paymentMethods.forEach(p => p.isDefault = false);
    }

    const existingIndex = userProfile.paymentMethods.findIndex(p => p.id === paymentId);
    if (existingIndex !== -1) {
        userProfile.paymentMethods[existingIndex] = payment;
    } else {
        userProfile.paymentMethods.push(payment);
    }

    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    renderPaymentMethods();
    closePaymentModal();
    showNotification('Payment method saved successfully');
}

// Edit payment method
function editPaymentMethod(paymentId) {
    const payment = userProfile.paymentMethods.find(p => p.id === paymentId);
    if (payment) {
        document.getElementById('modalTitle').textContent = 'Edit Payment Method';
        document.getElementById('paymentId').value = payment.id;
        document.getElementById('cardHolder').value = payment.cardHolder;
        document.getElementById('cardNumber').value = payment.cardNumber;
        document.getElementById('expiryDate').value = payment.expiryDate;
        document.getElementById('cvv').value = payment.cvv;
        document.getElementById('isDefault').checked = payment.isDefault;
        showAddPaymentModal();
    }
}

// Delete payment method
function deletePaymentMethod(paymentId) {
    if (confirm('Are you sure you want to delete this payment method?')) {
        userProfile.paymentMethods = userProfile.paymentMethods.filter(p => p.id !== paymentId);
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        renderPaymentMethods();
        showNotification('Payment method deleted successfully');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Format card number with spaces
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value;
    });

    // Format expiry date
    document.getElementById('expiryDate').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });
}

// Show notification
function showNotification(message) {
    // You can implement your notification system here
    alert(message);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', initPaymentMethods); 