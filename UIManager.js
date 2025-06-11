// UIManager.js
import { debugLogger } from './utils.js';
// Import drag and drop utility functions for the launcher
import { initDraggableGrid, handleDragStart, handleDragOver, handleDrop, handleDragEnd } from './phone_launcher_drag.js';

class UIManager {
    /**
     * Initializes the UIManager, responsible for all DOM manipulation and UI state.
     * @param {object} gameStateInstance - The instance of the GameState class.
     * @param {object} config - Configuration object containing UI-specific settings.
     */
    constructor(gameStateInstance, config = {}) {
        if (!gameStateInstance) {
            throw new Error("UIManager requires a GameState instance to be initialized.");
        }
        this.gameState = gameStateInstance;
        this.config = config; // For UI-specific configurations like APP_CONTAINER_SELECTOR

        // Reference to the SlotGameManager instance, set externally by script.js.
        // This is necessary for UIManager to call methods on the SlotGameManager when the app is launched.
        this.slotGameManager = null; 

        // --- Core UI Element References (initially null, populated in initDOMReferences) ---
        // Main game screens
        this.splashScreen = null;
        this.gameViewport = null;
        this.startScreen = null;
        this.gameScreen = null;
        this.endScreen = null;

        // Main menu buttons
        this.newGameBtn = null;
        this.continueGameBtn = null;
        this.restartGameBtn = null;

        // Game HUD elements
        this.cashDisplay = null;
        this.dayDisplay = null;
        this.heatDisplay = null;
        this.credDisplay = null;
        this.eventTicker = null;

        // Game scene elements
        this.gameScene = null;
        this.knockEffect = null;

        // Main phone UI elements
        this.rikkPhoneUI = null; // The outermost phone wrapper element
        this.phoneScreenArea = null; // The internal screen area of the phone

        // Ambient UI elements (time, date, notifications, battery)
        this.currentTimeSmallElement = null; // For top status bar time
        this.currentTimeElement = null; // For large launcher time
        this.currentDateElement = null; // For large launcher date
        this.notificationElement = null; // Notification toast container
        this.batteryIcons = null; // For battery animation

        // Phone navigation bar elements (Android style at bottom)
        this.phoneNavBar = null;
        this.phoneHomeBtn = null;
        this.phoneBackBtn = null;
        this.phoneRecentsBtn = null; // Not implemented, but exists in HTML

        // Phone launcher elements
        this.phoneLauncherContainer = null;
        this.phoneLauncherWrapper = null;
        this.phonePaginationDots = null;

        // Specific app view containers (these are the 'app-view' elements)
        this.messagesAppView = null;
        this.contactsAppView = null; 
        this.slotGameView = null;       
        this.settingsAppView = null;

        // Elements specific to the Messages app (chat interaction)
        this.chatContainer = null; 
        this.choicesArea = null; 
        this.phoneTitleGame = null; // Title displayed in the Messages app header

        // Phone error toast
        this.phoneErrorToast = null;
        this.phoneErrorMessage = null;

        // Game interaction and inventory buttons (outside the phone UI)
        this.nextCustomerBtn = null;
        this.openInventoryBtn = null;
        this.dockPhoneBtn = null; // Button to dock/undock phone
        this.phoneDockedIndicator = null; // Visual indicator when phone is 'docked'

        // Inventory modal elements
        this.inventoryModal = null;
        this.closeModalBtn = null;
        this.inventoryList = null;
        this.inventoryCountDisplay = null; // For HUD
        this.modalInventorySlotsDisplay = null; // For modal header

        // End screen elements
        this.finalDaysDisplay = null;
        this.finalCashDisplay = null;
        this.finalCredDisplay = null;
        this.finalVerdictText = null;

        // Main menu settings panels and buttons
        this.primaryActionsContainer = null; // Container for 'Run It' / 'Continue' buttons
        // this.submenuNavigationContainer = null; // No direct container for this in new HTML

        this.settingsMenuBtn = null; // Main menu settings cog
        this.loadMenuBtn = null; // Load Game button (mapped to continue-game-btn)
        // this.creditsMenuBtn = null; // No explicit button for credits in new HTML

        this.settingsMenuPanel = null;
        this.loadMenuPanel = null;
        this.creditsMenuPanel = null;
        this.allSubmenuBackBtns = null; // General selector for 'Back' buttons in submenus

        // Audio elements
        this.doorKnockSound = null;
        this.cashSound = null;
        this.deniedSound = null;
        this.chatBubbleSound = null;

        // Main menu visual effects
        this.mainMenuLightContainer = null;

        // Global app container and style controls
        this.appContainer = null; // The main game viewport element
        this.styleControls = null; // All input elements with data-variable attribute

        // Specific style settings preview/reset buttons
        this.previewMainSettingsButton = null; 
        this.resetMainSettingsButton = null;

        // Settings App specific DOM references (for controls within the phone settings app)
        this.settingAppGridSize = null;
        this.settingIconSize = null;
        this.settingPhoneTheme = null; 
        this.settingHapticFeedback = null; 

        // Internal UI state for app management
        this.currentPhoneState = 'docked'; // Tracks if phone is docked, in-app, etc.
        this.activeApp = null; // Stores the key of the currently active app
        this.appViews = {}; // Maps app names (e.g., 'messages') to their HTML elements

        // Internal UI state for launcher pagination
        this.currentPage = 0; // Current page index of the launcher
        this.numPages = 0; // Total number of launcher pages

        // Internal UI state for style settings preview
        this.isPreviewModeActive = false; // Flag for preview mode
        this.originalSettingsBeforePreview = {}; // Stores settings before entering preview mode
        this.defaultStyleSettings = config.defaultStyleSettings || {}; // Default CSS variable values
        this.styleSettingsKey = config.styleSettingsKey || 'rikkGameStyleSettingsV1_fallback'; // Key for localStorage
        
        // Chat spacer element for auto-scrolling. Ensures messages stick to bottom.
        this.chatSpacerElement = null; 
    }

    /**
     * Sets the SlotGameManager instance on the UIManager.
     * This allows UIManager to interact with the slot game when its app is launched.
     * @param {SlotGameManager} manager - The instance of SlotGameManager.
     */
    setSlotGameManager(manager) {
        this.slotGameManager = manager;
    }

    /**
     * Initializes all necessary DOM element references by querying the document.
     * This method should be called once the DOM is fully loaded.
     */
    initDOMReferences() {
        // Main game screens
        this.splashScreen = document.getElementById('splash-screen');
        this.gameViewport = document.getElementById('game-viewport');
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.endScreen = document.getElementById('end-screen');

        // Main menu buttons
        this.newGameBtn = document.getElementById('new-game-btn');
        this.continueGameBtn = document.getElementById('continue-game-btn');
        this.restartGameBtn = document.getElementById('restart-game-btn');

        // Game HUD elements
        this.cashDisplay = document.getElementById('cash-display');
        this.dayDisplay = document.getElementById('day-display'); 
        this.heatDisplay = document.getElementById('heat-display');
        this.credDisplay = document.getElementById('cred-display');
        this.eventTicker = document.getElementById('event-ticker');

        // Game scene elements
        this.gameScene = document.getElementById('game-scene');
        this.knockEffect = document.getElementById('knock-effect');

        // Main phone UI elements
        this.rikkPhoneUI = document.getElementById('rikk-phone-ui'); 
        this.phoneScreenArea = document.getElementById('phone-screen-area'); 
        
        // Ambient UI element references (FIXED: Corrected selectors to match new HTML)
        this.currentTimeSmallElement = this.rikkPhoneUI.querySelector('#current-time-small');
        this.currentTimeElement = this.rikkPhoneUI.querySelector('#current-time');
        this.currentDateElement = this.rikkPhoneUI.querySelector('#current-date');
        this.notificationElement = this.rikkPhoneUI.querySelector('#notification');
        this.batteryIcons = this.rikkPhoneUI.querySelectorAll('.status-icons-phone .fas'); 

        // Specific app view containers
        this.contactsAppView = document.getElementById('contacts-app-view');
        this.slotGameView = document.getElementById('slot-game-view');       
        this.messagesAppView = document.getElementById('messages-app-view');
        this.settingsAppView = document.getElementById('settings-app-view');

        // Elements specific to the Messages app (chat interaction) (FIXED: Scoped to messagesAppView)
        if (this.messagesAppView) {
            this.chatContainer = this.messagesAppView.querySelector('#chat-container-game');
            this.choicesArea = this.messagesAppView.querySelector('#choices-area-game');
            this.phoneTitleGame = this.messagesAppView.querySelector('.one-ui-header .one-ui-header-title'); // Title in the messages app
        }

        // Phone navigation bar elements (Android style at bottom)
        this.phoneNavBar = this.rikkPhoneUI.querySelector('#phone-nav-bar'); // Now inside phone-ui
        this.phoneHomeBtn = this.rikkPhoneUI.querySelector('#phone-home-btn'); // Now inside phone-ui
        this.phoneBackBtn = this.rikkPhoneUI.querySelector('#phone-back-btn'); // Now inside phone-ui
        this.phoneRecentsBtn = this.rikkPhoneUI.querySelector('#phone-recents-btn'); // Now inside phone-ui


        // Phone launcher elements
        this.phoneLauncherContainer = document.getElementById('phone-launcher-container');
        this.phoneLauncherWrapper = document.getElementById('phone-launcher-wrapper');
        this.phonePaginationDots = document.getElementById('phone-pagination-dots');

        // Phone error toast
        this.phoneErrorToast = this.rikkPhoneUI.querySelector('#phone-error-toast'); // Now inside phone-ui
        this.phoneErrorMessage = this.phoneErrorToast ? this.phoneErrorToast.querySelector('#phone-error-message') : null;


        this.appViews = {
            contacts: this.contactsAppView,
            messages: this.messagesAppView,
            slots: this.slotGameView,
            settings: this.settingsAppView
            // Add other apps here if they get corresponding views
        };

        // Docked phone indicator (outside phone, fixed in game screen)
        this.phoneDockedIndicator = document.getElementById('phone-docked-indicator'); 
        this.dockPhoneBtn = document.getElementById('dock-phone-btn'); 

        // Game interaction and inventory buttons (outside phone)
        this.openInventoryBtn = document.getElementById('open-inventory-btn');
        this.inventoryCountDisplay = document.getElementById('inventory-count-display');
        this.nextCustomerBtn = document.getElementById('next-customer-btn');

        // Inventory modal elements
        this.inventoryModal = document.getElementById('inventory-modal');
        const inventoryDialog = this.inventoryModal ? this.inventoryModal.querySelector('#inventory-dialog') : null;
        if (inventoryDialog) {
            this.closeModalBtn = inventoryDialog.querySelector('.close-modal-btn');
        }
        this.inventoryList = document.getElementById('inventory-list');
        this.modalInventorySlotsDisplay = document.getElementById('modal-inventory-slots-display');

        // End screen elements
        this.finalDaysDisplay = document.getElementById('final-days-display');
        this.finalCashDisplay = document.getElementById('final-cash-display');
        this.finalCredDisplay = document.getElementById('final-cred-display');
        this.finalVerdictText = document.getElementById('final-verdict-text');

        // Main menu settings panels and buttons
        this.primaryActionsContainer = document.getElementById('main-menu-content').querySelector('.split-button-container'); // Adjusted selector
        // this.submenuNavigationContainer = null; // No direct container for this in new HTML

        this.settingsMenuBtn = document.getElementById('settings-menu-btn');
        this.loadMenuBtn = document.getElementById('continue-game-btn'); // Re-using continue game button for load game functionality

        this.settingsMenuPanel = document.getElementById('settings-menu-panel');
        this.loadMenuPanel = document.getElementById('load-menu-panel');
        this.creditsMenuPanel = document.getElementById('credits-menu-panel');
        this.allSubmenuBackBtns = document.querySelectorAll('.submenu-back-btn');

        // Audio elements
        this.doorKnockSound = document.getElementById('door-knock-sound');
        this.cashSound = document.getElementById('cash-sound');
        this.deniedSound = document.getElementById('denied-sound');
        this.chatBubbleSound = document.getElementById('chat-bubble-sound');

        // Main menu visual effects
        this.mainMenuLightContainer = document.getElementById('main-menu-lights');

        // Global app container and style controls
        this.appContainer = document.querySelector(this.config.APP_CONTAINER_SELECTOR || '#game-viewport');
        this.styleControls = document.querySelectorAll('[data-variable]');

        // Specific style settings preview/reset buttons
        this.previewMainSettingsButton = document.getElementById('preview-style-settings');
        this.resetMainSettingsButton = document.getElementById('reset-style-settings');
        // Removed phone-specific preview/reset buttons as they don't exist in HTML
        // this.previewPhoneSettingsButton = null; 
        // this.resetPhoneSettingsButton = null; 

        // Settings App specific DOM references (for controls within the phone settings app)
        this.settingAppGridSize = document.getElementById('setting-app-grid-size');
        this.settingIconSize = document.getElementById('setting-icon-size');
        this.settingPhoneTheme = document.getElementById('setting-phone-theme'); 
        this.settingHapticFeedback = document.getElementById('setting-haptic-feedback'); 

        // Chat spacer element for auto-scrolling. Ensure it's appended only once.
        // This is only relevant if the messages app view exists
        if (this.chatContainer && !this.chatSpacerElement) {
            this.chatSpacerElement = document.createElement('div');
            this.chatSpacerElement.className = 'chat-spacer';
            this.chatContainer.appendChild(this.chatSpacerElement);
        }

        debugLogger.log('UIManager', 'DOM references initialized.');
        // Initialize event listeners and apply settings here as they depend on DOM being ready
        this.initSettingsListeners();
        this.applyCurrentSettings();
        this.initLauncherGestures();
        // Initialize draggable grid functionality with a callback for order changes
        initDraggableGrid(this.handleAppOrderChange.bind(this)); 
    }

    // --- HUD Updates ---

    /**
     * Updates the main game HUD elements (cash, fiends left, heat, street cred).
     */
    updateHUD() {
        if (!this.cashDisplay || !this.dayDisplay || !this.heatDisplay || !this.credDisplay) {
            debugLogger.warn('UIManager', "HUD elements not fully initialized for updateHUD.");
            return;
        }
        this.cashDisplay.textContent = this.gameState.getCash();
        this.dayDisplay.textContent = this.gameState.getFiendsLeft();
        this.heatDisplay.textContent = this.gameState.getHeat();
        this.credDisplay.textContent = this.gameState.getStreetCred();
    }

    /**
     * Updates the event ticker display in the game header.
     */
    updateEventTicker() {
        if (!this.eventTicker) return;
        const events = this.gameState.getActiveWorldEvents();
        if (events.length > 0) {
            const currentEvent = events[0];
            this.eventTicker.textContent = `Word on the street: ${currentEvent.name} (${currentEvent.turnsLeft} turns left)`;
        } else {
            this.eventTicker.textContent = `Word on the street: All quiet... for now. (${this.gameState.getDayOfWeek()})`;
        }
    }

    // --- Screen Management ---

    /**
     * Shows a specific game screen while hiding all others.
     * @param {HTMLElement} screenToShow - The DOM element of the screen to make active.
     */
    showScreen(screenToShow) {
        // Hide all major screens
        [this.splashScreen, this.startScreen, this.gameScreen, this.endScreen].forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        // Show the desired screen
        if (screenToShow) screenToShow.classList.add('active');
    }

    /**
     * Activates or deactivates the main menu background light animation.
     * @param {boolean} isActive - True to activate lights, false to deactivate.
     */
    activateMainMenuLights(isActive) {
        if (this.mainMenuLightContainer) {
            if (isActive) this.mainMenuLightContainer.classList.add('lights-active');
            else this.mainMenuLightContainer.classList.remove('lights-active');
        }
    }


    // --- Phone UI Management ---

    /**
     * Sets the overall state of the phone UI. This controls which part of the phone is visible
     * (e.g., docked, home screen, a specific app).
     * @param {string} state - The desired phone state ('docked', 'home', 'messages', 'contacts', 'slots', 'settings', 'offscreen').
     */
    setPhoneUIState(state) {
        this.currentPhoneState = state; 
        if (!this.rikkPhoneUI || !this.phoneScreenArea || !this.phoneDockedIndicator) {
            debugLogger.warn('UIManager', "Core Phone UI elements not fully initialized for setPhoneUIState.");
            return;
        }

        // Hide all phone content views and reset main phone classes initially
        this.rikkPhoneUI.classList.remove('is-offscreen', 'chatting-game', 'home-screen-active', 'app-menu-game');
        this.phoneScreenArea.classList.remove('screen-off'); // Ensure screen is bright by default

        // Hide all app views
        Object.values(this.appViews).forEach(appView => {
            if (appView) appView.classList.remove('open');
        });

        // Hide external phone indicator
        this.phoneDockedIndicator.classList.add('hidden');

        // Control visibility of navigation bar and individual apps
        const navBar = this.phoneNavBar;
        const launcher = this.phoneLauncherContainer;

        if (navBar) navBar.classList.add('hidden'); // Hide nav bar by default, show in specific states
        if (launcher) launcher.classList.add('hidden'); // Hide launcher by default, show in 'home'

        switch (state) {
            case 'chatting': // Corresponds to 'messages' app
                this.rikkPhoneUI.classList.add('chatting-game'); // Apply state-specific classes
                if (this.messagesAppView) this.messagesAppView.classList.add('open');
                if (navBar) navBar.classList.remove('hidden');
                break;
            case 'home':
                this.rikkPhoneUI.classList.add('home-screen-active');
                if (launcher) launcher.classList.remove('hidden'); // Show launcher
                if (navBar) navBar.classList.remove('hidden'); // Show nav bar
                break;
            case 'contacts':
            case 'slots':
            case 'settings':
                this.rikkPhoneUI.classList.add('app-menu-game');
                const appView = this.appViews[state];
                if (appView) appView.classList.add('open');
                if (navBar) navBar.classList.remove('hidden');
                // Special handling for slots app when opened
                if (state === 'slots' && this.slotGameManager) { 
                    this.slotGameManager.launch(); 
                }
                break;
            case 'docked': // Phone slides off-screen, but a small indicator remains
                this.rikkPhoneUI.classList.add('is-offscreen');
                this.phoneScreenArea.classList.add('screen-off'); // Dim screen
                this.phoneDockedIndicator.classList.remove('hidden'); // Show small indicator
                break;
            case 'offscreen': // Phone completely off-screen (e.g., when modal is open)
                this.rikkPhoneUI.classList.add('is-offscreen');
                this.phoneScreenArea.classList.add('screen-off'); // Dim screen
                // No docked indicator
                break;
            default:
                debugLogger.warn('UIManager', `Unknown phone state: ${state}. Defaulting to 'docked'.`);
                this.setPhoneUIState('docked'); // Fallback to a safe default
                break;
        }
        debugLogger.log('UIManager', `Phone UI state set to: ${state}.`);
    }

    /**
     * Clears all messages from the chat container.
     */
    clearChat() {
        if (this.chatContainer) {
            // Remove all children except the persistent chat spacer element
            Array.from(this.chatContainer.children).forEach(child => {
                if (child !== this.chatSpacerElement) {
                    this.chatContainer.removeChild(child);
                }
            });
            // Ensure the spacer is still the last element to push content up
            if (this.chatContainer.lastChild !== this.chatSpacerElement) {
                this.chatContainer.appendChild(this.chatSpacerElement);
            }
        }
    }

    /**
     * Clears all choices from the choices area.
     */
    clearChoices() {
        if (this.choicesArea) {
            this.choicesArea.innerHTML = '';
        }
    }

    /**
     * Sets the title displayed in the current phone app's header (e.g., Messages app).
     * @param {string} title - The title text to set.
     */
    setPhoneTitle(title) {
        // This is specifically for the messages app title now
        if (this.phoneTitleGame) {
            this.phoneTitleGame.textContent = title;
        }
    }

    // --- Modal Management (Inventory) ---

    /**
     * Opens the inventory modal, updates its display, and sets the phone UI to 'offscreen'.
     */
    openInventoryModal() {
        if (!this.inventoryModal) return;
        this.updateInventoryDisplay(); 
        this.inventoryModal.classList.add('active');
        // Hide the phone UI when the modal is active for a cleaner look
        this.setPhoneUIState('offscreen'); 
        debugLogger.log('UIManager', 'Inventory modal opened.');
    }

    /**
     * Closes the inventory modal and restores the appropriate phone UI state.
     */
    closeInventoryModal() {
        if (!this.inventoryModal) return;
        this.inventoryModal.classList.remove('active');
        // Restore phone state based on game context (e.g., if a customer interaction is active)
        const customerActive = this.gameState.getCurrentCustomerInstance() !== null;
        this.setPhoneUIState(customerActive ? 'messages' : 'home'); // If customer active, go to messages, else home
        debugLogger.log('UIManager', 'Inventory modal closed.');
    }

    /**
     * Updates the display of items in the inventory modal and the HUD inventory count.
     */
    updateInventoryDisplay() {
        if (!this.inventoryList || !this.inventoryCountDisplay || !this.modalInventorySlotsDisplay) {
            debugLogger.warn('UIManager', "Inventory display elements not fully initialized. Cannot update inventory display.");
            return;
        }

        const inventory = this.gameState.getInventory();
        const maxSlots = this.gameState.getMaxInventorySlots();

        // Update counts in HUD and modal header
        this.inventoryCountDisplay.textContent = inventory.length;
        this.modalInventorySlotsDisplay.textContent = `${inventory.length}/${maxSlots}`;
        this.inventoryList.innerHTML = ''; // Clear existing items

        if (inventory.length > 0) {
            // Render each item as a card
            inventory.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('inventory-item-card');
                // Basic item display, can be enhanced
                itemDiv.innerHTML = `<h4>${item.name} (${item.quality || 'N/A'})</h4>
                                     <p class="item-detail">Copped: $${item.purchasePrice || 'N/A'}<br>
                                     Heat: +${item.itemTypeObj?.heat || 'N/A'}</p>`;
                this.inventoryList.appendChild(itemDiv);
            });
        } else {
            // Display message if inventory is empty
            const emptyMsg = document.createElement('p');
            emptyMsg.className = 'empty-stash-message';
            emptyMsg.textContent = "Your stash is bone dry.";
            this.inventoryList.appendChild(emptyMsg);
        }
    }

    // --- Audio Playback ---

    /**
     * Plays a given HTMLAudioElement.
     * @param {HTMLAudioElement} soundElement - The audio element to play.
     */
    playSound(soundElement) {
        if (soundElement && typeof soundElement.play === 'function') {
            soundElement.currentTime = 0; // Reset to start for immediate playback
            soundElement.play().catch(e => debugLogger.warn('UIManager', `Audio play failed: ${e.name}`, e));
        } else {
            debugLogger.warn('UIManager', "Attempted to play an invalid or null sound element.");
        }
    }

    // --- Knock Effect (Game Scene) ---

    /**
     * Displays the "KNOCK! KNOCK!" effect on the game scene.
     * @param {string} dayName - The current day of the week to display.
     */
    displayKnockEffect(dayName) {
        if (!this.knockEffect) return;
        this.knockEffect.textContent = `*${dayName} hustle... someone's knockin'.*`;
        this.knockEffect.classList.remove('hidden');
        this.knockEffect.style.animation = 'none'; // Reset animation
        void this.knockEffect.offsetWidth; // Trigger reflow to restart animation
        this.knockEffect.style.animation = 'knockAnim 0.5s ease-out forwards'; // Apply animation
    }

    /**
     * Hides the "KNOCK! KNOCK!" effect.
     */
    hideKnockEffect() {
        if (this.knockEffect) {
            this.knockEffect.classList.add('hidden');
        }
    }

    // --- Button States ---

    /**
     * Sets the disabled state of the "Next Fiend" button.
     * @param {boolean} disabled - True to disable, false to enable.
     */
    setNextCustomerButtonDisabled(disabled) {
        if (this.nextCustomerBtn) {
            this.nextCustomerBtn.disabled = disabled;
        }
    }

    /**
     * Sets the visibility of the "Continue Game" button on the main menu.
     * @param {boolean} isVisible - True to show, false to hide.
     */
    setContinueButtonVisibility(isVisible) {
        if (this.continueGameBtn) {
            if (isVisible) {
                this.continueGameBtn.classList.remove('hidden');
            } else {
                this.continueGameBtn.classList.add('hidden');
            }
        } else {
            debugLogger.warn('UIManager', 'Continue game button not found to set visibility.');
        }
    }

    // --- Display Choices ---
    /**
     * Displays a set of choices as buttons in the choices area.
     * @param {Array<object>} choices - An array of choice objects, each with 'text', 'outcome', and 'disabled' properties.
     * @param {function} handleChoiceCallback - The callback function to execute when a choice button is clicked.
     */
    displayChoices(choices, handleChoiceCallback) {
        if (!this.choicesArea) return;
        this.clearChoices(); // Clear any existing choices first

        if (!choices || choices.length === 0) {
            debugLogger.warn('UIManager', "No choices to display.");
            return;
        }

        choices.forEach(choice => {
            const button = document.createElement('button');
            button.classList.add('choice-button');
            // Add a 'decline' class for specific styling if the choice is a decline option
            if (choice.outcome && choice.outcome.type && choice.outcome.type.startsWith('decline')) {
                button.classList.add('decline');
            }
            button.textContent = choice.text;
            button.disabled = choice.disabled || false;

            // Attach event listener if the button is not disabled and a callback is provided
            if (!choice.disabled && typeof handleChoiceCallback === 'function') {
                button.addEventListener('click', () => handleChoiceCallback(choice.outcome));
            } else if (!choice.disabled) {
                debugLogger.warn('UIManager', `handleChoiceCallback not provided for active choice button: "${choice.text}". Button will not be interactive.`);
            }
            this.choicesArea.appendChild(button);
        });
    }

    // --- Phone Message Display ---
    /**
     * Displays a message in the phone chat.
     * Supports different speakers (rikk, customer, narration) and bold formatting.
     * @param {string} messageText - The text content of the message.
     * @param {string} speaker - The speaker of the message ('rikk', 'customer', 'narration').
     */
    displayPhoneMessage(messageText, speaker) {
        if (typeof messageText === 'undefined' || messageText === null) {
            messageText = "..."; // Default for undefined messages
        }
        if (!this.chatContainer || !this.chatSpacerElement) {
            debugLogger.warn('UIManager', "Chat container or spacer not ready for messages. Cannot display message.");
            return;
        }

        const messageContainer = document.createElement('div');
        messageContainer.classList.add('chat__conversation-board__message-container');

        // Reverse display order for 'rikk' messages (right-aligned)
        if (speaker === 'rikk') {
            messageContainer.classList.add('reversed');
        }

        const personDiv = document.createElement('div');
        personDiv.classList.add('chat__conversation-board__message__person');
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('chat__conversation-board__message__person__avatar');
        const avatarImg = document.createElement('img');

        const customerInstance = this.gameState.getCurrentCustomerInstance();
        const customerAvatars = this.config.customerAvatars || {}; 
        const rikkAvatarUrl = this.config.rikkAvatarUrl || '';
        const systemAvatarUrl = this.config.systemAvatarUrl || '';

        // Determine avatar source based on speaker
        if (speaker === 'customer' && customerInstance?.archetypeKey) {
            avatarImg.src = customerAvatars[customerInstance.archetypeKey] || 'https://via.placeholder.com/56/555555/FFFFFF?text=?';
            avatarImg.alt = customerInstance.name || 'Customer';
        } else if (speaker === 'rikk') {
            avatarImg.src = rikkAvatarUrl;
            avatarImg.alt = 'Rikk';
        } else { // system or narration
            avatarImg.src = systemAvatarUrl;
            avatarImg.alt = 'System';
        }
        avatarDiv.appendChild(avatarImg);

        // Only add avatar if not a narration message
        if (speaker !== 'narration') {
            personDiv.appendChild(avatarDiv);
            messageContainer.appendChild(personDiv);
        }

        const contextDiv = document.createElement('div');
        contextDiv.classList.add('chat__conversation-board__message__context');
        const bubble = document.createElement('div');
        bubble.classList.add('chat-bubble', speaker); // Add speaker class for specific styling

        // Add speaker name for 'customer' and 'rikk' messages
        if (speaker === 'customer' || speaker === 'rikk') {
            const speakerNameElement = document.createElement('span');
            speakerNameElement.classList.add('speaker-name');
            speakerNameElement.textContent = (speaker === 'customer') ? (customerInstance?.name || '[Customer]') : 'Rikk';
            bubble.appendChild(speakerNameElement);
        }

        // Handle **bold** text within the message
        const messageParts = messageText.split(/(\*\*.*?\*\*)/g);
        messageParts.forEach(part => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const boldEl = document.createElement('strong');
                boldEl.textContent = part.slice(2, -2);
                bubble.appendChild(boldEl);
            } else {
                bubble.appendChild(document.createTextNode(part));
            }
        });

        contextDiv.appendChild(bubble);
        messageContainer.appendChild(contextDiv);

        // Insert the new message just before the chat spacer element to keep it at the bottom
        this.chatContainer.insertBefore(messageContainer, this.chatSpacerElement);
        // Auto-scroll to the bottom of the chat
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight; 

        // Play chat bubble sound, but only if not narration (narration sound is handled by game logic)
        if (speaker !== 'narration' && this.chatBubbleSound) {
            this.playSound(this.chatBubbleSound);
        }
    }

    // --- Style Settings Helper Methods ---

    /**
     * Applies a single CSS custom property (variable) to the document's root.
     * Adds 'px' suffix for certain dimension-related properties.
     * @param {string} variableName - The CSS custom property name (e.g., '--color-primary').
     * @param {string|number} value - The value to apply to the CSS variable.
     */
    _applySingleStyle(variableName, value) {
        if (typeof variableName === 'string' && typeof value !== 'undefined') {
            let cssValue = String(value); 
            const control = Array.from(this.styleControls).find(c => c.dataset.variable === variableName);

            // Add 'px' suffix for range inputs controlling dimensions
            if (control && control.type === 'range' &&
                (variableName.includes('radius') || variableName.includes('unit') || variableName.includes('spacing'))) {
                cssValue += 'px';
            }
            document.documentElement.style.setProperty(variableName, cssValue);
        }
    }

    /**
     * Retrieves the current values of all style controls from the DOM.
     * @returns {object} An object mapping CSS variable names to their current values.
     */
    _getValuesFromControls() {
        const settings = {};
        if (this.styleControls) {
            this.styleControls.forEach(input => {
                settings[input.dataset.variable] = input.value;
            });
        }
        return settings;
    }

    /**
     * Sets the values of style control inputs in the DOM based on a provided settings object.
     * Updates visual displays for range inputs.
     * @param {object} settings - An object mapping CSS variable names to desired input values.
     */
    _applyValuesToControls(settings) {
        if (this.styleControls) {
            this.styleControls.forEach(control => {
                const cssVariable = control.dataset.variable;
                if (settings.hasOwnProperty(cssVariable)) {
                    control.value = settings[cssVariable];
                    // Update value display for range inputs (e.g., "12px")
                    if (control.type === 'range') {
                        const valueDisplaySpan = document.querySelector(`.value-display[data-target="${control.id}"]`);
                        if (valueDisplaySpan) {
                            try {
                                valueDisplaySpan.textContent = control.value;
                            } catch (error) {
                                debugLogger.error('UIManager', `Error setting textContent for valueDisplaySpan in _applyValuesToControls: ${error.message}`, error);
                            }
                        }
                    }
                }
            });
        }
    }

    // --- Style Settings Core Management Methods ---

    /**
     * Initializes event listeners for all style control inputs.
     * Triggers style updates and optional saving when values change.
     * @param {function} saveSettingsCb - Callback function to save settings (provided by script.js).
     */
    initStyleControls(saveSettingsCb) {
        if (!this.styleControls) return;
        this.styleControls.forEach(control => {
            const cssVariable = control.dataset.variable;
            let eventType = 'input'; // Default for range/text inputs
            if (control.type === 'select-one') eventType = 'change'; // For select elements

            control.addEventListener(eventType, (event) => {
                const rawValue = event.target.value;
                // Update visual display for range inputs
                if (control.type === 'range') {
                    const valueDisplay = document.querySelector(`.value-display[data-target="${control.id}"]`);
                    if (valueDisplay) {
                        try {
                            valueDisplay.textContent = rawValue;
                        } catch (error) {
                            debugLogger.error('UIManager', `Error setting textContent for valueDisplay in initStyleControls event listener: ${error.message}`, error);
                        }
                    }
                }
                this._applySingleStyle(cssVariable, rawValue); // Apply style immediately
                // Only save settings if not in preview mode
                if (!this.isPreviewModeActive && typeof saveSettingsCb === 'function') {
                    saveSettingsCb();
                }
            });
            // Initial update for range value displays on load
            if (control.type === 'range') {
                 const valueDisplay = document.querySelector(`.value-display[data-target="${control.id}"]`);
                 if (valueDisplay) {
                    try {
                        valueDisplay.textContent = control.value;
                    } catch (error) {
                        debugLogger.error('UIManager', `Error setting textContent for valueDisplay in initStyleControls initial setup: ${error.message}`, error);
                    }
                 }
            }
        });
    }

    /**
     * Loads saved style settings from localStorage and applies them.
     * If no settings are found, default settings are applied and saved.
     */
    loadAndApplyStyleSettings() {
        let loadedSettings = null;
        // Check if localStorage is available (assuming `isLocalStorageAvailable` is globally accessible)
        if (typeof isLocalStorageAvailable !== 'undefined' && isLocalStorageAvailable()) {
            try {
                const settingsString = localStorage.getItem(this.styleSettingsKey);
                if (settingsString) {
                    const parsed = JSON.parse(settingsString);
                    // Ensure parsed data is a valid object before using
                    if (typeof parsed === 'object' && parsed !== null) loadedSettings = parsed;
                    else localStorage.removeItem(this.styleSettingsKey); // Remove invalid data
                }
            } catch (e) {
                debugLogger.error('UIManager', 'Error parsing style settings from localStorage. Removing corrupted data.', e);
                localStorage.removeItem(this.styleSettingsKey);
            }
        }

        // Combine default settings with any loaded settings
        const currentStyleSettings = { ...this.defaultStyleSettings, ...loadedSettings };

        // Apply values to controls (input fields) and directly to CSS variables
        this._applyValuesToControls(currentStyleSettings);
        for (const key in currentStyleSettings) {
            this._applySingleStyle(key, currentStyleSettings[key]);
        }

        // If no settings were loaded, save the default settings to localStorage
        if (loadedSettings === null && typeof isLocalStorageAvailable !== 'undefined' && isLocalStorageAvailable()) {
            this.saveStyleSettingsToStorage();
        }
    }

    /**
     * Saves the current style settings from the controls to localStorage.
     */
    saveStyleSettingsToStorage() {
        if (typeof isLocalStorageAvailable === 'undefined' || !isLocalStorageAvailable()) {
            debugLogger.warn('UIManager', 'localStorage not available. Cannot save style settings.');
            return;
        }
        try {
            const settingsToSave = this._getValuesFromControls();
            localStorage.setItem(this.styleSettingsKey, JSON.stringify(settingsToSave));
            debugLogger.log('UIManager', 'Style settings saved to storage.');
        } catch (error) {
            debugLogger.error('UIManager', 'Failed to save style settings:', error);
        }
    }

    // --- Style Settings Preview Mode Methods ---

    /**
     * Adds a "Cancel Preview" button to a settings panel.
     * @param {string} panelId - The ID of the settings panel.
     * @param {string} referenceButtonId - The ID of the button to insert the cancel button next to.
     */
    _addCancelPreviewButtonUI(panelId, referenceButtonId) {
        const settingsPanel = document.getElementById(panelId);
        const referenceButton = document.getElementById(referenceButtonId);
        // Create a unique ID for the cancel button to prevent duplicates
        const existingCancelButtonId = `cancel-preview-${panelId.replace(/-/g, '')}`;
        if (document.getElementById(existingCancelButtonId)) return; // Don't add if already exists

        if (settingsPanel && referenceButton) {
            const cancelButton = document.createElement('button');
            cancelButton.id = existingCancelButtonId;
            cancelButton.className = 'cancel-preview-button game-button secondary-action';
            cancelButton.textContent = 'Cancel Preview';
            cancelButton.type = 'button';
            cancelButton.addEventListener('click', () => this.cancelPreview());

            // Insert the button after the reference button
            if(referenceButton.nextSibling) referenceButton.parentNode.insertBefore(cancelButton, referenceButton.nextSibling);
            else referenceButton.parentNode.appendChild(cancelButton);
        }
    }

    /**
     * Removes all "Cancel Preview" buttons from the DOM.
     */
    _removeCancelPreviewButtonUI() {
        document.querySelectorAll('.cancel-preview-button').forEach(btn => btn.remove());
    }

    /**
     * Toggles preview mode for style settings.
     * In preview mode, changes are applied live but not saved.
     * @param {function} saveSettingsCb - Callback function to save settings when exiting preview mode.
     */
    togglePreview(saveSettingsCb) {
        this.isPreviewModeActive = !this.isPreviewModeActive;
        // Toggle a class on the main app container for visual indication of preview mode
        if (this.appContainer) {
            this.appContainer.classList.toggle('preview-mode', this.isPreviewModeActive);
        }

        // Update the text of the main preview button
        const mainBtnText = this.isPreviewModeActive ? 'Apply & Exit Preview' : 'Preview';
        if (this.previewMainSettingsButton) this.previewMainSettingsButton.textContent = mainBtnText;
        // Removed phone-specific preview button as it's no longer in HTML
        // if (this.previewPhoneSettingsButton) this.previewPhoneSettingsButton.textContent = mainBtnText;

        if (this.isPreviewModeActive) {
            this.originalSettingsBeforePreview = this._getValuesFromControls(); // Save current settings
            // Add 'Cancel Preview' button to relevant settings panels
            this._addCancelPreviewButtonUI('settings-menu-panel', 'preview-style-settings');
            // Removed phone-specific panel as it's not in HTML
            // this._addCancelPreviewButtonUI('phone-theme-settings-view', 'preview-phone-style-settings');
            // Show a notification (assuming `phoneShowNotification` is globally accessible)
            if (typeof phoneShowNotification === 'function') phoneShowNotification("Preview Mode: Activated. Changes not saved.", "Settings");
        } else {
            this._removeCancelPreviewButtonUI(); // Remove cancel button
            if (typeof saveSettingsCb === 'function') saveSettingsCb(); // Save changes on exit
            if (typeof phoneShowNotification === 'function') phoneShowNotification("Preview settings applied.", "Settings");
        }
    }

    /**
     * Cancels preview mode, reverting to the original settings before preview.
     */
    cancelPreview() {
        if (!this.isPreviewModeActive) return; // Only act if in preview mode
        
        // Revert to original settings
        this._applyValuesToControls(this.originalSettingsBeforePreview);
        for (const key in this.originalSettingsBeforePreview) {
            this._applySingleStyle(key, this.originalSettingsBeforePreview[key]);
        }
        
        this.isPreviewModeActive = false; // Exit preview mode
        if (this.appContainer) this.appContainer.classList.remove('preview-mode'); // Remove preview indicator

        // Reset preview button text
        if (this.previewMainSettingsButton) this.previewMainSettingsButton.textContent = 'Preview';
        // Removed phone-specific preview button
        // if (this.previewPhoneSettingsButton) this.previewPhoneSettingsButton.textContent = 'Preview';
        
        this._removeCancelPreviewButtonUI(); // Remove cancel button
        if (typeof phoneShowNotification === 'function') phoneShowNotification("Preview cancelled. Settings reverted.", "Settings");
    }

    /**
     * Resets all style settings to their default values.
     * @param {function} saveSettingsCb - Callback function to save the default settings.
     */
    resetToDefaultStyles(saveSettingsCb) {
        this._applyValuesToControls(this.defaultStyleSettings); // Apply to controls
        for (const key in this.defaultStyleSettings) {
            this._applySingleStyle(key, this.defaultStyleSettings[key]); // Apply to CSS
        }
        if (typeof saveSettingsCb === 'function') {
            saveSettingsCb();
        }
        if (typeof phoneShowNotification === 'function') phoneShowNotification("Styles reset to defaults.", "Settings");
    }

    // --- Submenu Panel Methods (for Main Menu) ---

    /**
     * Toggles the visibility of the main menu action buttons.
     * @param {boolean} show - True to show buttons, false to hide.
     */
    toggleMainMenuButtons(show) {
        if (!this.primaryActionsContainer) {
            debugLogger.warn('UIManager', 'Main menu button containers not found for toggling visibility.');
            return;
        }
        // The HTML structure has a single 'split-button-container' now.
        // It's hidden when a submenu panel is open.
        if (show) {
            this.primaryActionsContainer.classList.remove('hidden');
        } else {
            this.primaryActionsContainer.classList.add('hidden');
        }
        // The settings cog button remains visible to open settings again
    }

    /**
     * Opens a specified submenu panel on the main menu.
     * Hides the main menu action buttons.
     * @param {HTMLElement} panelElement - The DOM element of the submenu panel to open.
     */
    openSubmenuPanel(panelElement) {
        if (!panelElement) {
            debugLogger.warn('UIManager', 'Attempted to open a null submenu panel.');
            return;
        }
        this.toggleMainMenuButtons(false); // Hide main action buttons
        panelElement.classList.remove('hidden'); // Show the panel
    }

    /**
     * Closes a specified submenu panel on the main menu.
     * Shows the main menu action buttons again.
     * @param {HTMLElement} panelElement - The DOM element of the submenu panel to close.
     */
    closeSubmenuPanel(panelElement) {
        if (!panelElement) {
            debugLogger.warn('UIManager', 'Attempted to close a null submenu panel.');
            return;
        }
        panelElement.classList.add('hidden'); // Hide the panel
        this.toggleMainMenuButtons(true); // Show main action buttons
    }
}

// Export the UIManager class for use in other modules
export { UIManager };