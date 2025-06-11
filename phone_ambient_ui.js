// phone_ambient_ui.js
import { debugLogger } from './utils.js';

/**
* Handles the ambient UI elements and animations of the phone.
* This is a self-contained module.
*/

// --- Module-level variables ---
let currentTimeSmallElement, currentTimeElement, currentDateElement;
let notificationElement, notificationTitleEl, notificationContentEl;
let batteryIcons, wallpaperElement;
let timeUpdateInterval, batteryUpdateInterval, wallpaperUpdateInterval;

/**
* Initializes the ambient phone UI by querying elements and starting intervals.
* @param {HTMLElement} phoneContainer - The main phone container element (e.g., #rikk-phone-ui).
*/
export function initPhoneAmbientUI(phoneContainer) {
    if (!phoneContainer) {
        debugLogger.error('PhoneUI', "Phone container not provided. Ambient UI cannot be initialized.");
        return;
    }

    // Query all necessary elements scoped within the provided container
    // FIX: Updated selectors to match new HTML structure in index.html and one_ui_phone.css
    currentTimeSmallElement = phoneContainer.querySelector('#current-time-small'); // In top status-bar-phone
    currentTimeElement = phoneContainer.querySelector('#current-time');         // In launcher time-date-group
    currentDateElement = phoneContainer.querySelector('#current-date');         // In launcher time-date-group
    notificationElement = phoneContainer.querySelector('#notification');        // The overlay notification toast
    batteryIcons = phoneContainer.querySelectorAll('.status-icons-phone .fas'); // FIX: New class for battery icons container
    wallpaperElement = phoneContainer.querySelector('.wallpaper');

    if (notificationElement) {
        notificationTitleEl = notificationElement.querySelector('.notification-title');
        notificationContentEl = notificationElement.querySelector('.notification-content');
    }

    // Stop existing intervals to prevent duplication on re-initialization
    if (timeUpdateInterval) clearInterval(timeUpdateInterval);
    if (batteryUpdateInterval) clearInterval(batteryUpdateInterval);
    if (wallpaperUpdateInterval) clearInterval(wallpaperUpdateInterval);

    // Initial update to display current time and battery status immediately
    updateTime();
    animateBattery(); 
    animateWallpaper(); 
    
    // Set up recurring updates
    timeUpdateInterval = setInterval(updateTime, 60000); // Every minute
    batteryUpdateInterval = setInterval(animateBattery, 15000); // Every 15 seconds
    wallpaperUpdateInterval = setInterval(animateWallpaper, 100); // Smooth animation
    debugLogger.log('PhoneUI', 'Ambient UI initialized.');
}

/**
* Updates the current time and date displayed on the phone.
* Targets both the small status bar time and the large launcher time/date.
*/
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    if (currentTimeElement) currentTimeElement.textContent = timeString;
    if (currentTimeSmallElement) currentTimeSmallElement.textContent = timeString;

    const dateOptions = { weekday: "long", month: "long", day: "numeric" };
    if (currentDateElement) {
        currentDateElement.textContent = now.toLocaleDateString("en-US", dateOptions);
    }
}

/**
* Animates the battery icon in the status bar by cycling through battery level icons.
*/
function animateBattery() {
    if (!batteryIcons || batteryIcons.length === 0) return;
    const levels = ["fa-battery-empty", "fa-battery-quarter", "fa-battery-half", "fa-battery-three-quarters", "fa-battery-full"];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    
    batteryIcons.forEach(icon => {
        // FIX: This logic ensures only battery-related classes are removed/added.
        // It's more robust than `icon.className =` which would overwrite all classes.
        let isBatteryIcon = false;
        const classesToRemove = [];
        for (const cls of icon.classList) {
            if (cls.startsWith('fa-battery-')) {
                classesToRemove.push(cls);
                isBatteryIcon = true;
            }
        }

        if (isBatteryIcon) { // Only modify if it's actually a battery icon
            classesToRemove.forEach(cls => icon.classList.remove(cls));
            icon.classList.add(randomLevel);
        }
    });
}

/**
* Animates the wallpaper gradient for a subtle visual effect.
*/
let wallpaperAngle = 0;
function animateWallpaper() {
    if (!wallpaperElement) return;
    wallpaperAngle = (wallpaperAngle + 0.1) % 360;
    wallpaperElement.style.background = `linear-gradient(${wallpaperAngle}deg, #6e45e2 0%, #89d4cf 100%)`;
}

/**
* Shows a notification on the phone screen with a title, content, and a duration.
* @param {string} content - The message content of the notification.
* @param {string} [title="Notification"] - The title of the notification.
* @param {number} [duration=3000] - How long the notification stays visible in ms.
*/
let notificationTimeout;
export function showNotification(content, title = "Notification", duration = 3000) {
    if (!notificationElement || !notificationTitleEl || !notificationContentEl) {
        debugLogger.warn('PhoneUI', 'Notification elements not found. Cannot show notification on phone.');
        return;
    }

    // Clear any existing timeout to reset the timer if a new notification appears
    if (notificationTimeout) clearTimeout(notificationTimeout);

    notificationTitleEl.textContent = title;
    notificationContentEl.textContent = content;
    notificationElement.style.display = "block"; // Show the notification

    notificationTimeout = setTimeout(() => {
        notificationElement.style.display = "none"; // Hide after duration
    }, duration);
    debugLogger.log('PhoneUI', `Notification shown: "${title}" - "${content}"`);
}