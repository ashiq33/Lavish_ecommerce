// Sample notifications data structure
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

// Function to add a new notification
function addNotification(notification) {
    notifications.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notification
    });
    saveNotifications();
    updateNotificationCount();
}

// Function to render notifications
function renderNotifications(filter = 'all') {
    const notificationsList = document.getElementById('notificationsList');
    const emptyState = document.getElementById('emptyState');
    
    // Filter notifications
    let filteredNotifications = notifications;
    if (filter !== 'all') {
        filteredNotifications = notifications.filter(n => n.type === filter);
    }

    // Show/hide empty state
    if (filteredNotifications.length === 0) {
        notificationsList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    notificationsList.innerHTML = filteredNotifications.map(notification => `
        <div class="bg-white rounded-xl p-4 shadow-sm ${notification.read ? 'opacity-75' : ''}"
             data-notification-id="${notification.id}">
            <div class="flex items-start gap-4">
                <div class="flex-shrink-0">
                    ${getNotificationIcon(notification.type)}
                </div>
                <div class="flex-1">
                    <div class="flex items-start justify-between">
                        <div>
                            <h3 class="font-medium text-gray-900">${notification.title}</h3>
                            <p class="text-gray-600 mt-1">${notification.message}</p>
                        </div>
                        <button onclick="removeNotification(${notification.id})" 
                                class="text-gray-400 hover:text-red-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="flex items-center justify-between mt-3">
                        <span class="text-sm text-gray-500">
                            ${formatTimestamp(notification.timestamp)}
                        </span>
                        ${!notification.read ? `
                            <button onclick="markAsRead(${notification.id})" 
                                    class="text-sm text-blue-600 hover:text-blue-700">
                                Mark as read
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Function to get notification icon
function getNotificationIcon(type) {
    const iconClasses = {
        order: 'fas fa-shopping-bag text-green-500',
        promotion: 'fas fa-tag text-purple-500',
        account: 'fas fa-user text-blue-500',
        default: 'fas fa-bell text-gray-500'
    };

    const iconClass = iconClasses[type] || iconClasses.default;
    return `<div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <i class="${iconClass}"></i>
            </div>`;
}

// Function to format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000));
        if (hours < 1) {
            const minutes = Math.floor(diff / (60 * 1000));
            return `${minutes} minutes ago`;
        }
        return `${hours} hours ago`;
    }
    
    // Less than 7 days
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        return `${days} days ago`;
    }
    
    // More than 7 days
    return date.toLocaleDateString();
}

// Function to filter notifications
function filterNotifications(type) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    const activeBtn = document.querySelector(`[onclick="filterNotifications('${type}')"]`);
    activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
    activeBtn.classList.add('bg-blue-600', 'text-white');

    renderNotifications(type);
}

// Function to mark notification as read
function markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        saveNotifications();
        renderNotifications();
        updateNotificationCount();
    }
}

// Function to remove notification
function removeNotification(notificationId) {
    notifications = notifications.filter(n => n.id !== notificationId);
    saveNotifications();
    renderNotifications();
    updateNotificationCount();
}

// Function to clear all notifications
function clearAllNotifications() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        notifications = [];
        saveNotifications();
        renderNotifications();
        updateNotificationCount();
    }
}

// Function to save notifications
function saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Function to update notification count
function updateNotificationCount() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const countElement = document.querySelector('.fa-bell + span');
    if (countElement) {
        countElement.textContent = unreadCount;
        countElement.classList.toggle('hidden', unreadCount === 0);
    }
}

// Initialize notifications page
document.addEventListener('DOMContentLoaded', () => {
    renderNotifications();
    updateNotificationCount();

    // Add some sample notifications if none exist
    if (notifications.length === 0) {
        addNotification({
            type: 'order',
            title: 'Order Confirmed',
            message: 'Your order #12345 has been confirmed and is being processed.'
        });
        addNotification({
            type: 'promotion',
            title: 'Special Offer',
            message: 'Get 20% off on all summer collection items!'
        });
        addNotification({
            type: 'account',
            title: 'Welcome to Lavish Things',
            message: 'Thank you for creating an account with us.'
        });
    }
}); 