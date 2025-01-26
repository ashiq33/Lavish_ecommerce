// Function to handle delivery form submission
function submitDeliveryDetails() {
    const form = document.getElementById('deliveryForm');
    
    // Add name attributes to all form inputs for proper collection
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (!input.name) {
            input.name = input.id || input.type;
        }
    });

    if (form.checkValidity()) {
        // Collect form data
        const formData = new FormData(form);
        const deliveryDetails = {
            contactInfo: {
                fullName: formData.get('fullName'),
                phone: formData.get('phone'),
                email: formData.get('email')
            },
            address: {
                street: formData.get('street'),
                city: formData.get('city'),
                postalCode: formData.get('postalCode'),
                country: formData.get('country')
            },
            deliveryOption: formData.get('delivery')
        };
        
        // Save delivery details to localStorage
        localStorage.setItem('deliveryDetails', JSON.stringify(deliveryDetails));
        
        // Show success notification
        showNotification('Delivery details saved successfully');
        
        // Redirect to payment page after short delay
        setTimeout(() => {
            window.location.href = 'payment.html';
        }, 1000);
    } else {
        // Show error notification for invalid fields
        const invalidInputs = form.querySelectorAll(':invalid');
        invalidInputs.forEach(input => {
            const label = input.previousElementSibling?.textContent || 'This field';
            showNotification(`${label} is required`);
        });
        form.reportValidity();
    }
}

// Initialize delivery page
document.addEventListener('DOMContentLoaded', () => {
    // Load cart summary
    const cartSummary = JSON.parse(localStorage.getItem('cartSummary'));
    if (cartSummary) {
        updateDeliverySummary(cartSummary);
    }

    // Load saved delivery details if any
    const savedDetails = JSON.parse(localStorage.getItem('deliveryDetails'));
    if (savedDetails) {
        fillSavedDetails(savedDetails);
    }

    // Add event listeners for delivery option changes
    setupDeliveryOptionListeners();
});

// Function to update delivery summary
function updateDeliverySummary(summary) {
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = `$${summary.subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${summary.shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${summary.total.toFixed(2)}`;
}

// Function to fill saved details
function fillSavedDetails(details) {
    const form = document.getElementById('deliveryForm');
    if (!form) return;

    // Fill contact info
    if (details.contactInfo) {
        form.querySelector('[name="fullName"]').value = details.contactInfo.fullName || '';
        form.querySelector('[name="phone"]').value = details.contactInfo.phone || '';
        form.querySelector('[name="email"]').value = details.contactInfo.email || '';
    }

    // Fill address
    if (details.address) {
        form.querySelector('[name="street"]').value = details.address.street || '';
        form.querySelector('[name="city"]').value = details.address.city || '';
        form.querySelector('[name="postalCode"]').value = details.address.postalCode || '';
        form.querySelector('[name="country"]').value = details.address.country || '';
    }

    // Set delivery option
    if (details.deliveryOption) {
        const radioBtn = form.querySelector(`[value="${details.deliveryOption}"]`);
        if (radioBtn) radioBtn.checked = true;
    }
}

// Function to setup delivery option listeners
function setupDeliveryOptionListeners() {
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', () => {
            const cartSummary = JSON.parse(localStorage.getItem('cartSummary'));
            if (cartSummary) {
                cartSummary.shipping = option.value === 'express' ? 15.00 : 5.00;
                cartSummary.total = cartSummary.subtotal + cartSummary.shipping;
                localStorage.setItem('cartSummary', JSON.stringify(cartSummary));
                updateDeliverySummary(cartSummary);
            }
        });
    });
} 