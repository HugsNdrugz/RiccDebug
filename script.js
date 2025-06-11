// =================================================================================
// My Nigga Rikk - Main Game Logic Script (Controller) - FINAL, REFACTORED BUILD
// =================================================================================
// This script is the definitive controller for the application. It has been fully
// refactored to delegate state management to GameState.js and all direct DOM
// manipulation to UIManager.js. This file coordinates the logic between modules.
// Compiled by AI Studio Operations Core.
// =================================================================================

// --- MODULE IMPORTS ---
import { initPhoneAmbientUI, showNotification as phoneShowNotification } from './phone_ambient_ui.js';
import { GameState } from './GameState.js';
import { UIManager } from './UIManager.js';
import { CustomerManager } from './classes/CustomerManager.js';
import { ContactsAppManager } from './classes/ContactsAppManager.js';
import { SlotGameManager } from './classes/SlotGameManager.js';
import { customerTemplates as defaultCustomerTemplates } from './data/customer_templates.js';
import { itemTypes, ITEM_QUALITY_LEVELS, ITEM_QUALITY_MODIFIERS } from './data/data_items.js';
import { possibleWorldEvents } from './data/data_events.js';
import { getRandomElement, isLocalStorageAvailable, debugLogger, DEBUG_MODE } from './utils.js';

// =================================================================================
// I. CONFIGURATION & INITIALIZATION
// =================================================================================

// --- Global Constants & Game Configuration ---
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const CUSTOMER_WAIT_TIME = 1100;
const KNOCK_ANIMATION_DURATION = 1000;
const SAVE_KEY = 'myNiggaRikkSaveDataV10';
const STYLE_SETTINGS_KEY = 'rikkGameStyleSettingsV1';
const CUSTOMER_TEMPLATES_SAVE_KEY = 'rikkGameCustomerTemplatesV1';
const STARTING_CASH = 500;
const MAX_FIENDS = 15;
const SPLASH_SCREEN_DURATION = 2500;
const STARTING_STREET_CRED = 0;
const MAX_HEAT = 100;
const MAX_INVENTORY_SLOTS = 10;
const APP_CONTAINER_SELECTOR = '#game-viewport';

const defaultStyleSettings = {
    '--color-dark-bg': '#121212',
    '--color-surface': '#1e1e1e',
    '--color-primary': '#bb86fc',
    '--color-secondary': '#03dac6',
    '--color-on-surface': '#e0e0e0',
    '--color-on-primary': '#000000',
    '--color-accent-gold': '#f39c12',
    '--color-error': '#cf6679',
    '--color-success-green': '#2ecc71',
    '--font-body': "'Roboto', 'Open Sans', sans-serif",
    '--font-display': "'Press Start 2P', 'Comic Neue', cursive",
    '--viewport-border-radius': '12',
    '--phone-border-radius': '28',
    '--modal-border-radius': '10',
    '--button-border-radius': '8',
    '--spacing-unit': '8'
};

// --- TTS Configuration (Added to resolve ReferenceError) ---
const TTS_ENABLED = false; // Set to true to enable TTS, requires API key
const ELEVENLABS_API_KEY = null; // Replace with your ElevenLabs API Key if TTS_ENABLED
const ELEVENLABS_VOICE_ID_CUSTOMER = 'YOUR_CUSTOMER_VOICE_ID'; // Placeholder: replace with actual ElevenLabs voice ID
const ELEVENLABS_VOICE_ID_RIKK = 'YOUR_RIKK_VOICE_ID'; // Placeholder: replace with actual ElevenLabs voice ID
const ELEVENLABS_API_ENDPOINT_BASE = 'https://api.elevenlabs.io/v1/text-to-speech/';

// --- Avatars (For chat UI) ---
const customerAvatars = {
    "DESPERATE_FIEND": "https://randomuser.me/api/portraits/men/32.jpg",
    "HIGH_ROLLER": "https://randomuser.me/api/portraits/men/45.jpg",
    "REGULAR_JOE": "https://randomuser.me/api/portraits/women/67.jpg",
    "INFORMANT": "https://randomuser.me/api/portraits/men/78.jpg",
    "SNITCH": "https://randomuser.me/api/portraits/women/12.jpg",
    "STIMULANT_USER": "https://randomuser.me/api/portraits/men/9.jpg",
    "PSYCHEDELIC_EXPLORER": "https://randomuser.me/api/portraits/men/7.jpg"
};
const rikkAvatarUrl = "https://randomuser.me/api/portraits/men/9.jpg";
const systemAvatarUrl = "assets/icons/info-icon.svg";

// --- Prepare Configuration Objects ---
const gameStateConfig = {
    STARTING_CASH,
    MAX_FIENDS,
    DAYS: days,
    STARTING_STREET_CRED,
    MAX_INVENTORY_SLOTS,
    MAX_HEAT,
    defaultCustomerTemplates,
    DEBUG_MODE
};

const uiManagerConfig = {
    APP_CONTAINER_SELECTOR,
    customerAvatars,
    rikkAvatarUrl,
    systemAvatarUrl,
    defaultStyleSettings,
    styleSettingsKey: STYLE_SETTINGS_KEY
};

// --- Instantiate Core Classes ---
const game = new GameState(gameStateConfig);
const uiManager = new UIManager(game, uiManagerConfig);

// --- State Variables ---
const localStorageAvailable = isLocalStorageAvailable();
let audioQueue = [];
let isPlayingAudio = false;

// =================================================================================
// II. HELPER & UTILITY FUNCTIONS
// =================================================================================

function getCombinedActiveEventEffects() {
    const activeEvents = game.getActiveWorldEvents();
    const combinedEffects = {
        heatModifier: 1,
        customerScareChance: 0,
        drugPriceModifier: 1,
        drugDemandModifier: 1,
        dealFailChance: 0,
        itemScarcity: false,
        allPriceModifier: 1,
        specificItemDemand: []
    };

    activeEvents.forEach(event => {
        if (!event.effects) return;
        if (event.effects.heatModifier) combinedEffects.heatModifier *= event.effects.heatModifier;
        if (event.effects.customerScareChance) combinedEffects.customerScareChance = Math.max(combinedEffects.customerScareChance, event.effects.customerScareChance);
        if (event.effects.drugPriceModifier) combinedEffects.drugPriceModifier *= event.effects.drugPriceModifier;
        if (event.effects.drugDemandModifier) combinedEffects.drugDemandModifier *= event.effects.drugDemandModifier;
        if (event.effects.dealFailChance) combinedEffects.dealFailChance = Math.max(combinedEffects.dealFailChance, event.effects.dealFailChance);
        if (event.effects.itemScarcity) combinedEffects.itemScarcity = true;
        if (event.effects.allPriceModifier) combinedEffects.allPriceModifier *= event.effects.allPriceModifier;
        if (event.effects.specificItemDemand && Array.isArray(event.effects.specificItemDemand)) {
            event.effects.specificItemDemand.forEach(item => {
                if (!combinedEffects.specificItemDemand.includes(item)) {
                    combinedEffects.specificItemDemand.push(item);
                }
            });
        }
    });
    return combinedEffects;
}

function applyDealHeat(baseHeat, gameInstance) {
    if (gameInstance.isToolEffectActive && gameInstance.isToolEffectActive('burner_phone')) {
        debugLogger.log('applyDealHeat', 'Burner phone active, reducing deal heat.', { originalHeat: baseHeat });
        return Math.round(baseHeat * 0.5);
    }
    return baseHeat;
}

// =================================================================================
// III. CORE GAME INITIALIZATION & FLOW
// =================================================================================

function saveCustomerTemplates() {
    if (!localStorageAvailable) return;
    try {
        const templatesToSave = game.getCustomerTemplates();
        localStorage.setItem(CUSTOMER_TEMPLATES_SAVE_KEY, JSON.stringify(templatesToSave));
    } catch (error) {
        console.error('Failed to save customer templates:', error);
    }
}

function loadCustomerTemplates() {
    let loadedTemplates = JSON.parse(JSON.stringify(defaultCustomerTemplates)); // Start with defaults
    if (!localStorageAvailable) {
        game.updateCustomerTemplates(loadedTemplates);
        return;
    }
    try {
        const savedTemplatesString = localStorage.getItem(CUSTOMER_TEMPLATES_SAVE_KEY);
        if (savedTemplatesString) {
            const parsed = JSON.parse(savedTemplatesString);
            if (typeof parsed === 'object' && parsed !== null && Object.keys(parsed).length > 0) {
                loadedTemplates = parsed;
            } else {
                localStorage.removeItem(CUSTOMER_TEMPLATES_SAVE_KEY);
            }
        }
    } catch (error) {
        console.error('Error loading customer templates:', error);
        localStorage.removeItem(CUSTOMER_TEMPLATES_SAVE_KEY);
    }
    game.updateCustomerTemplates(loadedTemplates);
}

function initializeManagers() {
    loadCustomerTemplates();
    const currentTemplates = game.getCustomerTemplates();

    game.customerManager = new CustomerManager(currentTemplates, itemTypes, ITEM_QUALITY_LEVELS, ITEM_QUALITY_MODIFIERS);
    game.contactsAppManager = new ContactsAppManager(uiManager.contactsAppView, currentTemplates);
    game.slotGameManager = new SlotGameManager(
        uiManager.slotGameView,
        () => game.getCash(), 
        (newCash) => {
            game.setCash(newCash);
            uiManager.updateHUD();
        }
    );

    if (uiManager.contactsAppView) {
        uiManager.contactsAppView.addEventListener('customerTemplatesUpdated', (event) => {
            if (event.detail && event.detail.updatedTemplates) {
                game.updateCustomerTemplates(event.detail.updatedTemplates);
                saveCustomerTemplates();
                game.customerManager = new CustomerManager(game.getCustomerTemplates(), itemTypes, ITEM_QUALITY_LEVELS, ITEM_QUALITY_MODIFIERS);
                phoneShowNotification('Contact templates updated and saved!', 'Contacts App');
            }
        });
    }
}

function setupEventListeners() {
    if (uiManager.newGameBtn) uiManager.newGameBtn.addEventListener('click', handleStartNewGameClick);
    if (uiManager.continueGameBtn) uiManager.continueGameBtn.addEventListener('click', handleContinueGameClick);
    if (uiManager.restartGameBtn) uiManager.restartGameBtn.addEventListener('click', handleRestartGameClick);
    if (uiManager.nextCustomerBtn) uiManager.nextCustomerBtn.addEventListener('click', nextFiend);
    if (uiManager.openInventoryBtn) uiManager.openInventoryBtn.addEventListener('click', () => uiManager.openInventoryModal());
    if (uiManager.closeModalBtn) uiManager.closeModalBtn.addEventListener('click', () => uiManager.closeInventoryModal());
    if (uiManager.inventoryModal) uiManager.inventoryModal.addEventListener('click', (e) => {
        if (e.target === uiManager.inventoryModal) uiManager.closeInventoryModal();
    });
    if (uiManager.rikkPhoneUI) {
        uiManager.rikkPhoneUI.querySelectorAll('.app-icon, .dock-icon').forEach(icon => icon.addEventListener('click', handlePhoneAppClick));
    }
    if (uiManager.phoneBackButtons) uiManager.phoneBackButtons.forEach(btn => btn.addEventListener('click', handlePhoneAppClick));
    if (uiManager.phoneDockedIndicator) uiManager.phoneDockedIndicator.addEventListener('click', () => uiManager.setPhoneUIState('home'));
    if (uiManager.dockPhoneBtn) uiManager.dockPhoneBtn.addEventListener('click', () => uiManager.setPhoneUIState('docked'));
    if (uiManager.settingsMenuBtn) {
        uiManager.settingsMenuBtn.addEventListener('click', () => uiManager.openSubmenuPanel(uiManager.settingsMenuPanel));
    }
    if (uiManager.allSubmenuBackBtns) uiManager.allSubmenuBackBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            const panelToClose = event.target.closest('.submenu-panel');
            if (panelToClose) uiManager.closeSubmenuPanel(panelToClose);
        });
    });
}

function initializeUIAndSettings() {
    if (uiManager.splashScreen) {
        uiManager.showScreen(uiManager.splashScreen);
        setTimeout(() => {
            uiManager.showScreen(uiManager.startScreen);
            uiManager.activateMainMenuLights(true);
            checkForSavedGame();
        }, SPLASH_SCREEN_DURATION);
    }
    uiManager.initStyleControls(saveStyleSettings);
    uiManager.loadAndApplyStyleSettings();
    if (uiManager.rikkPhoneUI) {
        initPhoneAmbientUI(uiManager.rikkPhoneUI);
    }
}

function initGame() {
    try {
        uiManager.initDOMReferences();
        initializeManagers();
        initializeUIAndSettings();
        setupEventListeners();
    } catch (error) {
        console.error("CRITICAL ERROR during game initialization:", error);
    }
}

function initializeNewGameState() {
    clearSavedGameState();
    game.resetToDefault(gameStateConfig);
    if (game.customerManager) game.customerManager.reset();
    uiManager.updateEventTicker();
}

function startGameFlow() {
    uiManager.activateMainMenuLights(false);
    game.setGameActive(true);
    uiManager.showScreen(uiManager.gameScreen);
    uiManager.setPhoneUIState('home');
    uiManager.updateHUD();
    uiManager.updateInventoryDisplay();
    uiManager.clearChat();
    uiManager.clearChoices();
    nextFiend();
}

function endGame(reason) {
    game.setGameActive(false);
    uiManager.showScreen(uiManager.endScreen);
    if (uiManager.finalDaysDisplay) uiManager.finalDaysDisplay.textContent = gameStateConfig.MAX_FIENDS - game.getFiendsLeft();
    if (uiManager.finalCashDisplay) uiManager.finalCashDisplay.textContent = game.getCash();
    if (uiManager.finalCredDisplay) uiManager.finalCredDisplay.textContent = game.getStreetCred();

    let verdict = "";
    if (reason === "heat") {
        verdict = `The block's too hot, nigga! 5-0 swarming. Heat: ${game.getHeat()}. Time to ghost.`;
    } else if (reason === "bankrupt") {
        verdict = "Broke as a joke, and empty handed. Can't hustle on E, fam.";
    } else if (reason === "completed") {
        if (game.getCash() >= STARTING_CASH * 3) {
            verdict = "You a certified KINGPIN! The streets whisper your name.";
        } else if (game.getCash() >= STARTING_CASH * 1.5) {
            verdict = "Solid hustle, G. Made bank and respect.";
        } else {
            verdict = "Broke even or worse. Gotta step your game up, Rikk.";
        }
    }
    if (uiManager.finalVerdictText) {
        uiManager.finalVerdictText.textContent = verdict;
        uiManager.finalVerdictText.style.color = (reason === "heat" || reason === "bankrupt") ? "var(--color-error)" : (game.getCash() > STARTING_CASH ? "var(--color-success-green)" : "var(--color-accent-orange)");
    }
    uiManager.setPhoneUIState('offscreen');
    clearSavedGameState();
}

function handleTurnProgressionAndEvents() {
    game.advanceDayOfWeek();
    let currentEvents = game.getActiveWorldEvents();
    currentEvents.forEach(eventState => eventState.turnsLeft--);
    game.setActiveWorldEvents(currentEvents.filter(eventState => eventState.turnsLeft > 0));

    let worldEventsState = game.getActiveWorldEvents();
    if (!(worldEventsState.length > 0 && Math.random() < 0.7)) {
        worldEventsState = worldEventsState.filter(event => event.turnsLeft > 0);
        if (possibleWorldEvents.length > 0 && Math.random() < 0.25 && worldEventsState.length === 0) {
            const eventTemplate = getRandomElement(possibleWorldEvents);
            worldEventsState.push({ ...eventTemplate, turnsLeft: eventTemplate.duration });
        }
        game.setActiveWorldEvents(worldEventsState);
    }
    uiManager.updateEventTicker();

    const skills = game.getPlayerSkills();
    const worldEffects = getCombinedActiveEventEffects();
    let passiveHeatChange = -(1 + (skills.lowProfile || 0));
    if (worldEffects.heatModifier !== 0) {
        passiveHeatChange /= worldEffects.heatModifier;
    }
    if (game.isToolEffectActive && game.isToolEffectActive('info_cops')) {
        passiveHeatChange -= 2;
    }
    game.addHeat(Math.round(passiveHeatChange));
    uiManager.updateHUD();
}

function setupUIForNewInteraction() {
    uiManager.clearChat();
    uiManager.clearChoices();
    uiManager.setNextCustomerButtonDisabled(true);
    uiManager.setPhoneUIState('docked');
    uiManager.playSound(uiManager.doorKnockSound);
    uiManager.displayKnockEffect(game.getDayOfWeek());
}

function generateAndStartCustomerInteraction() {
    uiManager.hideKnockEffect();
    const combinedWorldEffects = getCombinedActiveEventEffects();
    const gameStateForCustomerManager = {
        inventory: game.getInventory(),
        cash: game.getCash(),
        playerSkills: game.getPlayerSkills(),
        activeWorldEvents: game.getActiveWorldEvents(),
        combinedWorldEffects: combinedWorldEffects
    };
    const interaction = game.customerManager.generateInteraction(gameStateForCustomerManager);
    game.setCurrentCustomerInstance(interaction.instance);
    startCustomerInteraction(interaction);
}

function nextFiend() {
    if (!game.isGameActive() || game.getFiendsLeft() <= 0) {
        endGame("completed");
        return;
    }
    try {
        handleTurnProgressionAndEvents();
        setupUIForNewInteraction();
        setTimeout(() => {
            try {
                generateAndStartCustomerInteraction();
            } catch (e) {
                console.error("[SCRIPT ERROR in generateAndStartCustomerInteraction]", e);
                if (uiManager.nextCustomerBtn) uiManager.nextCustomerBtn.disabled = true;
                phoneShowNotification("Oops! A glitch in the matrix. Try restarting if issues persist.", "System Error");
            }
        }, KNOCK_ANIMATION_DURATION);
    } catch (e) {
        console.error("[SCRIPT ERROR in nextFiend main block]", e);
        debugLogger.error('nextFiend', 'Critical error in turn progression', e);
        if (uiManager.nextCustomerBtn) uiManager.nextCustomerBtn.disabled = true;
        phoneShowNotification("An error occurred. Things might be unstable.", "System Error");
    }
    saveGameState();
}

function startCustomerInteraction(interaction) {
    uiManager.setPhoneUIState('chatting');
    uiManager.setPhoneTitle(interaction.name);
    phoneShowNotification(`Incoming message from: ${interaction.name}`, "New Customer");
    uiManager.clearChat();
    let dialogueIndex = 0;
    const displayNext = () => {
        if (dialogueIndex < interaction.dialogue.length) {
            const msg = interaction.dialogue[dialogueIndex];
            dialogueIndex++;
            queueNextMessage(msg.text, msg.speaker, () => {
                setTimeout(displayNext, CUSTOMER_WAIT_TIME);
            });
        } else {
            uiManager.displayChoices(interaction.choices, handleChoice);
        }
    };
    displayNext();
}

function endCustomerInteraction() {
    uiManager.clearChoices();
    uiManager.setPhoneTitle('Street Talk');
    game.clearCurrentCustomerInstance();
    uiManager.setPhoneUIState('home');
    if (game.isGameActive() && game.getFiendsLeft() > 0 && game.getHeat() < game.getMaxHeat() && (game.getCash() > 0 || game.getInventory().length > 0)) {
        uiManager.setNextCustomerButtonDisabled(false);
    } else if (game.isGameActive()) {
        uiManager.setNextCustomerButtonDisabled(true);
        if (game.getHeat() >= game.getMaxHeat()) endGame("heat");
        else if (game.getCash() <= 0 && game.getInventory().length === 0) endGame("bankrupt");
        else if (game.getFiendsLeft() <= 0) endGame("completed");
    }
    saveGameState();
}

// =================================================================================
// IV. UI HANDLERS & EVENT LOGIC
// =================================================================================

function saveStyleSettings() {
    uiManager.saveStyleSettingsToStorage();
}

function handleStartNewGameClick() {
    initializeNewGameState();
    startGameFlow();
}

function handleContinueGameClick() {
    if (loadGameState()) {
        startGameFlow();
    } else {
        uiManager.displayPhoneMessage("System: No saved game found.", "narration");
        initializeNewGameState();
        startGameFlow();
    }
}

function handleRestartGameClick() {
    initializeNewGameState();
    startGameFlow();
}

function handlePhoneAppClick(event) {
    const action = event.currentTarget.dataset.action;
    switch (action) {
        case 'messages':
            if (uiManager.nextCustomerBtn && !uiManager.nextCustomerBtn.disabled && game.getFiendsLeft() > 0 && game.isGameActive()) {
                nextFiend();
            } else if (game.getCurrentCustomerInstance()) {
                uiManager.setPhoneUIState('chatting');
            } else {
                phoneShowNotification("No new messages.", "Rikk's Inbox");
            }
            break;
        case 'inventory-app':
            uiManager.openInventoryModal();
            break;
        case 'contacts-app':
            uiManager.setPhoneUIState('contacts');
            break;
        case 'slot-game':
            uiManager.setPhoneUIState('slots');
            game.slotGameManager.launch(); 
            break;
        case 'theme-settings':
            uiManager.setPhoneUIState('theme-settings');
            break;
        case 'back-to-home':
            uiManager.setPhoneUIState('home');
            game.slotGameManager.stop(); // Stop slot game when returning to home screen
            break;
        default:
            phoneShowNotification(`App "${action}" not implemented.`, "System");
            break;
    }
}

function queueNextMessage(message, speaker, callback) {
    audioQueue.push({ message, speaker, callback });
    if (!isPlayingAudio) {
        processAudioQueue();
    }
}

function processAudioQueue() {
    if (audioQueue.length === 0) {
        isPlayingAudio = false;
        return;
    }
    isPlayingAudio = true;
    const { message, speaker, callback } = audioQueue.shift();
    if (!TTS_ENABLED || speaker === 'narration' || !ELEVENLABS_API_KEY) {
        uiManager.playSound(uiManager.chatBubbleSound);
        uiManager.displayPhoneMessage(message, speaker);
        if (callback) callback();
        setTimeout(() => processAudioQueue(), 400);
        return;
    }
    const voiceId = speaker === 'customer' ? ELEVENLABS_VOICE_ID_CUSTOMER : ELEVENLABS_VOICE_ID_RIKK;
    const url = `${ELEVENLABS_API_ENDPOINT_BASE}${voiceId}`;
    const headers = { "xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg" };
    const ttsPayload = { text: message.replace(/\*\*|[\*_]/g, ''), model_id: "eleven_monolingual_v1", voice_settings: { stability: 0.5, similarity_boost: 0.75 } };
    fetch(url, { method: "POST", headers: headers, body: JSON.stringify(ttsPayload) })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.blob();
        })
        .then(audioBlob => {
            const audioUrl = URL.createObjectURL(audioBlob);
            uiManager.displayPhoneMessage(message, speaker);
            const audio = new Audio(audioUrl);
            audio.volume = 0.8;
            audio.play().catch(e => { console.error("TTS Audio Playback Error:", e); });
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                if (callback) callback();
                processAudioQueue();
            };
        })
        .catch(err => {
            console.error("Error with ElevenLabs TTS:", err);
            uiManager.displayPhoneMessage(`TTS service failed. Displaying text only.`, "narration");
            uiManager.playSound(uiManager.chatBubbleSound);
            uiManager.displayPhoneMessage(message, speaker);
            if (callback) callback();
            processAudioQueue();
        });
}

function displaySystemMessage(message) {
    uiManager.displayPhoneMessage(message, 'narration');
    phoneShowNotification(message, "System Alert");
}

function handleChoice(outcome) {
    const currentCustomer = game.getCurrentCustomerInstance();
    if (!currentCustomer) {
        console.error("handleChoice called with no active customer instance from GameState.");
        return;
    }
    try {
        uiManager.clearChoices();
        const combinedWorldEffects = getCombinedActiveEventEffects();
        const nonDealOutcomes = ["decline_offer_to_buy", "decline_offer_to_sell", "acknowledge_empty_stash", "acknowledge_error", "end_interaction", "end_interaction_scared", "end_interaction_no_item"];
        if (!nonDealOutcomes.includes(outcome.type) && combinedWorldEffects.dealFailChance > 0 && Math.random() < combinedWorldEffects.dealFailChance) {
            const failMsg = game.getCurrentCustomerInstance() ? `${game.getCurrentCustomerInstance().name} suddenly gets spooked and calls it off!` : "The deal just fell through... damn.";
            uiManager.displayPhoneMessage(failMsg, "narration");
            game.decrementFiendsLeft();
            uiManager.updateHUD();
            setTimeout(endCustomerInteraction, CUSTOMER_WAIT_TIME * 1.5);
            return;
        }

        let narrationText = "";
        let dealSuccess = false;
        let dialogueContextKey = '';

        switch (outcome.type) {
            case "buy_from_customer":
                if (game.getCash() >= outcome.price && !game.isInventoryFull()) {
                    game.removeCash(outcome.price);
                    game.addItemToInventory({ ...outcome.item });
                    dealSuccess = true;
                    narrationText = `Rikk copped "${outcome.item.name}".`;
                    uiManager.playSound(uiManager.cashSound);
                    dialogueContextKey = 'rikkBuysSuccess';
                } else {
                    narrationText = `Deal failed. ${(game.isInventoryFull()) ? "Stash full." : "Not enough cash."}`;
                    uiManager.playSound(uiManager.deniedSound);
                    dialogueContextKey = 'lowCashRikk';
                }
                break;
            case "sell_to_customer":
                const soldItem = game.removeItemFromInventoryById(outcome.item.id);
                if (soldItem) {
                    game.addCash(outcome.price);
                    dealSuccess = true;
                    narrationText = `Flipped "${soldItem.name}" for $${outcome.price}.`;
                    uiManager.playSound(uiManager.cashSound);
                    dialogueContextKey = 'rikkSellsSuccess';
                    if (game.customerManager && typeof game.customerManager.processPotentialAddiction === 'function') {
                        game.customerManager.processPotentialAddiction(currentCustomer, soldItem);
                    }
                } else {
                    narrationText = "Couldn't find that item.";
                    uiManager.playSound(uiManager.deniedSound);
                }
                break;
            case "negotiate_sell":
                setTimeout(() => {
                    if (Math.random() < 0.55 + (game.getPlayerSkills().negotiator * 0.12)) {
                        const negoSuccessResult = game.customerManager.getOutcomeDialogue(currentCustomer, 'negotiationSuccess');
                        queueNextMessage(`Negotiation successful! ${negoSuccessResult.line}`, 'customer', () => {
                            handleChoice({ type: "sell_to_customer", item: outcome.item, price: outcome.proposedPrice });
                        });
                    } else {
                        const negoFailResult = game.customerManager.getOutcomeDialogue(currentCustomer, 'negotiationFail');
                        queueNextMessage(`They ain't having it. ${negoFailResult.line}`, 'customer', () => {
                            const choices = [{ text: `Sell ($${outcome.originalOffer})`, outcome: { type: "sell_to_customer", item: outcome.item, price: outcome.originalOffer } }, { text: `Decline`, outcome: { type: "decline_offer_to_sell" } }];
                            uiManager.displayChoices(choices, handleChoice);
                        });
                    }
                }, 1000);
                return;
            case "decline_offer_to_buy":
                narrationText = "Rikk passes on the offer.";
                uiManager.playSound(uiManager.deniedSound);
                dialogueContextKey = 'rikkDeclinesToBuy';
                break;
            case "decline_offer_to_sell":
                narrationText = "Rikk tells them to kick rocks.";
                uiManager.playSound(uiManager.deniedSound);
                dialogueContextKey = 'rikkDeclinesToSell';
                break;
            case "acknowledge_empty_stash":
                narrationText = "Rikk's stash is dry. Customer ain't happy.";
                uiManager.playSound(uiManager.deniedSound);
                dialogueContextKey = 'acknowledge_empty_stash';
                break;
            case "acknowledge_error":
                narrationText = "System error acknowledged.";
                break;
        }

        if (outcome.type !== "negotiate_sell") {
            game.decrementFiendsLeft();
        }

        const outcomeResult = dialogueContextKey ? game.customerManager.getOutcomeDialogue(currentCustomer, dialogueContextKey) : { line: '', payload: null };
        if (outcome.payload) processPayload(outcome.payload, dealSuccess);
        if (outcomeResult.payload) processPayload(outcomeResult.payload, dealSuccess);

        const customerForCredConfig = game.getCurrentCustomerInstance();
        if (customerForCredConfig && customerForCredConfig.archetypeKey) {
            const allTemplates = game.getCustomerTemplates();
            const customerTemplateData = allTemplates[customerForCredConfig.archetypeKey];
            if (customerTemplateData && customerTemplateData.gameplayConfig) {
                const config = customerTemplateData.gameplayConfig;
                if (dealSuccess) {
                    if (outcome.type === "sell_to_customer" && typeof config.credImpactSell === 'number') {
                        game.addStreetCred(config.credImpactSell);
                    } else if (outcome.type === "buy_from_customer" && typeof config.credImpactBuy === 'number') {
                        game.addStreetCred(config.credImpactBuy);
                    }
                }
            }
        }

        uiManager.updateHUD();
        uiManager.updateInventoryDisplay();

        const followUp = () => {
            if (outcomeResult.line && outcomeResult.line.trim() !== "") {
                queueNextMessage(outcomeResult.line, 'customer', () => {
                    setTimeout(endCustomerInteraction, CUSTOMER_WAIT_TIME * 1.5);
                });
            } else {
                setTimeout(endCustomerInteraction, CUSTOMER_WAIT_TIME * 1.5);
            }
        };

        if (narrationText.trim() !== "") {
            queueNextMessage(narrationText, 'narration', followUp);
        } else {
            followUp();
        }

        if (game.getHeat() >= game.getMaxHeat()) endGame("heat");
        else if (game.getCash() <= 0 && game.getInventory().length === 0 && game.getFiendsLeft() > 0) endGame("bankrupt");

    } catch (e) {
        console.error("[SCRIPT ERROR in handleChoice]", e);
        debugLogger.error('handleChoice', 'Error processing player choice', e);
        phoneShowNotification("Error processing that action. Please try again or proceed.", "System Error");
        endCustomerInteraction();
    }
}

function processPayload(payload, dealSuccess) {
    if (!payload || !payload.effects || payload.type !== "EFFECT") return;
    const currentCustomer = game.getCurrentCustomerInstance();
    const worldEffects = getCombinedActiveEventEffects();
    payload.effects.forEach(effect => {
        if (effect.condition) {
            if (effect.condition.stat === 'dealSuccess' && dealSuccess !== effect.condition.value) return;
            if (effect.condition.stat === 'mood' && currentCustomer && currentCustomer.mood !== effect.condition.value) return;
        }
        switch (effect.type) {
            case 'modifyStat':
                if (effect.statToModify && typeof effect.value === 'number') {
                    let valueToApply = effect.value;
                    if (effect.statToModify === 'heat' && valueToApply > 0) {
                        valueToApply = Math.round(valueToApply * worldEffects.heatModifier);
                        valueToApply = applyDealHeat(valueToApply, game);
                    }
                    const statMap = {
                        'cash': () => game.addCash(valueToApply),
                        'heat': () => game.addHeat(valueToApply),
                        'streetCred': () => game.addStreetCred(valueToApply),
                        'playerSkills.negotiator': () => game.updatePlayerSkill('negotiator', valueToApply),
                        'playerSkills.appraiser': () => game.updatePlayerSkill('appraiser', valueToApply),
                        'playerSkills.lowProfile': () => game.updatePlayerSkill('lowProfile', valueToApply)
                    };
                    if (statMap[effect.statToModify]) {
                        statMap[effect.statToModify]();
                    } else {
                        debugLogger.warn('PayloadSystem', `Unknown statToModify: ${effect.statToModify}`);
                    }
                }
                break;
            case 'triggerEvent':
                if (Math.random() < effect.chance && currentCustomer) {
                    let message = effect.message || '';
                    if (effect.eventName === 'snitchReport') {
                        let heatGain = Math.round((Math.floor(Math.random() * (effect.heatValueMax - effect.heatValueMin + 1)) + effect.heatValueMin) * worldEffects.heatModifier);
                        heatGain = applyDealHeat(heatGain, game);
                        game.addHeat(heatGain);
                        game.addStreetCred(effect.credValue);
                        message = message.replace('[CUSTOMER_NAME]', currentCustomer.name).replace('[HEAT_VALUE]', heatGain);
                    } else if (effect.eventName === 'highRollerTip') {
                        const tip = Math.floor(game.getCash() * effect.tipPercentage);
                        game.addCash(tip);
                        game.addStreetCred(effect.credValue);
                        message = message.replace('[CUSTOMER_NAME]', currentCustomer.name).replace('[TIP_AMOUNT]', tip);
                    } else if (effect.eventName === 'publicIncident') {
                        let heatValue = Math.round(effect.heatValue * worldEffects.heatModifier);
                        heatValue = applyDealHeat(heatValue, game);
                        game.addHeat(heatValue);
                        message = message.replace('[CUSTOMER_NAME]', currentCustomer.name);
                    }
                    if (message) uiManager.displayPhoneMessage(message, "narration");
                }
                break;
            default:
                console.warn(`processPayload: Unknown effect type '${effect.type}'`);
                break;
        }
    });

    const customerForConfig = game.getCurrentCustomerInstance();
    if (customerForConfig && customerForConfig.archetypeKey) {
        const customerTemplateData = game.getCustomerTemplates()[customerForConfig.archetypeKey];
        if (customerTemplateData?.gameplayConfig?.heatImpact) {
            let heatFromConfig = customerTemplateData.gameplayConfig.heatImpact;
            if (heatFromConfig > 0) heatFromConfig = applyDealHeat(heatFromConfig, game);
            game.addHeat(heatFromConfig);
        }
    }
    uiManager.updateHUD();
}

// =================================================================================
// VI. DATA PERSISTENCE
// =================================================================================

function saveGameState() {
    if (!localStorageAvailable || (!game.isGameActive() && game.getFiendsLeft() > 0)) return;
    try {
        const stateToSave = game.toJSON();
        if (game.customerManager?.getSaveState) {
            stateToSave.customerManagerState = game.customerManager.getSaveState();
        }
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
        console.error("Error saving game state:", error);
    }
}

function loadGameState() {
    if (!localStorageAvailable) return false;
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
        try {
            const loadedState = JSON.parse(savedData);
            game.fromJSON(loadedState, gameStateConfig);
            if (game.customerManager?.loadSaveState && loadedState.customerManagerState) {
                game.customerManager.loadSaveState(loadedState.customerManagerState);
            }
            uiManager.updateEventTicker();
            uiManager.updateHUD();
            return true;
        }
        catch (e) { // Catch parsing or other loading errors
            console.error("Error loading game state:", e);
            clearSavedGameState(); // Clear corrupted save
            return false;
        }
    }
    return false;
}

function clearSavedGameState() {
    if (localStorageAvailable) localStorage.removeItem(SAVE_KEY);
}

function checkForSavedGame() {
    const hasSave = localStorageAvailable && localStorage.getItem(SAVE_KEY) !== null;
    uiManager.setContinueButtonVisibility(hasSave);
}

// =================================================================================
// VII. SCRIPT ENTRY POINT
// =================================================================================

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    if (uiManager.previewMainSettingsButton) {
        uiManager.previewMainSettingsButton.addEventListener('click', () => uiManager.togglePreview(saveStyleSettings));
    } else {
        console.warn("Preview button for main settings (preview-style-settings) not found by UIManager.");
    }
    
    if (uiManager.previewPhoneSettingsButton) {
        uiManager.previewPhoneSettingsButton.addEventListener('click', () => uiManager.togglePreview(saveStyleSettings));
    } else {
        console.warn("Preview button for phone settings (preview-phone-style-settings) not found by UIManager.");
    }
    
    if (uiManager.resetMainSettingsButton) {
        uiManager.resetMainSettingsButton.addEventListener('click', () => uiManager.resetToDefaultStyles(saveStyleSettings));
    } else {
        console.warn("Reset button for main settings (reset-style-settings) not found by UIManager.");
    }
    
    if (uiManager.resetPhoneSettingsButton) {
        uiManager.resetPhoneSettingsButton.addEventListener('click', () => uiManager.resetToDefaultStyles(saveStyleSettings));
    } else {
        console.warn("Reset button for phone settings (reset-phone-style-settings) not found by UIManager.");
    }
    
    const elSettingsLoading = document.querySelector('.settings-loading');
    const elSettingsError = document.querySelector('.settings-error');
    if (elSettingsLoading) elSettingsLoading.classList.add('hidden');
    if (elSettingsError) elSettingsError.classList.add('hidden');
});