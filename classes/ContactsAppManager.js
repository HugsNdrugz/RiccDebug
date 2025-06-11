import { debugLogger } from './utils.js';
// =================================================================================
// classes/ContactsAppManager.js - FINAL BUILD
// =================================================================================
// This class manages the UI and logic for the in-game Contacts application.
// It is responsible for rendering the customer list, the editor, and handling
// all user interactions within its container element. This is the complete,
// unabridged file, compiled by AI Studio Operations Core.
// =================================================================================

export class ContactsAppManager {
    /**
     * @param {HTMLElement} containerElement - The main DOM element to render the app into.
     * @param {object} initialCustomerData - The initial set of customer templates.
     */
    constructor(containerElement, initialCustomerData) {
        if (!containerElement) {
            // Using console.error directly here because debugLogger might not be available if this constructor fails.
            // Or, ensure this class is only instantiated after utils.js and its logger are confirmed loaded.
            // For this refactor, we'll assume it's okay for init errors to be raw console.error.
            console.error("ContactsAppManager CRITICAL: Container element not provided during construction.");
            throw new Error("ContactsAppManager requires a container element to be initialized.");
        }
        this.container = containerElement;

        // --- State Management ---
        this.appState = {
            customers: JSON.parse(JSON.stringify(initialCustomerData || {})), // Deep copy to prevent mutation of original templates
            activeCustomerKey: null,
            creatingNewCustomer: false,
        };

        this.newCustomerFlowState = {
            step: 0,
            data: this._getInitialNewCustomerData()
        };

        // --- Configuration ---
        this.CONFIG = {
            stats: ['mood', 'loyalty', 'patience', 'relationship'],
            moods: ['desperate', 'paranoid', 'happy', 'angry', 'chill', 'arrogant', 'cautious', 'nosy', 'manic', 'dreamy'],
            operators: ['is', 'isNot', 'gt', 'gte', 'lt', 'lte'],
            commonDialogueContexts: ['greeting', 'lowCashRikk', 'rikkDeclinesToBuy', 'rikkDeclinesToSell', 'rikkBuysSuccess', 'rikkSellsSuccess', 'itemNotGoodEnough', 'rikkPriceTooHigh', 'generalBanter', 'acknowledge_empty_stash'],
            initialColors: ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0', '#FF9800', '#00BCD4', '#8BC34A', '#F44336', '#673AB7']
        };

        this.NEW_CUSTOMER_FLOW_STEPS = [
            { title: 'Basic Info', render: this.renderNewCustomerStep1.bind(this), validate: this.validateNewCustomerStep1.bind(this) },
            { title: 'Base Stats & Dialogue', render: this.renderNewCustomerStep2.bind(this), validate: this.validateNewCustomerStep2.bind(this) },
            { title: 'Review & Create', render: this.renderNewCustomerStep3.bind(this), validate: this.validateNewCustomerStep3.bind(this) }
        ];

        this.init();
    }

    _getInitialNewCustomerData() {
        return {
            key: '', baseName: '', avatarUrl: '', initialMood: 'chill', selectedDialogueContexts: []
        };
    }

    init() {
        this.container.innerHTML = `
            <div id="app-header-contacts" class="app-header-contacts">
                <h1 id="app-title-contacts">Contacts</h1>
                <div class="header-icons-contacts">
                    <button class="icon-btn" id="add-contact-btn-contacts"><i class="fas fa-plus"></i></button>
                    <button class="icon-btn"><i class="fas fa-search"></i></button>
                    <button class="icon-btn"><i class="fas fa-ellipsis-v"></i></button>
                </div>
            </div>
            <div id="main-app-content-contacts" class="main-app-content-contacts">
                <div id="contacts-panel-contacts"></div>
                <div id="details-panel-contacts">
                    <div class="details-panel-header">
                        <button id="back-to-contacts-btn" class="icon-btn"><i class="fas fa-arrow-left"></i></button>
                        <h2 id="details-panel-title"></h2>
                    </div>
                    <div id="details-panel-content"></div>
                </div>
            </div>`;

        this.dom = {
            addContactBtn: this.container.querySelector('#add-contact-btn-contacts'),
            contactsPanel: this.container.querySelector('#contacts-panel-contacts'),
            detailsPanel: this.container.querySelector('#details-panel-contacts'),
            backToContactsBtn: this.container.querySelector('#back-to-contacts-btn'),
            detailsPanelTitle: this.container.querySelector('#details-panel-title'),
            detailsPanelContent: this.container.querySelector('#details-panel-content')
        };
        
        this.renderAppViews();
        this.addEventListeners();
    }
    
    addEventListeners() {
        this.dom.addContactBtn.addEventListener('click', () => this.handleCreateCustomerClick());
        this.dom.backToContactsBtn.addEventListener('click', () => {
            this.appState.activeCustomerKey = null;
            this.appState.creatingNewCustomer = false;
            this.renderAppViews();
        });
    }
    
    getRandomColorForInitial(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
        return this.CONFIG.initialColors[Math.abs(hash % this.CONFIG.initialColors.length)];
    }

    // --- View Rendering ---
    renderAppViews() {
        if (this.appState.activeCustomerKey || this.appState.creatingNewCustomer) {
            this.dom.detailsPanel.classList.add('active');
            if (this.appState.creatingNewCustomer) {
                this.dom.detailsPanelTitle.textContent = `New: Step ${this.newCustomerFlowState.step + 1}`;
                this.renderNewCustomerFlow();
            } else {
                const customer = this.appState.customers[this.appState.activeCustomerKey];
                this.dom.detailsPanelTitle.textContent = customer.baseName;
                this.renderCustomerEditor(this.appState.activeCustomerKey);
            }
        } else {
            this.dom.detailsPanel.classList.remove('active');
        }
        this.renderCustomerList();
    }

    renderCustomerList() {
        this.dom.contactsPanel.innerHTML = `
            <div class="list-section-header">My profile</div>
            <div class="customer-card my-profile-card no-divider">
                <img src="https://randomuser.me/api/portraits/men/9.jpg" alt="Profile" class="customer-card-avatar">
                <div class="customer-card-info"><div class="customer-card-name">Rikk</div></div>
            </div>
            <div class="list-section-header"><i class="fas fa-star star-icon"></i> Fiends</div>
        `;

        const keys = Object.keys(this.appState.customers).sort((a, b) => this.appState.customers[a].baseName.localeCompare(this.appState.customers[b].baseName));
        keys.forEach(key => {
            const customer = this.appState.customers[key];
            const card = document.createElement('div');
            card.className = `customer-card ${key === this.appState.activeCustomerKey ? 'active' : ''}`;
            card.dataset.key = key;

            let avatarHtml;
            if (customer.avatarUrl) {
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
            card.addEventListener('click', () => this.handleCustomerSelect(key));
            this.dom.contactsPanel.appendChild(card);
        });
    }

    renderCustomerEditor(key) {
        const customer = this.appState.customers[key];
        if (!customer) {
            this.dom.detailsPanelContent.innerHTML = `<p>Error: Customer not found.</p>`;
            return;
        }

        const createSelectOptions = (options, selectedValue) => options.map(opt => `<option value="${opt}" ${opt === selectedValue ? 'selected' : ''}>${opt}</option>`).join('');

        this.dom.detailsPanelContent.innerHTML = `
            <div class="editor-pane">
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
        this.dom.detailsPanelContent.querySelectorAll('input, select').forEach(el => el.addEventListener('change', e => this.handleInputChange(e)));
    }
    
    // --- New Customer Flow ---
    renderNewCustomerFlow() {
        const currentStep = this.NEW_CUSTOMER_FLOW_STEPS[this.newCustomerFlowState.step];
        this.dom.detailsPanelContent.innerHTML = `
            <div id="new-customer-flow-content" class="editor-pane">
                <div class="new-customer-step-content">${currentStep.render(this.newCustomerFlowState.data)}</div>
                <div class="modal-actions" style="display: flex; justify-content: space-between; margin-top: 20px;">
                    ${this.newCustomerFlowState.step > 0 ? `<button id="new-customer-back-btn" class="btn btn-neutral">Back</button>` : '<div></div>'}
                    <button id="new-customer-next-btn" class="btn btn-primary">${this.newCustomerFlowState.step === this.NEW_CUSTOMER_FLOW_STEPS.length - 1 ? 'Create' : 'Next'}</button>
                </div>
            </div>`;
            
        if (this.newCustomerFlowState.step > 0) document.getElementById('new-customer-back-btn').addEventListener('click', () => this.handleNewCustomerFlowBack());
        document.getElementById('new-customer-next-btn').addEventListener('click', () => this.handleNewCustomerFlowNext());
        
        this.dom.detailsPanelContent.querySelectorAll('input, select').forEach(el => {
            const prop = el.dataset.prop;
            if (!prop) return;
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

    _displayValidationMessage(messageContainerId, message) {
        // Ensure this runs in the context where 'this.dom.detailsPanelContent' is available,
        // or query document if the ID is globally unique and rendered.
        const container = this.dom.detailsPanelContent.querySelector(`#${messageContainerId}`);
        if (container) {
            container.innerHTML = message ? `<p style="margin:0;">${message}</p>` : ''; // Clear if message is empty, added p style
        }
    }

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
        /* REMOVED COMMENTED BLOCK
        if (formattedKey !== originalKey) {
            this._displayValidationMessage('new-customer-step1-validation-msg', `Key format was invalid. It has been corrected to: <strong>${formattedKey}</strong>. Please review and continue.`);
            this.newCustomerFlowState.data.key = formattedKey;
            // Re-rendering the flow will show the corrected key in the input.
            // The original code called this.renderNewCustomerFlow() which might be too broad.
            // For now, the message informs the user, and the data is updated.
            // If immediate input update is needed without full re-render, that's a separate step.
            // The current flow implies that if validation returns false, the step is re-rendered by the calling function (handleNewCustomerFlowNext)
            // if it checks the return value. Let's assume the main flow doesn't auto-re-render on false, so we might need it here.
            // However, the original code only re-rendered on key correction.
            // Let's stick to the plan: if validation fails (including for key correction), it returns false.
            // The calling function `handleNewCustomerFlowNext` does *not* re-render if validation fails.
            // So, if we want the input to update with the corrected key, we must re-render here.
            this.renderNewCustomerFlow(); // Re-render to show corrected key
            return false;
        }
        */
        // If the key was reformatted and different, the user is informed by the message,
        // and the corrected key is stored. They need to click "Next" again to proceed
        // if the formatted key is acceptable and not a duplicate.
        if (formattedKey !== originalKey) {
             this.newCustomerFlowState.data.key = formattedKey; // Update the data with the corrected key
             // It's important to re-render here so the user sees the corrected key in the input field.
             this.renderNewCustomerFlow();
             return false; // Return false to prevent advancing, user must click next again.
        }
        return true;
    }

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
    validateNewCustomerStep2(data) { return true; }

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
    validateNewCustomerStep3(data) { return true; }
    
    // --- Event Handlers ---
    handleCustomerSelect(key) {
        this.appState.activeCustomerKey = key;
        this.appState.creatingNewCustomer = false;
        this.renderAppViews();
    }
    
    handleCreateCustomerClick() {
        this.appState.activeCustomerKey = null;
        this.appState.creatingNewCustomer = true;
        this.newCustomerFlowState.step = 0;
        this.newCustomerFlowState.data = this._getInitialNewCustomerData();
        this.renderAppViews();
    }

    handleNewCustomerFlowNext() {
        const currentStep = this.NEW_CUSTOMER_FLOW_STEPS[this.newCustomerFlowState.step];
        if (!currentStep.validate(this.newCustomerFlowState.data)) return;

        if (this.newCustomerFlowState.step < this.NEW_CUSTOMER_FLOW_STEPS.length - 1) {
            this.newCustomerFlowState.step++;
            this.renderAppViews();
        } else {
            const { key, baseName, avatarUrl, initialMood, selectedDialogueContexts } = this.newCustomerFlowState.data;
            const newCustomer = {
                key, baseName, avatarUrl,
                baseStats: { mood: initialMood, loyalty: 0, patience: 3, relationship: 0 },
                dialogue: {}
            };
            selectedDialogueContexts.forEach(context => {
                newCustomer.dialogue[context] = [{ conditions: [], lines: [`Default line for ${context}.`], payload: { type: "EFFECT", effects: [] } }];
            });

            this.appState.customers[key] = newCustomer;
            this.appState.activeCustomerKey = key;
            this.appState.creatingNewCustomer = false;
            
            // This event can be listened to by the main game to save the updated customer templates
            const event = new CustomEvent('customerTemplatesUpdated', { detail: { updatedTemplates: this.appState.customers } });
            this.container.dispatchEvent(event);

            this.renderAppViews();
        }
    }
    
    handleNewCustomerFlowBack() {
        if (this.newCustomerFlowState.step > 0) {
            this.newCustomerFlowState.step--;
            this.renderAppViews();
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        if (!name || !this.appState.activeCustomerKey) return;

        const customer = this.appState.customers[this.appState.activeCustomerKey];
        let value = target.type === 'number' ? parseFloat(target.value) || 0 : target.value;

        const keys = name.split('.');
        let current = customer;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        // Dispatch event to notify main script of template changes
        const customChangeEvent = new CustomEvent('customerTemplatesUpdated', {
            detail: { updatedTemplates: this.appState.customers },
            bubbles: true, // Ensure the event bubbles up to where script.js can catch it
            composed: true // Allow event to cross shadow DOM boundaries if any (good practice)
        });
        this.container.dispatchEvent(customChangeEvent);
    }
}