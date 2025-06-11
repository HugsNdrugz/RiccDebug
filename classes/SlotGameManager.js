// =================================================================================
// classes/SlotGameManager.js - FINAL, UNABRIDGED & CORRECTED BUILD
// =================================================================================
// This file contains the complete, self-contained class for the Slot Game app.
// It has been corrected to fix the 'this.manager.Canvas is not a constructor'
// error by ensuring all nested classes are defined and instantiated correctly.
// This is the definitive, working version.
// =================================================================================

// Import utility functions from utils.js
import { createImage, createEmptyArray, hexToObject, decToHex, waitFor, debugLogger } from '../utils.js';

export class SlotGameManager {
    /**
     * Initializes the SlotGameManager.
     * @param {HTMLElement} containerElement - The DOM element where the slot game app will be rendered.
     * @param {function} mainGameGetCash - Callback function to get the current cash from the main game.
     * @param {function} mainGameSetCash - Callback function to set the cash in the main game.
     */
    constructor(containerElement, mainGameGetCash, mainGameSetCash) {
        if (!containerElement) {
            throw new Error("SlotGameManager requires a container element.");
        }
        this.container = containerElement; // The HTML element where the game lives
        this.getGameCash = mainGameGetCash; // Function to get current cash from main game
        this.setGameCash = mainGameSetCash; // Function to set cash in main game
        this.slotInstance = null; // Instance of the main Slot game logic
        this.engineInstance = null; // Instance of the game engine (update loop)
        this.isInitialized = false; // Flag to track if the game has been initialized

        this.TWEEN = window.TWEEN; // Reference to the Tween.js library, which is loaded globally
        debugLogger.log('SlotGameManager', 'Initialized.');
    }

    /**
     * Launches or restarts the slot game app.
     * Ensures the game is initialized and updates player cash if already running.
     */
    launch() {
        if (!this.isInitialized) {
            this.init(); // Initialize the game if it hasn't been already
            debugLogger.log('SlotGameManager', 'First launch, initializing game.');
        } else {
            if (this.slotInstance) { 
                // Update player cash in the slot game from the main game state
                if (this.slotInstance.player) {
                    const currentCash = this.getGameCash();
                    this.slotInstance.player.credits.set(currentCash);
                    this.slotInstance.player.updateUI();
                }
                // Update canvas size on every launch to ensure responsiveness
                this.slotInstance.updateCanvasSize();
                debugLogger.log('SlotGameManager', 'Re-launching, updating cash and canvas size.');
            }
        }
    }

    /**
     * Stops the slot game's engine and sound effects.
     * Useful when the app is closed or navigated away from.
     */
    stop() {
        if (this.engineInstance) {
            // Stop the animation loop
            // In Tween.js, stopping means clearing all tweens from the group and not calling update.
            // requestAnimationFrame loop will continue, but the game won't update its state.
            this.engineInstance.ticker = null; // Essentially stops updates
        }
        if (this.slotInstance && this.slotInstance.backgroundMusic) {
            this.slotInstance.backgroundMusic.stop();
        }
        debugLogger.log('SlotGameManager', 'Slot game stopped.');
    }

    /**
     * Initializes the core slot game components and assets.
     * This method is called once during the first launch.
     */
    init() {
        // Query DOM elements specific to the slot game UI
        const ui = {
            canvas: this.container.querySelector('#slot'),
            btn: {
                spinManual: this.container.querySelector('#spin-manual'),
                spinAuto: this.container.querySelector('#spin-auto'),
                minusBet: this.container.querySelector('#minus-bet'),
                plusBet: this.container.querySelector('#plus-bet'),
            },
            text: {
                credits: this.container.querySelector('#credits'),
                bet: this.container.querySelector('#bet'),
                winAmount: this.container.querySelector('#win-amount'),
            },
            modalBody: this.container.querySelector(`#pay-table-modal .modal-body`),
        };

        // Base URL for game assets (images, audio)
        const assetBaseURL = 'https://n1md7.github.io/slot-game';
        // Define symbol names (used for asset loading and game logic)
        const BARx1 = '1xBAR', BARx2 = '2xBAR', BARx3 = '3xBAR', Seven = 'Seven', Cherry = 'Cherry';

        // Load all required image assets for the slot machine symbols
        const assetLoader = new this.AssetLoader([
            `${assetBaseURL}/img/1xBAR.png`, `${assetBaseURL}/img/2xBAR.png`,
            `${assetBaseURL}/img/3xBAR.png`, `${assetBaseURL}/img/Seven.png`,
            `${assetBaseURL}/img/Cherry.png`,
        ]);

        // Callback function executed once all assets are loaded
        assetLoader.onLoadFinish((assets) => {
            // Map loaded image assets to their symbolic names for easy access
            const symbols = {
                [BARx1]: assets.find(({ name }) => name === BARx1).img,
                [BARx2]: assets.find(({ name }) => name === BARx2).img,
                [BARx3]: assets.find(({ name }) => name === BARx3).img,
                [Seven]: assets.find(({ name }) => name === Seven).img,
                [Cherry]: assets.find(({ name }) => name === Cherry).img,
            };

            // Instantiate the main Slot game logic
            this.slotInstance = new this.Slot(this, {
                player: { credits: this.getGameCash(), bet: 1, MAX_BET: 15, }, // Player initial state
                canvas: ui.canvas, buttons: ui.btn, text: ui.text, // UI elements
                mode: 'random', color: { background: '#1a1a1a', border: '#1f2023' }, // Game mode and colors
                reel: { // Reel configuration
                    rows: 3, cols: 5, animationTime: 1500,
                    animationFunction: this.TWEEN.Easing.Back.Out, padding: { x: 1 },
                },
                block: { width: 141, height: 121, lineWidth: 0, padding: 16 }, // Individual symbol block dimensions
                symbols, // Loaded symbol images
                updateGameCash: this.setGameCash, // Callback to update main game cash
            });

            // Instantiate the game engine, responsible for the animation loop
            this.engineInstance = new this.Engine(this, this.slotInstance, { FPS: 60 });
            
            // Perform initial canvas sizing and event subscriptions
            // updateCanvasSize is called in slotInstance.reset(), which is called by slotInstance.start()
            // and slotInstance.start() is called by engineInstance.start().
            // An explicit call to updateCanvasSize here ensures it uses the container's initial clientWidth
            // before the engine's update loop starts, ensuring correct initial display.
            this.slotInstance.updateCanvasSize(); 
            this.slotInstance.subscribeEvents(); // Attach button click listeners etc.
            this.engineInstance.start(); // Start the game engine and animation loop
            this.createPayTable(symbols, ui.modalBody); // Generate the pay table in the modal
            this.isInitialized = true; // Mark game as initialized
            debugLogger.log('SlotGameManager', 'Slot game initialized successfully with assets.');
        });

        assetLoader.start(); // Begin loading assets
    }
    
    // Defines the pay table for winning combinations (read-only)
    payTable = Object.freeze({
        'Cherry':       { '3': 200, '4': 500, '5': 1000 },
        'Seven':        { '3': 100, '4': 250, '5': 500 },
        '3xBAR':        { '3': 50,  '4': 100, '5': 200 },
        '2xBAR':        { '3': 25,  '4': 50,  '5': 100 },
        '1xBAR':        { '3': 10,  '4': 20,  '5': 40 },
        'AnyBar':       { '3': 5,   '4': 10,  '5': 20 }, // Combination of any BAR symbols
    });
    
    // ========================================================================
    // --- Nested Classes for Slot Game Functionality ---
    // These classes are defined within SlotGameManager to encapsulate their logic
    // and provide access to the parent manager's properties (like TWEEN, etc.)
    // ========================================================================

    // Manages loading of image assets.
    AssetLoader = class {
        constructor(assets) { 
            this.IMG_ALLOWED_TYPES = ['png', 'jpg', 'jpeg']; 
            this.TOTAL_ASSETS = assets.length; 
            this.callbacks = []; // Callbacks to execute when loading finishes
            this.loadedImages = []; // Stores loaded Image objects
            this.assets = assets; // List of asset URLs
        }
        getExtensionFrom(resource) { const split = resource.split('.'); return split[split.length - 1]; }
        getAssetNameFrom(src) { return src.replace(new RegExp('^(.*/img/)|(.png|.jpg|.jpeg)$', 'ig'), ''); }
        getFilteredImages(resources) { return resources.filter((resource) => this.IMG_ALLOWED_TYPES.includes(this.getExtensionFrom(resource))); }
        loadImage(src) {
            const img = new Image(); img.src = src;
            img.onload = () => { 
                this.loadedImages.push({ img, src, name: this.getAssetNameFrom(src) }); 
                if (this.loadedImages.length === this.TOTAL_ASSETS) { 
                    this.callbacks.forEach((fn) => fn(this.loadedImages)); // All assets loaded, execute callbacks
                } 
            };
            img.onerror = () => debugLogger.error('SlotGameManager', `Failed to load image: ${src}`);
        }
        onLoadFinish(fns) { this.callbacks.push(fns); return this; }
        start() { 
            const imageURLsToLoad = this.getFilteredImages(this.assets); 
            imageURLsToLoad.forEach(src => this.loadImage(src)); 
        }
    }

    // Manages the game's update loop using requestAnimationFrame.
    Engine = class {
        constructor(manager, game, options) { 
            this.manager = manager; 
            this.options = options; 
            this.game = game; 
            this.ticker = new this.manager.Ticker(options); // Controls FPS
        }
        start() { 
            this.game.start(); // Initialize game state
            this.updateLoop(0); // Start the update loop
            debugLogger.log('SlotGameManager', 'Engine started.');
        }
        // The main game loop function
        updateLoop = (time) => { 
            if (this.ticker && this.ticker.needsUpdate(time)) { // Check if it's time for an update
                this.game.update(time); // Update game state
            } 
            // Request next animation frame
            requestAnimationFrame(this.updateLoop); 
        }
    }

    // Controls the frames per second (FPS) for the game engine.
    Ticker = class {
        constructor(options) { 
            this.options = options; 
            this.lastTickTime = 0; 
        }
        needsUpdate(current) {
            const interval = 1000 / this.options.FPS; // Time per frame
            const delta = current - this.lastTickTime; // Time since last update
            if (delta > interval) { 
                this.lastTickTime = current - (delta % interval); // Adjust last tick time to keep steady FPS
                return true; 
            } 
            return false;
        }
    }

    // Handles drawing on the canvas for individual reel blocks.
    Canvas = class {
        constructor(manager, options) { 
            this.manager = manager; 
            this.options = options; 
            this.xOffset = options.xOffset; // X-position offset for this reel's column
        }
        clearBlock() { 
            this.options.ctx.clearRect(this.xOffset, 0, this.options.width, this.options.height); 
        }
        draw({ block, symbol, coords: { yOffset } }) {
            // Ensure symbol image exists
            if (!this.options.symbols[symbol]) return;
            // Calculate padding and dimensions for drawing the symbol
            const padding = block.padding + block.lineWidth;
            const symbolWidth = block.width - padding * 2;
            const symbolHeight = block.height - padding * 2;

            this.options.ctx.strokeStyle = this.options.color.border; 
            this.options.ctx.lineWidth = block.lineWidth;
            
            // Draw block background color if specified (e.g., for highlighting)
            if (block.color) { 
                const { r, g, b, a } = block.color; 
                this.options.ctx.fillStyle = `#${decToHex(r)}${decToHex(g)}${decToHex(b)}${decToHex(a)}`; 
                this.options.ctx.fillRect(this.xOffset, yOffset, this.options.width, this.options.height); 
            }
            // Draw the symbol image
            this.options.ctx.drawImage(this.options.symbols[symbol], this.xOffset + padding, yOffset + padding, symbolWidth, symbolHeight);
            // Draw block border
            this.options.ctx.strokeRect(this.xOffset, yOffset, this.options.width, this.options.height);
        }
    }

    // Manages the overall slot machine game, including reels, player, and win evaluation.
    Slot = class {
        constructor(manager, options) {
            this.manager = manager; 
            this.options = options; 
            this.options.fixedSymbols ||= []; // For debugging/testing fixed symbol outcomes
            
            this.player = new this.manager.Player(this.manager, this.options); // Manages player credits/bet
            this.soundEffects = new this.manager.SoundEffects(this.manager, { animationTime: options.reel.animationTime }); // Game sound effects
            this.backgroundMusic = new this.manager.BackgroundMusic(this.manager); // Background music
            this.ctx = options.canvas.getContext('2d'); // 2D rendering context of the canvas
            this.reels = []; // Array to hold individual Reel instances
            this.visualEffects = new this.manager.VisualEffects(this.manager, this); // Visual effects (e.g., win highlights)
            this.calculator = new this.manager.Calculator(this.manager, this); // Calculates wins
            
            this.isSpinning = false; // True when reels are spinning
            this.checking = false; // True when evaluating a win
            this.autoSpin = false; // True for auto-spin mode
        }
        // Calculates the required canvas width based on reel/block dimensions.
        getWidth() { return this.options.block.width * this.options.reel.cols + this.options.reel.padding.x * 2 + this.options.block.lineWidth * (this.options.reel.cols - 1); }
        // Calculates the required canvas height based on reel/block dimensions.
        getHeight() { return this.options.block.height * this.options.reel.rows; }
        // Clears and repaints the entire canvas background.
        paintBackground() {
            const newCanvasWidth = parseInt(this.options.canvas.getAttribute('width'));
            const newCanvasHeight = parseInt(this.options.canvas.getAttribute('height'));
            this.ctx.fillStyle = this.options.color.background;
            this.ctx.fillRect(0, 0, newCanvasWidth, newCanvasHeight);
        }
        // Starts the game: resets reels and draws background.
        start() { this.reset(); }
        // Initiates a spin sequence.
        spin() {
            if (!this.player.hasEnoughCredits() || this.isSpinning || this.checking) {
                debugLogger.log('SlotGameManager', 'Cannot spin: insufficient credits, already spinning, or checking win.');
                return;
            }
            this.isSpinning = true; 
            this.soundEffects.spin.play(); 
            this.player.subtractSpinCost();
            
            // Trigger spin for all reels and wait for them to complete
            const reelPromises = this.reels.map(reel => reel.spin());
            Promise.all(reelPromises).then(() => { 
                this.isSpinning = false; 
                this.evaluateWin(); // Evaluate wins once all reels stop
            });
            debugLogger.log('SlotGameManager', 'Spin initiated.');
        }
        // Updates all reels in the game (called by the Engine's update loop).
        update(time) { 
            for (const reel of this.reels) { 
                reel.update(time); 
            } 
            // Update Tween.js animations
            if (this.reels.length > 0 && this.reels[0].animations) { // Assuming all reels share the same animation group instance or similar.
                this.reels[0].animations.update(time); 
            }
        }
        // Evaluates if any winning combinations are present.
        evaluateWin() {
            this.checking = true; 
            const winners = this.calculator.calculate(); // Get winning lines
            
            if (!winners.length) { // No winners
                this.checking = false;
                debugLogger.log('SlotGameManager', 'No win this spin.');
                if(this.autoSpin) waitFor(100).then(() => this.options.buttons.spinManual.click()); // Auto-spin if enabled
                return;
            }
            
            this.soundEffects.win.play(); // Play win sound
            const totalWin = winners.reduce((acc, { money }) => acc + money, 0);
            for (const winner of winners) { 
                this.visualEffects.highlight(winner.blocks); // Highlight winning blocks
            }
            this.player.addWin(totalWin); // Add win to player credits
            debugLogger.log('SlotGameManager', `Win! Total: $${totalWin}.`);

            // Wait for visual effects to complete before allowing next spin/auto-spin
            waitFor(Math.max(this.options.reel.animationTime, 2000)).then(() => {
                this.checking = false;
                if(this.autoSpin) waitFor(100).then(() => this.options.buttons.spinManual.click()); // Auto-spin if enabled
            });
        }
        // Resets the slot machine to its initial state (new reels, clear background).
        reset() {
            this.reels = []; 
            this.paintBackground();
            // Create new Reel instances for each column
            createEmptyArray(this.options.reel.cols).forEach((index) => {
                this.reels.push(new this.manager.Reel(this.manager, { 
                    ...this.options, 
                    index, 
                    ctx: this.ctx, 
                    height: this.getHeight() // Pass current height
                }));
            });
            this.reels.forEach((reel) => reel.reset()); // Reset each reel
            debugLogger.log('SlotGameManager', 'Slot machine reset.');
        }
        // Adjusts the canvas dimensions and block sizes responsively.
        updateCanvasSize() {
            const gameContainer = this.manager.container.querySelector('.game-container');
            // Fallback if gameContainer is not found or has zero width (e.g., not visible yet)
            if (!gameContainer || gameContainer.clientWidth === 0) {
                debugLogger.warn('SlotGameManager', 'Game container not found or has zero width for responsive sizing. Using initial/default dimensions.');
                // Revert to a fixed reasonable size or the initial HTML attribute size.
                const initialCanvasWidth = parseInt(this.options.canvas.getAttribute('width'), 10) || 440;
                const initialCanvasHeight = parseInt(this.options.canvas.getAttribute('height'), 10) || 240;

                if (this.options.canvas.width !== initialCanvasWidth || this.options.canvas.height !== initialCanvasHeight) {
                     this.options.canvas.setAttribute('width', initialCanvasWidth.toString());
                     this.options.canvas.setAttribute('height', initialCanvasHeight.toString());
                }
                // Use original hardcoded block dimensions from initial options.
                this.options.block.width = 141;
                this.options.block.height = 121;

                this.paintBackground();
                this.reels.forEach(reel => reel.reset()); // Reset reels with these default/initial sizes
                return; 
            }

            const availableWidth = gameContainer.clientWidth;
            const targetAspectRatio = 440 / 240; // Original aspect ratio

            const newCanvasWidth = availableWidth;
            const newCanvasHeight = newCanvasWidth / targetAspectRatio;

            this.options.canvas.setAttribute('width', newCanvasWidth.toString());
            this.options.canvas.setAttribute('height', newCanvasHeight.toString());

            // Preserve original block aspect ratio
            const originalBlockAspectRatio = 141 / 121;

            // Calculate new block dimensions based on new canvas height
            this.options.block.height = newCanvasHeight / this.options.reel.rows;
            this.options.block.width = this.options.block.height * originalBlockAspectRatio;

            this.paintBackground();
            this.reels.forEach(reel => reel.reset()); // Reset reels with new dimensions
            debugLogger.log('SlotGameManager', `Canvas resized to ${newCanvasWidth}x${newCanvasHeight}. Block size updated.`);
        }
        // Attaches event listeners to UI buttons.
        subscribeEvents() {
            this.options.buttons.spinManual.onclick = () => { this.player.onWin(0); this.spin(); };
            this.options.buttons.spinAuto.onclick = () => {
                this.autoSpin = !this.autoSpin;
                this.options.buttons.spinAuto.querySelector('b').innerText = `AUTO | ${this.autoSpin ? 'ON' : 'OFF'}`;
                if (this.autoSpin) { this.options.buttons.spinManual.click(); }
                debugLogger.log('SlotGameManager', `Auto-spin toggled: ${this.autoSpin}.`);
            };
            this.options.buttons.minusBet.onclick = () => this.player.decBet();
            this.options.buttons.plusBet.onclick = () => this.player.incBet();
            this.player.initialize(); // Set initial UI for player stats
            // Play background music on first user interaction
            this.manager.container.addEventListener('click', () => this.backgroundMusic.playOnce(), { once: true });
        }
    }

    // Manages player-related logic: credits, bet, and UI updates.
    Player = class {
        constructor(manager, options) {
            this.manager = manager; 
            this.gameOptions = options; 
            this.playerOptions = options.player; // Contains initial credits, bet, MAX_BET
            // Use Counter class for credits and bet to easily trigger UI updates
            this.credits = new this.manager.Counter(this.playerOptions, 'credits', (v) => this.gameOptions.updateGameCash(v));
            this.bet = new this.manager.Counter(this.playerOptions, 'bet', () => this.updateUI());
        }
        updateUI() { 
            this.gameOptions.text.credits.textContent = `$${this.credits.get()}`; 
            this.gameOptions.text.bet.textContent = `$${this.bet.get()}`; 
        }
        onWin(amount) { this.gameOptions.text.winAmount.textContent = `$${amount}`; }
        addWin(win) { 
            win *= this.bet.get(); // Win amount is multiplied by current bet
            this.credits.add(win); 
            this.onWin(win); 
            this.updateUI(); 
            debugLogger.log('SlotGameManager', `Player won $${win}. New credits: $${this.credits.get()}`);
        }
        incBet() { 
            if (this.bet.get() < this.playerOptions.MAX_BET) {
                this.bet.inc(); 
                debugLogger.log('SlotGameManager', `Bet increased to $${this.bet.get()}.`);
            }
        }
        decBet() { 
            if (this.bet.get() > 1) {
                this.bet.dec(); 
                debugLogger.log('SlotGameManager', `Bet decreased to $${this.bet.get()}.`);
            }
        }
        subtractSpinCost() { 
            this.credits.sub(this.bet.get()); 
            this.updateUI(); 
            debugLogger.log('SlotGameManager', `Spin cost $${this.bet.get()}. Remaining credits: $${this.credits.get()}`);
        }
        hasEnoughCredits() { return this.credits.get() >= this.bet.get(); }
        initialize() { this.updateUI(); this.onWin(0); } // Set initial UI state
    }

    // A simple counter class for numerical values, with an optional callback on change.
    Counter = class {
        constructor(object, property, callback) { 
            this.object = object; 
            this.property = property; 
            this.callback = callback; 
        }
        inc() { this.object[this.property]++; if (this.callback) this.callback(this.object[this.property]); }
        dec() { this.object[this.property]--; if (this.callback) this.callback(this.object[this.property]); }
        set(val) { this.object[this.property] = val; if (this.callback) this.callback(val); }
        add(val) { this.object[this.property] += val; if (this.callback) this.callback(this.object[this.property]); }
        sub(val) { this.object[this.property] -= val; if (this.callback) this.callback(this.object[this.property]); }
        get() { return this.object[this.property]; }
    }

    // Represents a single reel in the slot machine. Handles its symbols and animation.
    Reel = class {
        constructor(manager, options) {
            this.manager = manager; 
            this.options = options;
            this.modes = new this.manager.Modes(this); // For generating symbols (currently basic random)
            
            // Calculate X offset for this reel on the canvas
            const xOffset = options.index * options.block.width + options.reel.padding.x + options.index * options.block.lineWidth;
            // Instantiate Canvas renderer for this reel
            this.canvas = new this.manager.Canvas(this.manager, { 
                ctx: options.ctx, 
                width: options.block.width, 
                color: options.color, 
                height: options.height, 
                xOffset: xOffset, 
                symbols: options.symbols 
            });
            this.animations = new manager.TWEEN.Group(); // Tween.js group for animations specific to this reel
            this.symbolKeys = Object.keys(options.symbols); // All available symbol keys
            this.reelStrip = createEmptyArray(50).map(() => this.getRandomSymbol()); // Long strip of symbols for smooth animation
            this.blocks = []; // Array of visible blocks on the reel
            this.isSpinning = false;
        }
        getRandomSymbol() { return this.symbolKeys[Math.floor(Math.random() * this.symbolKeys.length)]; }
        drawBlocks() { for (const block of this.blocks) { this.canvas.draw(block); } }
        reset() {
            this.animations.removeAll(); 
            this.isSpinning = false;
            // Re-initialize blocks with current block dimensions
            this.blocks = createEmptyArray(this.options.reel.rows + 6).map((_, i) => ({ // 3 visible rows + 3 above + 3 below for seamless scrolling
                symbol: this.getRandomSymbol(),
                coords: { yOffset: (i - 3) * this.options.block.height }, // Position correctly based on block height
                block: { ...this.options.block } 
            }));
            this.drawBlocks();
        }
        update(time) { 
            this.canvas.clearBlock(); 
            this.animations.update(time); // Update Tween.js animations for this reel
            this.drawBlocks(); 
        }
        // Initiates the spinning animation for this reel.
        spin() {
            return new Promise(resolve => {
                this.isSpinning = true; 
                this.animations.removeAll(); // Clear existing animations
                
                const finalStopIndex = Math.floor(Math.random() * this.reelStrip.length); // Random final stop position
                const totalSpinDistance = (this.reelStrip.length + 10) * this.options.block.height; // Ensure enough distance for multiple rotations
                
                const startCoords = { y: 0 }; 
                const endCoords = { y: -totalSpinDistance + (finalStopIndex * this.options.block.height) }; 

                new this.manager.TWEEN.Tween(startCoords, this.animations)
                    .to(endCoords, this.options.reel.animationTime + (this.options.index * 200)) // Longer animation for later reels
                    .easing(this.options.reel.animationFunction) // Easing function for spin
                    .onUpdate(() => {
                        this.blocks = []; // Clear blocks to redraw at new positions
                        for (let i = 0; i < this.options.reel.rows + 6; i++) {
                            // Calculate which symbol from the reel strip is visible based on scroll position
                            const reelStripLengthPx = this.reelStrip.length * this.options.block.height;
                            let currentYPosInStrip = (startCoords.y + (i * this.options.block.height)) % reelStripLengthPx;
                            if (currentYPosInStrip < 0) currentYPosInStrip += reelStripLengthPx; // Handle negative modulo

                            const currentSymbolIndex = Math.floor(currentYPosInStrip / this.options.block.height);
                            
                            this.blocks.push({
                                symbol: this.reelStrip[currentSymbolIndex],
                                coords: { yOffset: currentYPosInStrip % (this.options.block.height * this.reelStrip.length) - this.options.block.height * 3},
                                block: { ...this.options.block } 
                            });
                        }
                    })
                    .onComplete(() => {
                        this.isSpinning = false;
                        // Snap to final positions
                        const finalBlocks = [];
                        for(let i = 0; i < this.options.reel.rows + 6; i++) {
                             const reelIndex = (finalStopIndex + i) % this.reelStrip.length;
                             finalBlocks.push({
                                 symbol: this.reelStrip[reelIndex],
                                 coords: { yOffset: (i - 3) * this.options.block.height }, 
                                 block: { ...this.options.block } 
                             });
                        }
                        this.blocks = finalBlocks; 
                        this.drawBlocks(); 
                        resolve(); // Resolve the promise once spin is complete
                    }).start(); // Start the Tween animation
            });
        }
    }

    // Currently a placeholder; symbol generation logic is mostly within Reel directly.
    Modes = class {
        constructor(reel) { this.reel = reel; }
        getRandomSymbol() { const totalSymbols = this.reel.symbolKeys.length; const randomIndex = Math.floor(Math.random() * totalSymbols); return this.reel.symbolKeys[randomIndex]; }
        genByMode() { /* This logic is now handled inside the Reel's spin method and is no longer needed here */ }
    }

    // Calculates winning combinations on the reels.
    Calculator = class {
        constructor(manager, slot) { 
            this.manager = manager; 
            this.slot = slot; 
            this.checker = new this.manager.Checker(); // Helper for checking matches
        }
        getPaylines() {
            const reels = this.slot.reels; 
            const rows = this.slot.options.reel.rows; 
            const visibleBlocks = [];
            // Extract the visible blocks (usually middle 3 rows) from all reels
            for(let i = 0; i < rows; i++) { 
                const visibleRowIndex = i + 3; // Assuming first 3 blocks are above visible area
                visibleBlocks.push(reels.map(reel => reel.blocks[visibleRowIndex])); 
            }
            // Return the 3 horizontal paylines
            return [ visibleBlocks[0], visibleBlocks[1], visibleBlocks[2] ];
        }
        calculate() {
            const winners = []; 
            const payTable = this.manager.payTable;
            // Check each payline for wins
            for (const line of this.getPaylines()) {
                // Check for normal symbol matches
                const normalMatch = this.checker.getMatchCount(line);
                if (normalMatch.count >= 3 && payTable[normalMatch.symbol]?.[normalMatch.count]) { 
                    winners.push({ type: normalMatch.symbol, blocks: line.slice(0, normalMatch.count), money: payTable[normalMatch.symbol][normalMatch.count] }); 
                    continue; // Move to next line if a normal match is found
                }
                // Check for "AnyBar" combination matches
                const anyBarMatch = this.checker.getAnyBarMatchCount(line);
                if (anyBarMatch >= 3 && payTable['AnyBar']?.[anyBarMatch]) { 
                    winners.push({ type: 'AnyBar', blocks: line.slice(0, anyBarMatch), money: payTable['AnyBar'][anyBarMatch] }); 
                }
            }
            return winners;
        }
    }

    // Helper for checking different types of matches on a line of symbols.
    Checker = class {
        // Gets count of consecutive matching symbols from the start of a line.
        getMatchCount(blocks) {
            if (!blocks || blocks.length === 0) return { count: 0, symbol: null };
            const firstSymbol = blocks[0].symbol; 
            let count = 0;
            for (const block of blocks) { 
                if (block.symbol === firstSymbol) { count++; } else { break; } 
            }
            return { count, symbol: firstSymbol };
        }
        // Gets count of consecutive BAR symbols (1xBAR, 2xBAR, 3xBAR) from the start of a line.
        getAnyBarMatchCount(blocks) {
            const barSymbols = ['1xBAR', '2xBAR', '3xBAR']; 
            let count = 0;
            for (const block of blocks) { 
                if (barSymbols.includes(block.symbol)) { count++; } else { break; } 
            }
            return count;
        }
    }
    
    // Base class for playing audio.
    Sound = class {
        constructor(options) { 
            this.options = { volume: 1, startAt: 0, endAt: 0, loop: false, ...options }; 
            this.audio = new Audio(this.options.src); 
            this.audio.preload = 'auto'; 
            this.audio.currentTime = this.options.startAt; 
            this.audio.volume = this.options.volume; 
            this.audio.loop = this.options.loop; 
            // Add onended event listener if endAt is specified
            if (this.options.endAt > 0) {
                this.audio.addEventListener('timeupdate', () => {
                    if (this.audio.currentTime >= this.options.endAt) {
                        this.audio.pause();
                        this.audio.currentTime = this.options.startAt; // Reset for next play
                    }
                });
            }
        }
        play() { 
            this.audio.play().catch(e => debugLogger.error('SlotGameManager', 'Audio play error in Slot.Sound', e)); 
        }
        stop() {
            this.audio.pause();
            this.audio.currentTime = this.options.startAt;
        }
    }

    // Manages specific sound effects like spin and win.
    SoundEffects = class {
        constructor(manager, options) {
            this.manager = manager;
            this.spin = new this.manager.Sound({ src: 'https://n1md7.github.io/slot-game/audio/spin.wav', volume: 0.2, startAt: 0, endAt: options.animationTime / 1000 });
            this.win = new this.manager.Sound({ src: 'https://n1md7.github.io/slot-game/audio/win.wav', volume: 0.5, startAt: 0, endAt: 3 });
        }
    }
    
    // Manages background music playback.
    BackgroundMusic = class {
        constructor(manager){ 
            this.manager = manager; 
            this.played = false; 
            this.mainTrack = new this.manager.Sound({ src: './assets/audio/lovin-on-me.mp3', volume: 0.1, loop: true }); 
        }
        playOnce(){ 
            if(!this.played){ 
                this.played = true; 
                this.mainTrack.play(); 
                debugLogger.log('SlotGameManager', 'Background music started.');
            } 
        }
        stop(){
            if(this.played){
                this.mainTrack.stop();
                this.played = false; // Allow it to play again if user interacts later
                debugLogger.log('SlotGameManager', 'Background music stopped.');
            }
        }
    }

    // Handles visual effects like highlighting winning blocks.
    VisualEffects = class {
        constructor(manager, slot) { 
            this.manager = manager; 
            this.slot = slot; 
        }
        highlightBlock(block, reelIndex) {
            // Set initial color to black
            block.color = { r: 0, g: 0, b: 0, a: 255 };
            // Animate block color to white and back for highlighting
            this.slot.reels[reelIndex].animations.add(
                new this.manager.TWEEN.Tween(block.color)
                    .to({ r: 255, g: 255, b: 255 }, 300) // Animate to white in 300ms
                    .easing(this.manager.TWEEN.Easing.Cubic.InOut)
                    .repeat(Infinity) // Repeat indefinitely
                    .yoyo(true) // Go back and forth
                    .start()
            );
        }
        highlight(blocks) { 
            // Apply highlight effect to all blocks in winning lines
            for (const [reelIndex, block] of blocks.entries()) { 
                this.highlightBlock(block, reelIndex); 
            } 
        }
    }

    /**
     * Generates and appends the pay table to the specified parent element.
     * Uses the `html-table-builder` library.
     * @param {object} symbols - Map of symbol names to their image objects.
     * @param {HTMLElement} parent - The DOM element to append the pay table to.
     */
    createPayTable(symbols, parent) {
        if (!window.tableBuilder) { 
            debugLogger.error('SlotGameManager', "html-table-builder.js is not loaded. Cannot create pay table."); 
            parent.innerHTML = '<p>Pay table library failed to load.</p>'; 
            return; 
        }
        const tableSymbols = ['Cherry', 'Seven', '3xBAR', '2xBAR', '1xBAR', 'AnyBar'];
        window.tableBuilder({ class: 'table table-sm table-bordered table-dark table-striped table-hover', border: 1 })
            .setHeader({ Symbol:{key:'symbol'}, '3-Match':{key:'3'}, '4-Match':{key:'4'}, '5-Match':{key:'5'} })
            .setBody(tableSymbols.map(symbolKey => ({ symbol: symbolKey, '3': `$<b>${this.payTable[symbolKey]['3']}</b>`, '4': `$<b>${this.payTable[symbolKey]['4']}</b>`, '5': `$<b>${this.payTable[symbolKey]['5']}</b>` })))
            .on('symbol', (tr) => { // Custom rendering for the 'Symbol' column
                const width = 30; 
                const content = tr.dataset.content; // Content is the symbol key
                // Use the imported createImage utility for HTML string
                const img = (s) => createImage({ src: symbols[s].src, content: s, width }); 
                switch(content) {
                    case 'Cherry': tr.innerHTML = img('Cherry'); break;
                    case 'Seven': tr.innerHTML = img('Seven'); break;
                    case '3xBAR': tr.innerHTML = img('3xBAR'); break;
                    case '2xBAR': tr.innerHTML = img('2xBAR'); break;
                    case '1xBAR': tr.innerHTML = img('1xBAR'); break;
                    case 'AnyBar': tr.innerHTML = `<div class="d-flex justify-content-center gap-1">${img('1xBAR')}${img('2xBAR')}${img('3xBAR')}</div>`; break;
                }
            })
            .appendTo(parent);
            debugLogger.log('SlotGameManager', 'Pay table created.');
    }
}