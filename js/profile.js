// User profile data structure
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    image: 'https://via.placeholder.com/100',
    settings: {
        notifications: true,
        darkMode: false
    },
    addresses: [],
    paymentMethods: [],
    orders: []
};

// Initialize profile page
function initProfile() {
    // Load profile data
    document.getElementById('profileName').textContent = userProfile.name;
    document.getElementById('profileEmail').textContent = userProfile.email;
    document.getElementById('profileImage').src = userProfile.image;

    // Set toggle states
    document.getElementById('notificationsToggle').checked = userProfile.settings.notifications;
    document.getElementById('darkModeToggle').checked = userProfile.settings.darkMode;

    // Add event listeners
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Image upload
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

    // Settings toggles
    document.getElementById('notificationsToggle').addEventListener('change', function(e) {
        userProfile.settings.notifications = e.target.checked;
        saveProfile();
    });

    document.getElementById('darkModeToggle').addEventListener('change', function(e) {
        userProfile.settings.darkMode = e.target.checked;
        toggleDarkMode(e.target.checked);
        saveProfile();
    });
}

// Handle image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImage').src = e.target.result;
            userProfile.image = e.target.result;
            saveProfile();
            showNotification('Profile picture updated');
        };
        reader.readAsDataURL(file);
    }
}

// Toggle edit mode
function toggleEditMode() {
    const editBtn = document.getElementById('editProfileBtn');
    const isEditing = editBtn.textContent === 'Save';

    if (isEditing) {
        // Save changes
        const nameElement = document.getElementById('profileName');
        const emailElement = document.getElementById('profileEmail');
        
        userProfile.name = nameElement.textContent;
        userProfile.email = emailElement.textContent;
        
        nameElement.contentEditable = false;
        emailElement.contentEditable = false;
        
        editBtn.textContent = 'Edit';
        saveProfile();
        showNotification('Profile updated successfully');
    } else {
        // Enable editing
        document.getElementById('profileName').contentEditable = true;
        document.getElementById('profileEmail').contentEditable = true;
        editBtn.textContent = 'Save';
    }
}

// Toggle dark mode
function toggleDarkMode(enabled) {
    if (enabled) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Save profile data
function saveProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('userProfile');
        window.location.href = '../index.html';
    }
}

// Add order to profile
function addOrder(order) {
    userProfile.orders.unshift(order);
    saveProfile();
    addNotification({
        type: 'order',
        title: 'New Order Placed',
        message: `Order #${order.id} has been placed successfully.`
    });
}

// Add address to profile
function addAddress(address) {
    userProfile.addresses.push(address);
    saveProfile();
}

// Add payment method to profile
function addPaymentMethod(paymentMethod) {
    userProfile.paymentMethods.push(paymentMethod);
    saveProfile();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', initProfile); 