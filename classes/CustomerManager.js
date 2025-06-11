import { debugLogger } from '../utils.js'; // Import the debug logger utility

// =================================================================================
// classes/ContactsAppManager.js - FINAL BUILD (Integrated Version)
// =================================================================================
// This class manages the UI and logic for the in-game Contacts application.
// It is responsible for rendering the customer list, the editor, and handling
// all user interactions within its container element.
// =================================================================================

export class ContactsAppManager {
    /**
     * Initializes the ContactsAppManager.
     * @param {HTMLElement} containerElement - The main DOM element where the Contacts app will render its UI.
     * @param {object} initialCustomerData - The initial set of customer templates to manage.
     */
    constructor(containerElement, initialCustomerData) {
        if (!containerElement) {
            // Log a critical error if the container element is not provided.
            console.error("ContactsAppManager CRITICAL: Container element not provided during construction.");
            throw new Error("ContactsAppManager requires a container element to be initialized.");
        }
        this.container = containerElement; // The main DOM element for the app

        // --- State Management for the Contacts App ---
        this.appState = {
            // Deep copy customer data to prevent direct mutation of original templates from GameState.
            customers: JSON.parse(JSON.stringify(initialCustomerData || {})), 
            activeCustomerKey: null,      // Key of the customer currently being viewed/edited
            creatingNewCustomer: false,   // Flag for new customer creation flow
        };

        // State for the multi-step new customer creation flow.
        this.newCustomerFlowState = {
            step: 0,                         // Current step in the flow (0-indexed)
            data: this._getInitialNewCustomerData() // Data collected during the flow
        };

        // --- Configuration Constants for Contacts App ---
        this.CONFIG = {
            // Customer stat types (not all used in this app's UI, but good for reference)
            stats: ['mood', 'loyalty', 'patience', 'relationship'], 
            moods: ['desperate', 'paranoid', 'happy', 'angry', 'chill', 'arrogant', 'cautious', 'nosy', 'manic', 'dreamy'],
            operators: ['is', 'isNot', 'gt', 'gte', 'lt', 'lte'], // Operators for dialogue conditions (not used in editor UI)
            // Common dialogue contexts for new customer template initialization
            commonDialogueContexts: ['greeting', 'lowCashRikk', 'rikkDeclinesToBuy', 'rikkDeclinesToSell', 'rikkBuysSuccess', 'rikkSellsSuccess', 'itemNotGoodEnough', 'rikkPriceTooHigh', 'generalBanter', 'acknowledge_empty_stash'],
            // Colors for avatar initials based on hash of customer key
            initialColors: ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0', '#FF9800', '#00BCD4', '#8BC34A', '#F44336', '#673AB7']
        };

        // Define the steps for the new customer creation flow, including rendering and validation logic.
        this.NEW_CUSTOMER_FLOW_STEPS = [
            { title: 'Basic Info', render: this.renderNewCustomerStep1.bind(this), validate: this.validateNewCustomerStep1.bind(this) },
            { title: 'Base Stats & Dialogue', render: this.renderNewCustomerStep2.bind(this), validate: this.validateNewCustomerStep2.bind(this) },
            { title: 'Review & Create', render: this.renderNewCustomerStep3.bind(this), validate: this.validateNewCustomerStep3.bind(this) }
        ];

        this.init(); // Perform initial rendering and setup
        debugLogger.log('ContactsAppManager', 'Initialized.');
    }

    /**
     * Provides the initial data structure for a new customer being created.
     * @returns {object} An object with default values for new customer properties.
     */
    _getInitialNewCustomerData() {
        return {
            key: '', baseName: '', avatarUrl: '', initialMood: 'chill', selectedDialogueContexts: []
        };
    }

    /**
     * Performs initial setup of the Contacts app, rendering its base HTML structure
     * and querying essential DOM elements.
     */
    init() {
        // Render the base HTML structure for the Contacts app within its container.
        // This includes the app header, contact list panel, and details/editor panel.
        this.container.innerHTML = `
        <div class="one-ui-header">
            <button class="one-ui-header-back-btn" id="contacts-app-back-btn"><i class="material-icons">arrow_back_ios</i></button>
            <h2 class="one-ui-header-title" id="contacts-app-title">Contacts</h2>
            <div class="header-icons-contacts">
                <button class="icon-btn" id="add-contact-btn-contacts"><i class="material-icons">add</i></button>
                <button class="icon-btn" id="search-contact-btn-contacts"><i class="material-icons">search</i></button>
                <button class="icon-btn" id="more-contact-btn-contacts"><i class="material-icons">more_vert</i></button>
            </div>
        </div>
        <div class="scroll-content" id="contacts-scroll-content">
            <div id="contacts-panel-contacts"></div> <!-- Panel for the list of contacts -->
            <div id="details-panel-contacts"> <!-- Panel for contact details or new contact editor -->
                <!-- The content of this panel is dynamically rendered by renderCustomerEditor/renderNewCustomerFlow -->
            </div>
        </div>`;

        // Store references to key DOM elements within the app's container.
        this.dom = {
            appHeader: this.container.querySelector('.one-ui-header'),
            appTitle: this.container.querySelector('#contacts-app-title'),
            appBackButton: this.container.querySelector('#contacts-app-back-btn'),
            scrollContent: this.container.querySelector('#contacts-scroll-content'),

            addContactBtn: this.container.querySelector('#add-contact-btn-contacts'),
            contactsPanel: this.container.querySelector('#contacts-panel-contacts'),
            detailsPanel: this.container.querySelector('#details-panel-contacts'),
            // Note: detailsPanelTitle and detailsPanelContent are queried *after* the details panel
            // has been rendered by `renderCustomerEditor` or `renderNewCustomerFlow` for the first time.
            // They are not directly available here after the initial `innerHTML` set, but will be
            // on subsequent renders of the details panel.
        };
        
        this.renderAppViews(); // Perform the initial render of either list or editor view
        this.addEventListeners(); // Attach core event listeners
    }
    
    /**
     * Attaches global event listeners for the Contacts app's main UI elements.
     */
    addEventListeners() {
        // Listener for the "Add Contact" button.
        if (this.dom.addContactBtn) {
            this.dom.addContactBtn.addEventListener('click', () => this.handleCreateCustomerClick());
        }
        // Listener for the app's internal "Back" button (from details/editor to list).
        if (this.dom.appBackButton) {
            this.dom.appBackButton.addEventListener('click', () => {
                // If currently viewing a customer's details or creating a new customer,
                // revert to the contact list view.
                if (this.appState.activeCustomerKey || this.appState.creatingNewCustomer) {
                    this.appState.activeCustomerKey = null;
                    this.appState.creatingNewCustomer = false;
                    this.renderAppViews(); // Re-render to show the list
                    debugLogger.log('ContactsAppManager', 'Navigated back to contacts list.');
                } else {
                    // If already on the list view, this button could theoretically close the app.
                    // However, the main phone's nav bar handles app closure.
                    debugLogger.log("ContactsAppManager: App back button clicked on list view (no internal navigation).");
                }
            });
        }
        // Listeners for dynamically created buttons (e.g., inside editor, new customer flow)
        // are attached when those specific views are rendered.
    }
    
    /**
     * Generates a random background color for avatar initials based on the customer key.
     * @param {string} key - The unique key of the customer.
     * @returns {string} A CSS color string (e.g., '#RRGGBB').
     */
    getRandomColorForInitial(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
        return this.CONFIG.initialColors[Math.abs(hash % this.CONFIG.initialColors.length)];
    }

    // --- View Rendering ---

    /**
     * Renders the appropriate view (contact list or customer editor/new customer flow)
     * based on the current application state.
     */
    renderAppViews() {
        if (this.appState.activeCustomerKey || this.appState.creatingNewCustomer) {
            // If a customer is selected or being created, show the details panel and hide the list.
            this.dom.detailsPanel.classList.add('active'); // Shows the details panel area
            this.dom.contactsPanel.classList.add('hidden'); // Hides the contacts list

            // Update the main app title in the header
            const detailsPanelTitleEl = this.dom.detailsPanel.querySelector('#details-panel-title-details') || this.dom.detailsPanel.querySelector('#details-panel-title-newflow');
            if (this.appState.creatingNewCustomer) {
                if (this.dom.appTitle) this.dom.appTitle.textContent = `New Contact`;
                this.renderNewCustomerFlow(); // Renders new customer flow into detailsPanel
            } else {
                const customer = this.appState.customers[this.appState.activeCustomerKey];
                if (this.dom.appTitle) this.dom.appTitle.textContent = customer ? customer.baseName : 'Contact Details';
                this.renderCustomerEditor(this.appState.activeCustomerKey); // Renders editor into detailsPanel
            }
        } else {
            // If no customer is selected, show the contact list panel and hide the details.
            this.dom.detailsPanel.classList.remove('active'); // Hides the details panel area
            this.dom.contactsPanel.classList.remove('hidden'); // Shows the contacts list
            if (this.dom.appTitle) this.dom.appTitle.textContent = 'Contacts'; // Reset main app title
        }
        this.renderCustomerList(); // Always render or re-render list (it might be hidden)
    }

    /**
     * Renders the list of contacts in the `contactsPanel`.
     * Includes "My profile" and "Fiends" sections.
     */
    renderCustomerList() {
        // Clear existing content and add static sections
        this.dom.contactsPanel.innerHTML = `
            <div class="list-section-header">My profile</div>
            <div class="customer-card my-profile-card no-divider">
                <img src="https://randomuser.me/api/portraits/men/9.jpg" alt="Profile" class="customer-card-avatar">
                <div class="customer-card-info"><div class="customer-card-name">Rikk</div></div>
            </div>
            <div class="list-section-header"><i class="fas fa-star star-icon"></i> Fiends</div>
        `;

        // Sort customer templates by base name and render each as a card
        const keys = Object.keys(this.appState.customers).sort((a, b) => this.appState.customers[a].baseName.localeCompare(this.appState.customers[b].baseName));
        keys.forEach(key => {
            const customer = this.appState.customers[key];
            const card = document.createElement('div');
            card.className = `customer-card ${key === this.appState.activeCustomerKey ? 'active' : ''}`;
            card.dataset.key = key; // Store key for easy lookup

            // Determine avatar (image or initial)
            let avatarHtml;
            if (customer.avatarUrl) {
                // Use onerror to fallback to initial if image fails to load
                avatarHtml = `<img src="${customer.avatarUrl}" alt="${customer.baseName}" onerror="this.outerHTML='<div class=\\'avatar-initial\\' style=\\'background-color: ${this.getRandomColorForInitial(key)}\\'>${customer.baseName ? customer.baseName[0].toUpperCase() : '?'}</div>'">`;
            } else {
                const initial = customer.baseName ? customer.baseName[0].toUpperCase() : '?';
                avatarHtml = `<div class="avatar-initial" style="background-color: ${this.getRandomColorForInitial(key)};">${initial}</div>`;
            }

            card.innerHTML = `
                <div class="customer-card-avatar">${avatarHtml}</div>
                <div class="customer-card-info">
                    <div class="customer-card-name">${customer.baseName}</div>
                    <div class="customer-card-key">${customer.key}</div>
                </div>
            `;
            // Add click listener to select the customer and open their editor
            card.addEventListener('click', () => this.handleCustomerSelect(key));
            this.dom.contactsPanel.appendChild(card);
        });
    }

    /**
     * Renders the customer editor panel for a specific customer.
     * Allows editing of basic info and base stats.
     * @param {string} key - The unique key of the customer to edit.
     */
    renderCustomerEditor(key) {
        const customer = this.appState.customers[key];
        if (!customer) {
            debugLogger.error('ContactsAppManager', `Customer not found for editing: ${key}`);
            // This error state should ideally be handled by rendering `renderAppViews` to list view
            this.dom.detailsPanel.innerHTML = `<p>Error: Customer not found.</p>`; 
            return;
        }

        // Helper to create <option> tags for select dropdowns.
        const createSelectOptions = (options, selectedValue) => options.map(opt => `<option value="${opt}" ${opt === selectedValue ? 'selected' : ''}>${opt}</option>`).join('');

        // Ensure the details panel exists before rendering into it.
        if (!this.dom.detailsPanel) {
            debugLogger.error('ContactsAppManager', 'detailsPanel not found during renderCustomerEditor.');
            return;
        }

        // Render the editor HTML into the details panel.
        this.dom.detailsPanel.innerHTML = `
            <div class="details-panel-header">
                <button id="back-to-contacts-btn-details" class="icon-btn"><i class="material-icons">arrow_back</i></button>
                <h2 id="details-panel-title-details">${customer.baseName}</h2>
            </div>
            <div id="details-panel-content-editor" class="editor-pane">
                <div class="editor-section">
                    <h3>Basic Info</h3>
                    <div class="form-group"><label>Key (ID)</label><input type="text" value="${customer.key}" readonly></div>
                    <div class="form-group"><label>Base Name</label><input type="text" value="${customer.baseName}" name="baseName"></div>
                    <div class="form-group"><label>Avatar URL</label><input type="text" value="${customer.avatarUrl || ''}" name="avatarUrl" placeholder="https://..."></div>
                </div>
                <div class="editor-section">
                    <h3>Base Stats</h3>
                    <div class="form-group"><label>Initial Mood</label><select name="baseStats.mood">${createSelectOptions(this.CONFIG.moods, customer.baseStats.mood)}</select></div>
                    <div class="form-group"><label>Loyalty</label><input type="number" value="${customer.baseStats.loyalty}" name="baseStats.loyalty"></div>
                    <div class="form-group"><label>Patience</label><input type="number" value="${customer.baseStats.patience}" name="baseStats.patience"></div>
                    <div class="form-group"><label>Relationship</label><input type="number" value="${customer.baseStats.relationship}" name="baseStats.relationship"></div>
                </div>
                <div class="editor-section">
                    <h3>Dialogue Nodes</h3>
                    <p>Editing of dialogue lines and payloads is restricted in this view.</p>
                </div>
                <div class="editor-section">
                    <h3><i class="fas fa-code"></i> Full Template JSON</h3>
                    <pre>${JSON.stringify(customer, null, 2)}</pre>
                </div>
            </div>`;
        
        // Query the specific content area *within* the newly rendered detailsPanel for event listeners.
        const editorContentArea = this.dom.detailsPanel.querySelector('#details-panel-content-editor');
        if (editorContentArea) {
            editorContentArea.querySelectorAll('input, select').forEach(el => el.addEventListener('change', e => this.handleInputChange(e)));
        }

        // Add event listener for the details panel's specific back button.
        const detailsBackBtn = this.dom.detailsPanel.querySelector('#back-to-contacts-btn-details');
        if (detailsBackBtn) {
            detailsBackBtn.addEventListener('click', () => {
                this.appState.activeCustomerKey = null;
                this.appState.creatingNewCustomer = false;
                this.renderAppViews(); // Re-render to show the contacts list
            });
        }
    }
    
    // --- New Customer Flow Rendering & Validation ---

    /**
     * Renders the current step of the new customer creation flow into the details panel.
     */
    renderNewCustomerFlow() {
        if (!this.dom.detailsPanel) {
            debugLogger.error('ContactsAppManager', 'detailsPanel not found during renderNewCustomerFlow.');
            return;
        }

        const currentStep = this.NEW_CUSTOMER_FLOW_STEPS[this.newCustomerFlowState.step];

        // Render the new customer flow HTML into the details panel.
        this.dom.detailsPanel.innerHTML = `
            <div class="details-panel-header">
                 <button id="back-to-contacts-btn-newflow" class="icon-btn"><i class="material-icons">arrow_back</i></button>
                 <h2 id="details-panel-title-newflow">New: Step ${this.newCustomerFlowState.step + 1}</h2>
            </div>
            <div id="new-customer-flow-content" class="editor-pane">
                <div class="new-customer-step-content">${currentStep.render(this.newCustomerFlowState.data)}</div>
                <div class="modal-actions" style="display: flex; justify-content: space-between; margin-top: 20px;">
                    ${this.newCustomerFlowState.step > 0 ? `<button id="new-customer-back-btn" class="btn btn-neutral">Back</button>` : '<div></div>'}
                    <button id="new-customer-next-btn" class="btn btn-primary">${this.newCustomerFlowState.step === this.NEW_CUSTOMER_FLOW_STEPS.length - 1 ? 'Create' : 'Next'}</button>
                </div>
            </div>`;
            
        // Add event listeners for navigation buttons within the flow.
        if (this.newCustomerFlowState.step > 0) {
            this.dom.detailsPanel.querySelector('#new-customer-back-btn').addEventListener('click', () => this.handleNewCustomerFlowBack());
        }
        this.dom.detailsPanel.querySelector('#new-customer-next-btn').addEventListener('click', () => this.handleNewCustomerFlowNext());
        
        // Add event listeners for input fields within the current step.
        // Query the specific content area *within* the newly rendered detailsPanel.
        const flowContentArea = this.dom.detailsPanel.querySelector('#new-customer-flow-content');
        if (flowContentArea) {
            flowContentArea.querySelectorAll('input, select').forEach(el => {
                const prop = el.dataset.prop;
                if (!prop) return; // Skip elements without a data-prop attribute
                const eventType = el.tagName === 'SELECT' ? 'change' : 'input';
                el.addEventListener(eventType, e => {
                    if(el.type === 'checkbox') {
                        const value = e.target.value;
                        if (e.target.checked) {
                            if (!this.newCustomerFlowState.data[prop].includes(value)) this.newCustomerFlowState.data[prop].push(value);
                        } else {
                            this.newCustomerFlowState.data[prop] = this.newCustomerFlowState.data[prop].filter(c => c !== value);
                        }
                    } else {
                         this.newCustomerFlowState.data[prop] = e.target.value;
                    }
                });
            });
        }

        // Add event listener for the new customer flow's internal back button.
        const newFlowBackBtn = this.dom.detailsPanel.querySelector('#back-to-contacts-btn-newflow');
        if (newFlowBackBtn) {
            newFlowBackBtn.addEventListener('click', () => {
                // If on step 0, go back to contacts list. Otherwise, go to previous step.
                if (this.newCustomerFlowState.step === 0) {
                    this.appState.activeCustomerKey = null;
                    this.appState.creatingNewCustomer = false;
                    this.renderAppViews();
                } else {
                    this.handleNewCustomerFlowBack();
                }
            });
        }
    }

    /**
     * Renders the HTML for the first step of the new customer creation flow (Basic Info).
     * @param {object} data - The current data for the new customer.
     * @returns {string} HTML string for the step.
     */
    renderNewCustomerStep1(data) {
        return `
            <div id="new-customer-step1-validation-msg" class="validation-message" style="color: var(--color-error, #cf6679); margin-bottom: 10px;"></div>
            <h4>Basic Info</h4>
            <div class="form-group">
                <label for="new-customer-name">Customer's Base Name</label>
                <input type="text" id="new-customer-name" data-prop="baseName" value="${data.baseName}" placeholder="e.g., Quiet Quentin" required>
            </div>
            <div class="form-group">
                <label for="new-customer-key">Unique Key (UPPERCASE_SNAKE_CASE)</label>
                <input type="text" id="new-customer-key" data-prop="key" value="${data.key}" placeholder="e.g., NEW_ARCHETYPE" required>
            </div>
            <div class="form-group">
                <label for="new-customer-avatar">Avatar Image URL (Optional)</label>
                <input type="text" id="new-customer-avatar" data-prop="avatarUrl" value="${data.avatarUrl}" placeholder="https://randomuser.me/api/portraits/men/99.jpg">
            </div>`;
    }

    /**
     * Displays a validation message within the new customer flow.
     * @param {string} messageContainerId - The ID of the div to display the message in.
     * @param {string} message - The message content.
     */
    _displayValidationMessage(messageContainerId, message) {
        // Find the container within the detailsPanel for the message.
        const flowContentContainer = this.dom.detailsPanel.querySelector('#new-customer-flow-content');
        if (!flowContentContainer) return; // Should not happen if rendered correctly
        const container = flowContentContainer.querySelector(`#${messageContainerId}`);
        if (container) {
            container.innerHTML = message ? `<p style="margin:0;">${message}</p>` : ''; 
        }
    }

    /**
     * Validates the data entered in the first step of the new customer creation flow.
     * @param {object} data - The data collected for the new customer.
     * @returns {boolean} True if validation passes, false otherwise.
     */
    validateNewCustomerStep1(data) {
        this._displayValidationMessage('new-customer-step1-validation-msg', ''); // Clear previous messages

        if (!data.baseName.trim()) {
            this._displayValidationMessage('new-customer-step1-validation-msg', 'Base Name is required.');
            return false;
        }
        if (!data.key.trim()) {
            this._displayValidationMessage('new-customer-step1-validation-msg', 'Customer Key is required.');
            return false;
        }
        const originalKey = data.key.trim();
        const formattedKey = originalKey.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');

        if (this.appState.customers[formattedKey]) {
            this._displayValidationMessage('new-customer-step1-validation-msg', `Customer with key "${formattedKey}" already exists. Please choose a different key.`);
            return false;
        }
        
        // If the key was reformatted, update the data and re-render to show the corrected key.
        // This makes the user aware of the format correction before proceeding.
        if (formattedKey !== originalKey) {
             this.newCustomerFlowState.data.key = formattedKey; 
             this.renderNewCustomerFlow(); // Re-render to show corrected key in input
             this._displayValidationMessage('new-customer-step1-validation-msg', `Key format corrected to: <strong>${formattedKey}</strong>. Please review and click Next.`);
             return false; // Return false to prevent advancing, user must click next again.
        }
        return true;
    }

    /**
     * Renders the HTML for the second step of the new customer creation flow (Base Stats & Dialogue).
     * @param {object} data - The current data for the new customer.
     * @returns {string} HTML string for the step.
     */
    renderNewCustomerStep2(data) {
        const createSelectOptions = (options, selectedValue) => options.map(opt => `<option value="${opt}" ${opt === selectedValue ? 'selected' : ''}>${opt}</option>`).join('');
        return `
            <h4>Stats & Dialogue</h4>
            <div class="form-group">
                <label for="new-customer-mood">Initial Mood</label>
                <select id="new-customer-mood" data-prop="initialMood">${createSelectOptions(this.CONFIG.moods, data.initialMood)}</select>
            </div>
            <div class="form-group">
                <label>Select Initial Dialogue Contexts</label>
                <div class="checkbox-group">${this.CONFIG.commonDialogueContexts.map(context => `
                    <label>
                        <input type="checkbox" data-prop="selectedDialogueContexts" value="${context}" ${data.selectedDialogueContexts.includes(context) ? 'checked' : ''}>
                        ${context.replace(/([A-Z])/g, ' $1').trim()}
                    </label>`).join('')}
                </div>
            </div>`;
    }
    /**
     * Validates the data entered in the second step of the new customer creation flow.
     * Currently, this step has no specific validation rules other than basic input handling.
     * @param {object} data - The data collected for the new customer.
     * @returns {boolean} Always true.
     */
    validateNewCustomerStep2(data) { 
        debugLogger.log('ContactsAppManager', 'New customer step 2 validated.');
        return true; 
    }

    /**
     * Renders the HTML for the third step of the new customer creation flow (Review & Create).
     * @param {object} data - The final data collected for the new customer.
     * @returns {string} HTML string for the step.
     */
    renderNewCustomerStep3(data) {
        return `
            <h4>Review & Create</h4>
            <div class="review-summary">
                <p><strong>Key:</strong> <code>${data.key}</code></p>
                <p><strong>Name:</strong> ${data.baseName}</p>
                <p><strong>Avatar:</strong> <img src="${data.avatarUrl || `https://via.placeholder.com/50/555555/FFFFFF?text=${data.baseName ? data.baseName[0] : '?'}`}" alt="Avatar" style="width:50px; height:50px; border-radius:50%; vertical-align:middle;"></p>
                <p><strong>Initial Mood:</strong> ${data.initialMood}</p>
                <p><strong>Dialogue Contexts:</strong> ${data.selectedDialogueContexts.length > 0 ? data.selectedDialogueContexts.join(', ') : 'None'}</p>
            </div>`;
    }
    /**
     * Validates the data in the third step of the new customer creation flow.
     * Currently, this step has no specific validation rules.
     * @param {object} data - The data collected for the new customer.
     * @returns {boolean} Always true.
     */
    validateNewCustomerStep3(data) { 
        debugLogger.log('ContactsAppManager', 'New customer step 3 validated.');
        return true; 
    }
    
    // --- Event Handlers ---

    /**
     * Handles the selection of a customer from the list, opening their editor view.
     * @param {string} key - The unique key of the selected customer.
     */
    handleCustomerSelect(key) {
        this.appState.activeCustomerKey = key;
        this.appState.creatingNewCustomer = false; // Ensure not in creation flow
        this.renderAppViews(); // Re-render to show the editor
        debugLogger.log('ContactsAppManager', `Selected customer for viewing: ${key}`);
    }
    
    /**
     * Initiates the new customer creation flow, resetting its state and rendering the first step.
     */
    handleCreateCustomerClick() {
        this.appState.activeCustomerKey = null; // Ensure no existing customer is active
        this.appState.creatingNewCustomer = true;
        this.newCustomerFlowState.step = 0; // Start from step 0
        this.newCustomerFlowState.data = this._getInitialNewCustomerData(); // Reset data
        this.renderAppViews(); // Re-render to show the new customer flow
        debugLogger.log('ContactsAppManager', 'Started new customer creation flow.');
    }

    /**
     * Handles navigation to the next step in the new customer creation flow.
     * Validates the current step's data before advancing.
     */
    handleNewCustomerFlowNext() {
        const currentStep = this.NEW_CUSTOMER_FLOW_STEPS[this.newCustomerFlowState.step];
        // Validate current step before proceeding
        if (!currentStep.validate(this.newCustomerFlowState.data)) {
            debugLogger.warn('ContactsAppManager', `Validation failed for new customer step ${this.newCustomerFlowState.step}.`);
            return;
        }

        // If not the last step, advance to the next step.
        if (this.newCustomerFlowState.step < this.NEW_CUSTOMER_FLOW_STEPS.length - 1) {
            this.newCustomerFlowState.step++;
            this.renderAppViews(); // Re-render to show the next step's UI
            debugLogger.log('ContactsAppManager', `Advanced to new customer step ${this.newCustomerFlowState.step}.`);
        } else {
            // If it's the last step, finalize creation and add the new customer.
            const { key, baseName, avatarUrl, initialMood, selectedDialogueContexts } = this.newCustomerFlowState.data;
            const newCustomer = {
                key, baseName, avatarUrl,
                baseStats: { mood: initialMood, loyalty: 0, patience: 3, relationship: 0 },
                dialogue: {} // Initialize empty dialogue object
            };
            // Add default dialogue blocks for selected contexts
            selectedDialogueContexts.forEach(context => {
                newCustomer.dialogue[context] = [{ conditions: [], lines: [`Default line for ${context}.`], payload: { type: "EFFECT", effects: [] } }];
            });

            this.appState.customers[key] = newCustomer; // Add new customer to local state
            this.appState.activeCustomerKey = key; // Set newly created customer as active for immediate viewing
            this.appState.creatingNewCustomer = false; // Exit creation flow
            
            // Dispatch a custom event to notify the main game script of updated templates.
            // This allows the main script to save and update its CustomerManager.
            const event = new CustomEvent('customerTemplatesUpdated', { 
                detail: { updatedTemplates: this.appState.customers },
                bubbles: true, 
                composed: true 
            });
            this.container.dispatchEvent(event);

            this.renderAppViews(); // Re-render to show the newly created customer's editor view
            debugLogger.log('ContactsAppManager', `New customer "${key}" created and dispatched event.`);
        }
    }
    
    /**
     * Handles navigation to the previous step in the new customer creation flow.
     */
    handleNewCustomerFlowBack() {
        if (this.newCustomerFlowState.step > 0) {
            this.newCustomerFlowState.step--;
            this.renderAppViews(); // Re-render to show the previous step's UI
            debugLogger.log('ContactsAppManager', `Navigated back to new customer step ${this.newCustomerFlowState.step}.`);
        }
    }

    /**
     * Handles changes to input fields in the customer editor, updating the customer's data.
     * Dispatches an event to notify the main script of changes.
     * @param {Event} event - The DOM change event.
     */
    handleInputChange(event) {
        const target = event.target;
        const name = target.name; // This contains the property path, e.g., "baseStats.mood"
        if (!name || !this.appState.activeCustomerKey) return;

        const customer = this.appState.customers[this.appState.activeCustomerKey];
        let value = target.type === 'number' ? parseFloat(target.value) || 0 : target.value;

        // Traverse the object path to update the correct property
        const keys = name.split('.');
        let current = customer;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
            if (!current) { // Create nested object if it doesn't exist
                current[keys[i]] = {};
                current = current[keys[i]];
            }
        }
        current[keys[keys.length - 1]] = value; // Set the final property value

        debugLogger.log('ContactsAppManager', `Customer ${customer.key} data updated: ${name} = ${value}.`);

        // Dispatch a custom event to notify the main game script of updated templates.
        // This allows the main script to save and update its CustomerManager.
        const customChangeEvent = new CustomEvent('customerTemplatesUpdated', {
            detail: { updatedTemplates: this.appState.customers },
            bubbles: true, 
            composed: true 
        });
        this.container.dispatchEvent(customChangeEvent);
    }
}