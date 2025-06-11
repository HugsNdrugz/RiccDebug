// GameState.js
import { debugLogger } from './utils.js'; // Import the debug logger utility

/**
 * Manages all core game data and state, acting as the single source of truth.
 * This class is designed to be independent of UI concerns.
 */
class GameState {
    /**
     * Initializes the GameState with initial configuration.
     * @param {object} config - Configuration object containing starting values and constants.
     */
    constructor(config = {}) {
        // --- Core Game Progression State ---
        this.cash = config.STARTING_CASH ?? 0; // Player's current cash
        this.fiendsLeft = config.MAX_FIENDS ?? 0; // Number of customers left to serve
        this.dayOfWeek = config.DAYS ? config.DAYS[0] : 'Monday'; // Current day of the week
        this.gameActive = false; // Flag indicating if the game is currently active
        
        // --- Player Stats & Status ---
        this.heat = 0; // Player's current heat level (increases with risky actions)
        this.streetCred = config.STARTING_STREET_CRED ?? 0; // Player's reputation
        this.playerSkills = { // Player's customizable skills
            negotiator: 0,
            appraiser: 0,
            lowProfile: 0,
        };
        
        // --- Inventory & Items ---
        this.inventory = []; // Array of items currently in player's inventory
        this.MAX_INVENTORY_SLOTS = config.MAX_INVENTORY_SLOTS ?? 10; // Maximum inventory capacity
        
        // --- World & Events ---
        this.activeWorldEvents = []; // Array of currently active world events
        
        // --- Current Interaction State ---
        this.currentCustomerInstance = null; // The customer currently interacting with Rikk
        
        // --- Data References ---
        // Reference to customer templates (deep copied to prevent external mutation)
        this.customerTemplates = config.defaultCustomerTemplates ? JSON.parse(JSON.stringify(config.defaultCustomerTemplates)) : {};
        
        // --- Configuration Constants (stored for easy access) ---
        this.MAX_HEAT = config.MAX_HEAT ?? 100; // Maximum allowed heat
        this.DAYS_ARRAY = config.DAYS ?? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]; // Array of days
        
        this.DEBUG_MODE = config.DEBUG_MODE ?? false; // Debug mode flag
        
        // Initial console log to confirm instantiation
        if (this.DEBUG_MODE) {
            debugLogger.log('GameState', 'Initialized with config:', config);
        }
    }
    
    // --- Getters: Methods to retrieve current game state values ---
    getCash() { return this.cash; }
    getFiendsLeft() { return this.fiendsLeft; }
    getDayOfWeek() { return this.dayOfWeek; }
    isGameActive() { return this.gameActive; }
    getHeat() { return this.heat; }
    getStreetCred() { return this.streetCred; }
    getPlayerSkills() { return { ...this.playerSkills }; } // Return a shallow copy to prevent direct external modification
    getInventory() { return [...this.inventory]; } // Return a shallow copy of the inventory array
    getActiveWorldEvents() { return [...this.activeWorldEvents]; } // Return a shallow copy of active events
    getCurrentCustomerInstance() { return this.currentCustomerInstance; }
    getCustomerTemplates() { return JSON.parse(JSON.stringify(this.customerTemplates)); } // Return deep copy to prevent external mutation
    getMaxHeat() { return this.MAX_HEAT; }
    getMaxInventorySlots() { return this.MAX_INVENTORY_SLOTS; }
    getDaysArray() { return this.DAYS_ARRAY; }
    
    // Placeholder for a tool effect check. This method is called in script.js's applyDealHeat.
    // In a full implementation, GameState would track active tool effects (e.g., from player inventory).
    isToolEffectActive(toolId) {
        // This is a mock implementation. A real implementation would check player.activeTools array
        // or iterate through inventory for active tools.
        // For now, it always returns false, meaning applyDealHeat will not reduce heat due to a burner phone.
        return false;
    }
    
    // --- Setters & Modifiers: Methods to update game state values ---
    setCash(amount) { this.cash = amount; }
    addCash(amount) { this.cash += amount; }
    removeCash(amount) { this.cash -= amount; }
    
    setFiendsLeft(count) { this.fiendsLeft = count; }
    decrementFiendsLeft() { this.fiendsLeft--; }
    
    setDayOfWeek(day) { this.dayOfWeek = day; }
    /**
     * Advances the day of the week to the next day in the cycle.
     */
    advanceDayOfWeek() {
        const currentIndex = this.DAYS_ARRAY.indexOf(this.dayOfWeek);
        this.dayOfWeek = this.DAYS_ARRAY[(currentIndex + 1) % this.DAYS_ARRAY.length];
    }
    
    setGameActive(isActive) { this.gameActive = isActive; }
    
    setHeat(value) { this.heat = Math.max(0, Math.min(value, this.MAX_HEAT)); } // Clamp heat between 0 and MAX_HEAT
    addHeat(value) { this.setHeat(this.heat + value); } // Use setHeat to ensure clamping
    decreaseHeat(value) { this.setHeat(this.heat - value); } // Use setHeat to ensure clamping
    
    setStreetCred(value) { this.streetCred = Math.max(0, value); } // Ensure street cred doesn't go below 0
    addStreetCred(value) { this.setStreetCred(this.streetCred + value); } // Use setStreetCred
    
    /**
     * Updates a specific player skill by a given value.
     * @param {string} skillName - The name of the skill to update (e.g., 'negotiator').
     * @param {number} valueChange - The amount to change the skill by.
     */
    updatePlayerSkill(skillName, valueChange) {
        if (this.playerSkills.hasOwnProperty(skillName)) {
            this.playerSkills[skillName] = Math.max(0, this.playerSkills[skillName] + valueChange); // Skills cannot go below 0
        } else {
            if (this.DEBUG_MODE) debugLogger.warn('GameState', `Attempted to update unknown skill: ${skillName}`);
        }
    }
    setPlayerSkills(skillsObject) { this.playerSkills = { ...this.playerSkills, ...skillsObject }; } // Merge new skills
    
    setInventory(inventoryArray) { this.inventory = [...inventoryArray]; }
    /**
     * Adds an item to the player's inventory if there is space.
     * @param {object} item - The item object to add.
     * @returns {boolean} True if the item was added, false if inventory is full.
     */
    addItemToInventory(item) {
        if (this.inventory.length < this.MAX_INVENTORY_SLOTS) {
            this.inventory.push(item);
            debugLogger.log('GameState', `Added item to inventory: ${item.name}`);
            return true;
        }
        if (this.DEBUG_MODE) debugLogger.warn('GameState', 'Inventory full. Cannot add item:', item);
        return false;
    }
    /**
     * Removes an item from the player's inventory by its ID.
     * @param {string} itemId - The ID of the item to remove.
     * @returns {object|null} The removed item object, or null if not found.
     */
    removeItemFromInventoryById(itemId) {
        const itemIndex = this.inventory.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            const removedItem = this.inventory.splice(itemIndex, 1)[0];
            debugLogger.log('GameState', `Removed item from inventory: ${removedItem.name}`);
            return removedItem;
        }
        if (this.DEBUG_MODE) debugLogger.warn('GameState', `Item with id ${itemId} not found in inventory.`);
        return null;
    }
    /**
     * Checks if the player's inventory is full.
     * @returns {boolean} True if inventory is full, false otherwise.
     */
    isInventoryFull() {
        return this.inventory.length >= this.MAX_INVENTORY_SLOTS;
    }
    
    setActiveWorldEvents(eventsArray) { this.activeWorldEvents = [...eventsArray]; }
    addActiveWorldEvent(event) { this.activeWorldEvents.push(event); }
    updateActiveWorldEvents(updatedEvents) { this.activeWorldEvents = updatedEvents; }
    
    setCurrentCustomerInstance(customer) { this.currentCustomerInstance = customer; }
    clearCurrentCustomerInstance() { this.currentCustomerInstance = null; }
    
    updateCustomerTemplates(newTemplates) {
        this.customerTemplates = JSON.parse(JSON.stringify(newTemplates)); // Deep copy the new templates
        debugLogger.log('GameState', 'Customer templates updated.');
    }
    
    // --- Reset & Initialization: Methods to reset the game state ---
    /**
     * Resets the entire game state to its default starting values based on the provided config.
     * @param {object} config - The configuration object used for initial setup.
     */
    resetToDefault(config = {}) {
        this.cash = config.STARTING_CASH ?? 0;
        this.fiendsLeft = config.MAX_FIENDS ?? 0;
        this.dayOfWeek = (config.DAYS ?? this.DAYS_ARRAY)[0];
        this.gameActive = false;
        this.heat = 0;
        this.streetCred = config.STARTING_STREET_CRED ?? 0;
        this.playerSkills = { negotiator: 0, appraiser: 0, lowProfile: 0 };
        this.inventory = [];
        this.activeWorldEvents = [];
        this.currentCustomerInstance = null;
        
        // Constants are typically set at construction and might not need reset unless config changes,
        // but included for completeness if defaults can be changed at runtime.
        this.MAX_INVENTORY_SLOTS = config.MAX_INVENTORY_SLOTS ?? this.MAX_INVENTORY_SLOTS;
        this.MAX_HEAT = config.MAX_HEAT ?? this.MAX_HEAT;
        this.DAYS_ARRAY = config.DAYS ?? this.DAYS_ARRAY;
        this.customerTemplates = config.defaultCustomerTemplates ? JSON.parse(JSON.stringify(config.defaultCustomerTemplates)) : this.customerTemplates;
        
        if (this.DEBUG_MODE) debugLogger.log('GameState', 'State reset to defaults.');
    }
    
    // --- Persistence: Methods for saving and loading game state ---
    /**
     * Converts the current game state into a JSON-serializable object for saving.
     * @returns {object} A plain object representing the current game state.
     */
    toJSON() {
        return {
            cash: this.cash,
            fiendsLeft: this.fiendsLeft,
            dayOfWeek: this.dayOfWeek,
            gameActive: this.gameActive,
            heat: this.heat,
            streetCred: this.streetCred,
            playerSkills: { ...this.playerSkills }, // Shallow copy
            inventory: [...this.inventory], // Shallow copy
            activeWorldEvents: [...this.activeWorldEvents], // Shallow copy
            // customerTemplates are handled by script.js's saveCustomerTemplates and loaded separately
            // Constants like MAX_INVENTORY_SLOTS, MAX_HEAT, DAYS_ARRAY are derived from config, not dynamic state to save.
        };
    }
    
    /**
     * Loads game state from a saved JSON object.
     * @param {object} savedState - The JSON object representing the saved game state.
     * @param {object} config - The configuration object, used for providing defaults if data is missing.
     */
    fromJSON(savedState, config = {}) {
        this.cash = savedState.cash ?? (config.STARTING_CASH ?? 0);
        this.fiendsLeft = savedState.fiendsLeft ?? (config.MAX_FIENDS ?? 0);
        this.dayOfWeek = savedState.dayOfWeek ?? ((config.DAYS ?? this.DAYS_ARRAY)[0]);
        this.gameActive = savedState.gameActive ?? false; // Game usually starts inactive from a load
        this.heat = savedState.heat ?? 0;
        this.streetCred = savedState.streetCred ?? (config.STARTING_STREET_CRED ?? 0);
        // Merge saved player skills with existing defaults to ensure all keys are present
        this.playerSkills = savedState.playerSkills ? { ...this.playerSkills, ...savedState.playerSkills } : this.playerSkills;
        this.inventory = savedState.inventory ? [...savedState.inventory] : [];
        this.activeWorldEvents = savedState.activeWorldEvents ? [...savedState.activeWorldEvents] : [];
        
        // customerTemplates are handled by script.js and ContactsAppManager for persistence
        // MAX_*, DAYS_ARRAY are derived from config, not loaded from state
        if (this.DEBUG_MODE) debugLogger.log('GameState', 'State loaded from saved data.');
    }
}

// Export the GameState class for use in other modules
export { GameState };