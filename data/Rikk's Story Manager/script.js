document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // 1. STATE & CONFIGURATION
    // =================================================================

    // The single source of truth for the entire application. All UI is rendered
    // based on the contents of this object.
    let appState = {
        archetypes: {},
        activeArchetypeKey: null,
    };

    // Pre-defined options for all dropdown menus to ensure consistency and
    // to provide a central place for configuration.
    const CONFIG = {
        stats: ['mood', 'loyalty', 'patience', 'relationship'],
        moods: ['desperate', 'paranoid', 'happy', 'angry', 'chill', 'arrogant', 'cautious', 'nosy', 'manic', 'dreamy'],
        operators: ['is', 'isNot', 'gt', 'gte', 'lt', 'lte'],
        payloadTargets: ['customer', 'player'],
        payloadStats: {
            customer: ['relationship', 'loyalty', 'patience'],
            player: ['cred', 'heat', 'cash']
        },
        payloadOps: ['add', 'subtract', 'set'],
        payloadEventTypes: ['triggerEvent'],
        payloadEvents: ['snitchReport', 'rivalOpChance']
    };

    // DOM Element References are cached here for performance and convenience.
    const importLegacyBtn = document.getElementById('import-legacy-btn');
    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');
    const fileInput = document.getElementById('file-input');
    const archetypeList = document.getElementById('archetype-list');
    const editorPane = document.getElementById('editor-pane');
    const addArchetypeBtn = document.getElementById('add-archetype-btn');

    // A flag to determine which import function to call when the file input changes.
    let currentImportMode = 'new';

    // =================================================================
    // 2. THE LEGACY PARSER / TRANSFORMER
    // =================================================================

    /**
     * This is the core transformation logic. It takes the text content
     * of the old data_customers.js file and converts it into the new declarative format.
     * @param {string} legacyContent - The string content of the old file.
     * @returns {object} The new archetypes object, ready to be loaded into the app state.
     */
    function transformLegacyToNewFormat(legacyContent) {
        let legacyArchetypes;
        try {
            const cleanedContent = legacyContent.replace(/\/\/.*/g, '');
            legacyArchetypes = new Function(`${cleanedContent}; return customerArchetypes;`)();
        
            if (typeof legacyArchetypes !== 'object' || legacyArchetypes === null) {
                throw new Error("The expression 'customerArchetypes' could not be evaluated to an object from the file.");
            }
        } catch (e) {
            console.error("CRITICAL PARSING FAILURE:", e);
            alert(`A critical SyntaxError occurred while trying to parse the legacy file. This usually means the file contains syntax that the parser cannot handle.\n\n- **Check for multi-line comments (/* ... */) in your file and remove them.**\n- **Try running the tool in an Incognito/Private window to disable browser extensions.**\n\nSee the developer console (F12) for the specific error.`);
            return null;
        }
        
        const newArchetypes = {};

        const extractArrayFromSource = (source, key) => {
            const regex = new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`, 's');
            const match = source.match(regex);
            if (!match || !match[1]) return [];
            return match[1]
                .split(',')
                .map(s => s.trim().replace(/^[`"']|[`"']$/g, '').replace(/\\\*/g, '*'))
                .filter(s => s.length > 0);
        };

        for (const key in legacyArchetypes) {
            const old = legacyArchetypes[key];

            const avatarUrl = key === "DESPERATE_FIEND" ? "https://randomuser.me/api/portraits/men/32.jpg"
                          : key === "HIGH_ROLLER" ? "https://randomuser.me/api/portraits/men/45.jpg"
                          : key === "REGULAR_JOE" ? "https://randomuser.me/api/portraits/women/67.jpg"
                          : key === "SNITCH" ? "https://randomuser.me/api/portraits/women/12.jpg"
                          : "";

            const newArch = {
                key: old.key, baseName: old.baseName, avatarUrl: avatarUrl,
                baseStats: { mood: old.initialMood || 'chill', loyalty: 0, patience: 3, relationship: 0 },
                dialogue: {}
            };

            if (old.greeting) {
                const greetingSource = old.greeting.toString();
                newArch.dialogue.greeting = [];
                
                // ROBUSTNESS FIX: Handle both object-based and array-based greetings.
                const objectGreetingMatch = greetingSource.match(/const greetings = {([^}]+)}/s);
                const arrayGreetingMatch = greetingSource.match(/const greetings = \[([^\]]+)\]/s);

                if (objectGreetingMatch && objectGreetingMatch[1]) {
                    // Handle the case with mood variations, e.g., DESPERATE_FIEND
                    const moods = ['paranoid', 'happy', 'angry', 'default'];
                    moods.forEach(mood => {
                        const lines = extractArrayFromSource(objectGreetingMatch[1], mood);
                        if (lines.length > 0) {
                            newArch.dialogue.greeting.push({
                                conditions: mood === 'default' ? [] : [{ stat: 'mood', op: 'is', value: mood }],
                                lines: lines.map(line => line.replace(/\*\*/g, '').replace(/\$\{itemName\}/g, '[ITEM_NAME]').replace(/\$\{customer\.name\}/g, '[CUSTOMER_NAME]')),
                                payload: { type: 'EFFECT', effects: [] }
                            });
                        }
                    });
                } else if (arrayGreetingMatch && arrayGreetingMatch[1]) {
                    // Handle the case with a single array of lines, e.g., STIMULANT_USER
                    const lines = arrayGreetingMatch[1].split(',').map(s => s.trim().replace(/^[`"']|[`"']$/g, '').replace(/\*\*/g, '').replace(/\$\{itemName\}/g, '[ITEM_NAME]').replace(/\$\{customer\.name\}/g, '[CUSTOMER_NAME]'));
                    if (lines.length > 0) {
                        newArch.dialogue.greeting.push({
                            conditions: [], // No conditions, it's a default block
                            lines: lines,
                            payload: { type: 'EFFECT', effects: [] }
                        });
                    }
                }
            }

            if (old.dialogueVariations) {
                for (const contextKey in old.dialogueVariations) {
                    const variationFunc = old.dialogueVariations[contextKey];
                    const variationSource = variationFunc.toString();
                    newArch.dialogue[contextKey] = [];
                    const moods = ['paranoid', 'happy', 'angry', 'default', 'arrogant', 'cautious', 'chill', 'nosy', 'manic', 'dreamy'];
                    moods.forEach(mood => {
                        const lines = extractArrayFromSource(variationSource, mood);
                        if (lines.length > 0) {
                            newArch.dialogue[contextKey].push({
                                conditions: mood === 'default' ? [] : [{ stat: 'mood', op: 'is', value: mood }],
                                lines: lines.map(line => line.replace(/\*\*/g, '')),
                                payload: { type: 'EFFECT', effects: [] }
                            });
                        }
                    });
                    if (newArch.dialogue[contextKey].length === 0) {
                         const singleReturn = variationSource.match(/return\s*\[([^\]]*)\]/s);
                         if (singleReturn && singleReturn[1]) {
                             const lines = singleReturn[1].split(',').map(s => s.trim().replace(/^[`"']|[`"']$/g, ''));
                             newArch.dialogue[contextKey].push({ conditions: [], lines: lines, payload: { type: 'EFFECT', effects: [] } });
                         }
                    }
                }
            }
            
            if (old.postDealEffect) {
                const effectSource = old.postDealEffect.toString();
                 if (key === 'SNITCH' && effectSource.includes('heat +=')) {
                    if (!newArch.dialogue.rikkSellsSuccess) {
                        newArch.dialogue.rikkSellsSuccess = [{ conditions:[], lines:['Oh, that\'s... *noted*. Thanks, Rikk. Very... informative.'], payload:{type:"EFFECT", effects:[]}}];
                    }
                    newArch.dialogue.rikkSellsSuccess[0].payload.effects.push({
                        type: 'triggerEvent', eventName: 'snitchReport', chance: 0.65, heatValue: 15, credValue: -2
                    });
                }
            }
            newArchetypes[key] = newArch;
        }
        return newArchetypes;
    }

    // =================================================================
    // 3. RENDERING FUNCTIONS
    // =================================================================
    
    function renderArchetypeList() {
        archetypeList.innerHTML = '';
        const keys = Object.keys(appState.archetypes).sort();
        keys.forEach(key => {
            const item = document.createElement('div');
            item.className = 'archetype-list-item';
            item.textContent = key;
            item.dataset.key = key;
            if (key === appState.activeArchetypeKey) {
                item.classList.add('active');
            }
            archetypeList.appendChild(item);
        });
    }

    function renderEditor() {
        const key = appState.activeArchetypeKey;
        if (!key || !appState.archetypes[key]) {
            editorPane.innerHTML = `<div class="placeholder-text"><p>Select an archetype from the left to begin editing, or create a new one.</p></div>`;
            return;
        }
        const data = appState.archetypes[key];
        const createSelect = (options, selected) => options.map(opt => `<option value="${opt}" ${opt === selected ? 'selected' : ''}>${opt}</option>`).join('');

        editorPane.innerHTML = `
            <div class="editor-section"><h3>Basic Info</h3><div class="form-group"><label>Key (Unique ID)</label><input type="text" value="${data.key}" name="key" readonly></div><div class="form-group"><label>Base Name</label><input type="text" value="${data.baseName}" name="baseName"></div><div class="form-group"><label>Avatar URL</label><input type="text" value="${data.avatarUrl || ''}" name="avatarUrl"></div></div>
            <div class="editor-section"><h3>Base Stats</h3><div class="form-group"><label>Initial Mood</label><select name="baseStats.mood">${createSelect(CONFIG.moods, data.baseStats.mood)}</select></div><div class="form-group"><label>Loyalty</label><input type="number" value="${data.baseStats.loyalty}" name="baseStats.loyalty"></div><div class="form-group"><label>Patience</label><input type="number" value="${data.baseStats.patience}" name="baseStats.patience"></div><div class="form-group"><label>Relationship</label><input type="number" value="${data.baseStats.relationship}" name="baseStats.relationship"></div></div>
            <div class="editor-section"><h3>Dialogue Nodes</h3><button class="btn btn-add" data-action="add-dialogue-node">+</button>${Object.keys(data.dialogue || {}).map(nodeKey => `<div class="dynamic-list-item"><div class="item-header"><h4>Context: ${nodeKey}</h4><button class="btn btn-danger" data-action="remove-dialogue-node" data-node-key="${nodeKey}">Remove</button></div><button class="btn btn-add" data-action="add-conditional-block" data-node-key="${nodeKey}">+ Block</button>${(data.dialogue[nodeKey] || []).map((block, blockIndex) => `<div class="dynamic-list-item"><div class="item-header"><h5>Conditional Block ${blockIndex + 1}</h5><button class="btn btn-danger" data-action="remove-conditional-block" data-node-key="${nodeKey}" data-block-index="${blockIndex}">X</button></div><h6>Conditions</h6><button class="btn btn-add" data-action="add-condition" data-node-key="${nodeKey}" data-block-index="${blockIndex}">+ Condition</button>${(block.conditions || []).map((cond, condIndex) => `<div class="form-group" style="display: flex; gap: 5px; align-items: center;"><span>IF</span><select name="dialogue.${nodeKey}.${blockIndex}.conditions.${condIndex}.stat">${createSelect(CONFIG.stats, cond.stat)}</select><select name="dialogue.${nodeKey}.${blockIndex}.conditions.${condIndex}.op">${createSelect(CONFIG.operators, cond.op)}</select><input type="text" value="${cond.value}" name="dialogue.${nodeKey}.${blockIndex}.conditions.${condIndex}.value"><button class="btn btn-danger" data-action="remove-condition" data-node-key="${nodeKey}" data-block-index="${blockIndex}" data-cond-index="${condIndex}">-</button></div>`).join('')}<h6>Lines (one per line)</h6><textarea name="dialogue.${nodeKey}.${blockIndex}.lines" rows="${(block.lines || []).length + 1}">${(block.lines || []).join('\n')}</textarea><h6>Payload (Feature simplified for this example)</h6></div>`).join('')}</div>`).join('')}</div>`;
    }

    // =================================================================
    // 4. EVENT HANDLERS & LOGIC
    // =================================================================
    
    function handleArchetypeSelect(event) {
        const target = event.target.closest('.archetype-list-item');
        if (target) {
            appState.activeArchetypeKey = target.dataset.key;
            renderArchetypeList();
            renderEditor();
        }
    }

    function handleEditorMutation(event) {
        if (event && typeof event.stopPropagation === 'function') {
            event.stopPropagation();
        }

        const target = event.target;
        const action = target.dataset.action;
        if (!action) return;
        
        const key = appState.activeArchetypeKey;
        if (!key && action !== 'add-archetype') {
            alert("Please select an archetype first.");
            return;
        }
        const data = appState.archetypes[key];

        const nodeKey = target.dataset.nodeKey;
        const blockIndex = parseInt(target.dataset.blockIndex);

        switch (action) {
            case 'add-archetype':
                const newKey = prompt("Enter a unique key for the new archetype (e.g., NEW_ARCHETYPE):");
                if (newKey && !appState.archetypes[newKey]) {
                    appState.archetypes[newKey] = {
                        key: newKey, baseName: "New Archetype", baseStats: { mood: 'chill', loyalty: 0, patience: 3, relationship: 0 }, dialogue: {}
                    };
                    appState.activeArchetypeKey = newKey;
                    renderArchetypeList();
                } else if (newKey) { alert("Error: Key already exists."); }
                break;
            case 'add-dialogue-node':
                const newNodeKey = prompt("Enter a key for the new dialogue context (e.g., rikkIsBroke):");
                if (newNodeKey && !data.dialogue[newNodeKey]) { data.dialogue[newNodeKey] = []; }
                break;
            case 'remove-dialogue-node':
                if (confirm(`Are you sure you want to delete the "${nodeKey}" dialogue context?`)) { delete data.dialogue[nodeKey]; }
                break;
            case 'add-conditional-block':
                if (!data.dialogue[nodeKey]) data.dialogue[nodeKey] = [];
                data.dialogue[nodeKey].push({ conditions: [], lines: [], payload: { type: "EFFECT", effects: [] } });
                break;
            case 'remove-conditional-block':
                data.dialogue[nodeKey].splice(blockIndex, 1);
                break;
            case 'add-condition':
                data.dialogue[nodeKey][blockIndex].conditions.push({ stat: 'mood', op: 'is', value: 'chill' });
                break;
            case 'remove-condition':
                data.dialogue[nodeKey][blockIndex].conditions.splice(parseInt(target.dataset.condIndex), 1);
                break;
        }
        renderEditor();
    }
    
    function handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        if (!name) return;
        const key = appState.activeArchetypeKey;
        const data = appState.archetypes[key];
        let value = target.type === 'number' ? parseFloat(target.value) || 0 : target.value;
        if (target.nodeName === 'TEXTAREA' && name.includes('.lines')) {
            value = target.value.split('\n').filter(line => line.trim() !== '');
        }
        const keys = name.split('.');
        let current = data;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = (isNaN(parseInt(keys[i+1]))) ? {} : [];
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    }

    function handleFileExport() {
        if (Object.keys(appState.archetypes).length === 0) { alert("No data to export."); return; }
        const jsonString = JSON.stringify(appState.archetypes, null, 4);
        const fileContent = `export const customerTemplates = ${jsonString};`;
        const blob = new Blob([fileContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'customer_templates.js';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    }
    
    function handleFileImport(event) {
        const file = event.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                let content = e.target.result;
                content = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
                appState.archetypes = JSON.parse(content);
                appState.activeArchetypeKey = null;
                renderArchetypeList(); renderEditor();
                alert('File imported successfully!');
            } catch (error) {
                alert('Failed to parse file. Please ensure it is a valid customer_templates.js file.');
                console.error("Import Error:", error);
            }
        };
        reader.readAsText(file);
    }

    function handleLegacyFileImport(event) {
        const file = event.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log("Legacy file loaded, attempting to transform...");
            const transformedData = transformLegacyToNewFormat(e.target.result);
            if (transformedData) {
                appState.archetypes = transformedData;
                appState.activeArchetypeKey = null;
                renderArchetypeList();
                renderEditor();
                alert('Legacy file imported and transformed successfully! Please review the data before exporting.');
            }
            // If transformLegacyToNewFormat returned null, an alert was already shown.
        };
        reader.readAsText(file);
    }

    function processImport(event) {
        if (currentImportMode === 'legacy') { handleLegacyFileImport(event); } 
        else { handleFileImport(event); }
        fileInput.value = '';
    }

    // =================================================================
    // 5. INITIALIZATION
    // =================================================================
    
    function init() {
        importBtn.addEventListener('click', () => { currentImportMode = 'new'; fileInput.click(); });
        importLegacyBtn.addEventListener('click', () => { currentImportMode = 'legacy'; fileInput.click(); });
        fileInput.addEventListener('change', processImport);
        exportBtn.addEventListener('click', handleFileExport);
        archetypeList.addEventListener('click', handleArchetypeSelect);
        addArchetypeBtn.addEventListener('click', () => handleEditorMutation({ target: { dataset: { action: 'add-archetype' }}}));
        editorPane.addEventListener('click', handleEditorMutation);
        editorPane.addEventListener('change', handleInputChange);
        renderArchetypeList();
        renderEditor();
    }

    init();
});