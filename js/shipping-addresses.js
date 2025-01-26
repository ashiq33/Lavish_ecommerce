// Initialize user profile and addresses
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    addresses: []
};

// Initialize addresses page
function initAddresses() {
    renderAddresses();
    setupFormListeners();
}

// Render addresses
function renderAddresses() {
    const addressList = document.getElementById('addressList');
    const emptyState = document.getElementById('emptyState');

    if (userProfile.addresses.length === 0) {
        addressList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    addressList.innerHTML = userProfile.addresses.map(address => `
        <div class="bg-white rounded-xl p-4 shadow-sm">
            <div class="flex items-start justify-between">
                <div>
                    <div class="flex items-center gap-2">
                        <h3 class="font-medium">${address.label}</h3>
                        ${address.isDefault ? `
                            <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Default
                            </span>
                        ` : ''}
                    </div>
                    <p class="text-gray-600 mt-1">${address.fullName}</p>
                    <p class="text-gray-600">${address.phone}</p>
                    <p class="text-gray-600 mt-2">
                        ${address.street}<br>
                        ${address.city}, ${address.postalCode}<br>
                        ${address.country}
                    </p>
                </div>
                <div class="flex gap-2">
                    <button onclick="editAddress('${address.id}')" 
                            class="text-gray-400 hover:text-blue-600">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteAddress('${address.id}')" 
                            class="text-gray-400 hover:text-red-600">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Show add address form
function showAddAddressForm() {
    document.getElementById('modalTitle').textContent = 'Add New Address';
    document.getElementById('addressId').value = '';
    document.getElementById('addressForm').reset();
    document.getElementById('addressModal').classList.remove('hidden');
}

// Close address modal
function closeAddressModal() {
    document.getElementById('addressModal').classList.add('hidden');
}

// Setup form listeners
function setupFormListeners() {
    document.getElementById('addressForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveAddress();
    });
}

// Save address
function saveAddress() {
    const addressId = document.getElementById('addressId').value;
    const address = {
        id: addressId || Date.now().toString(),
        label: document.getElementById('addressLabel').value,
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value,
        country: document.getElementById('country').value,
        isDefault: document.getElementById('isDefault').checked
    };

    if (address.isDefault) {
        // Remove default flag from other addresses
        userProfile.addresses.forEach(addr => addr.isDefault = false);
    }

    if (addressId) {
        // Update existing address
        const index = userProfile.addresses.findIndex(addr => addr.id === addressId);
        if (index !== -1) {
            userProfile.addresses[index] = address;
        }
    } else {
        // Add new address
        userProfile.addresses.push(address);
    }

    saveProfile();
    renderAddresses();
    closeAddressModal();
    showNotification('Address saved successfully');
}

// Edit address
function editAddress(addressId) {
    const address = userProfile.addresses.find(addr => addr.id === addressId);
    if (address) {
        document.getElementById('modalTitle').textContent = 'Edit Address';
        document.getElementById('addressId').value = address.id;
        document.getElementById('addressLabel').value = address.label;
        document.getElementById('fullName').value = address.fullName;
        document.getElementById('phone').value = address.phone;
        document.getElementById('street').value = address.street;
        document.getElementById('city').value = address.city;
        document.getElementById('postalCode').value = address.postalCode;
        document.getElementById('country').value = address.country;
        document.getElementById('isDefault').checked = address.isDefault;
        document.getElementById('addressModal').classList.remove('hidden');
    }
}

// Delete address
function deleteAddress(addressId) {
    if (confirm('Are you sure you want to delete this address?')) {
        userProfile.addresses = userProfile.addresses.filter(addr => addr.id !== addressId);
        saveProfile();
        renderAddresses();
        showNotification('Address deleted successfully');
    }
}

// Save profile
function saveProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

// Initialize the page
document.addEventListener('DOMContentLoaded', initAddresses); 