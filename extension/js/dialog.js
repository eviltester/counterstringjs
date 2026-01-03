function showCounterstringDialog(options) {
    return new Promise((resolve, reject) => {
        const showDelay = options.showDelay !== undefined ? options.showDelay : false;
        const showTriggerInputEvents = options.showTriggerInputEvents !== undefined ? options.showTriggerInputEvents : true;
        const defaults = {
            length: '100',
            minDelay: showDelay ? '100' : undefined,
            maxDelay: showDelay ? '200' : undefined
        };

        // Create overlay
        const overlay = createOverlay();

        // Create popup
        const popup = createPopup();

        // Create title
        const title = createTitle(options.title || 'Counterstring');

        // Create mode selector
        const { modeField, generateRadio, typeRadio } = createModeSelector();

        // Create form
        const form = document.createElement('div');

        // Create form fields
        const { lengthField, delimiterField, triggerInputEventsContainer, delayFieldsContainer, triggerInputEventsField, minDelayField, maxDelayField } = createFormFields(form, defaults, showTriggerInputEvents, showDelay);

        // Create buttons
        const { buttons, cancelButton, okButton } = createButtons(options.buttonText || 'Generate');

        // Assemble DOM
        popup.appendChild(title);
        popup.appendChild(modeField);
        popup.appendChild(form);
        popup.appendChild(buttons);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Setup event handlers
        setupEventHandlers({
            overlay,
            popup,
            generateRadio,
            typeRadio,
            cancelButton,
            okButton,
            lengthField,
            delimiterField,
            triggerInputEventsField,
            minDelayField,
            maxDelayField,
            triggerInputEventsContainer,
            delayFieldsContainer,
            title,
            resolve,
            reject,
            showTriggerInputEvents
        });

        lengthField.input.focus();
    });
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'counterstring-popup-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    `;
    return overlay;
}

function createPopup() {
    const popup = document.createElement('div');
    popup.id = 'counterstring-popup';
    popup.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        min-width: 350px;
        max-width: 450px;
        z-index: 10001;
    `;
    return popup;
}

function createTitle(titleText) {
    const title = document.createElement('h2');
    title.textContent = titleText;
    title.style.cssText = `
        margin: 0 0 20px 0;
        font-size: 20px;
        font-weight: 600;
        color: #333;
    `;
    return title;
}

function createModeSelector() {
    const modeField = document.createElement('div');
    modeField.style.cssText = 'margin-bottom: 20px;';

    const generateRadio = document.createElement('input');
    generateRadio.type = 'radio';
    generateRadio.id = 'mode-generate';
    generateRadio.name = 'mode';
    generateRadio.value = 'generate';
    generateRadio.checked = true;
    generateRadio.style.cssText = 'margin-right: 8px;';

    const generateLabel = document.createElement('label');
    generateLabel.htmlFor = 'mode-generate';
    generateLabel.textContent = 'Generate Counterstring';
    generateLabel.style.cssText = `
        font-weight: 500;
        color: #555;
        font-size: 14px;
        cursor: pointer;
        margin-right: 20px;
    `;

    const typeRadio = document.createElement('input');
    typeRadio.type = 'radio';
    typeRadio.id = 'mode-type';
    typeRadio.name = 'mode';
    typeRadio.value = 'type';
    typeRadio.style.cssText = 'margin-right: 8px;';

    const typeLabel = document.createElement('label');
    typeLabel.htmlFor = 'mode-type';
    typeLabel.textContent = 'Type Counterstring';
    typeLabel.style.cssText = `
        font-weight: 500;
        color: #555;
        font-size: 14px;
        cursor: pointer;
    `;

    modeField.appendChild(generateRadio);
    modeField.appendChild(generateLabel);
    modeField.appendChild(typeRadio);
    modeField.appendChild(typeLabel);

    return { modeField, generateRadio, typeRadio };
}

function createFormFields(form, defaults, showTriggerInputEvents, showDelay) {
    function createField(label, id, type, value, min, max, helpText) {
        const field = document.createElement('div');
        field.style.cssText = 'margin-bottom: 20px;';

        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #555;
            font-size: 14px;
        `;

        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.value = value;
        if (min !== undefined) input.min = min;
        if (max !== undefined) input.max = max;
        input.style.cssText = `
            width:100%;
            padding: 10px 12px;
            border:2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
            transition: border-color 0.2s;
        `;
        input.onfocus = () => input.style.borderColor = '#4a90d9';
        input.onblur = () => input.style.borderColor = '#ddd';

        if (helpText) {
            const help = document.createElement('div');
            help.textContent = helpText;
            help.style.cssText = `
                font-size: 12px;
                color: #888;
                margin-top: 5px;
            `;
            field.appendChild(labelEl);
            field.appendChild(input);
            field.appendChild(help);
        } else {
            field.appendChild(labelEl);
            field.appendChild(input);
        }

        return { field, input };
    }

    const lengthField = createField('Counterstring Length', 'length', 'number', defaults.length, 1, 1000000);
    form.appendChild(lengthField.field);

    const delimiterField = createField('Delimiter', 'delimiter', 'text', '*', undefined, undefined, 'Single character (default: *)');
    delimiterField.input.maxLength = 1;
    delimiterField.input.style.width = '100px';
    form.appendChild(delimiterField.field);

    let triggerInputEventsField, triggerInputEventsContainer;
    if (showTriggerInputEvents) {
        triggerInputEventsField = createField('', 'triggerInputEvents', 'checkbox', true);
        triggerInputEventsField.input.checked = true;
        triggerInputEventsField.input.style.width = 'auto';
        triggerInputEventsField.input.style.marginRight = '12px';
        triggerInputEventsField.input.style.flex = '0 0 auto';

        const triggerInputEventsLabel = document.createElement('label');
        triggerInputEventsLabel.htmlFor = 'triggerInputEvents';
        triggerInputEventsLabel.textContent = 'Trigger input events';
        triggerInputEventsLabel.style.cssText = `
            font-weight: normal;
            color: #555;
            font-size: 14px;
            cursor: pointer;
            flex: 1;
        `;

        triggerInputEventsContainer = document.createElement('div');
        triggerInputEventsContainer.style.cssText = 'margin-bottom: 15px; display: flex; align-items: center; width: 100%;';
        triggerInputEventsContainer.appendChild(triggerInputEventsField.input);
        triggerInputEventsContainer.appendChild(triggerInputEventsLabel);

        form.appendChild(triggerInputEventsContainer);
    }

    let minDelayField, maxDelayField, delayFieldsContainer;
    if (showDelay) {
        delayFieldsContainer = document.createElement('div');

        minDelayField = createField('Min Delay (ms)', 'minDelay', 'number', defaults.minDelay, 10, 5000, 'Minimum delay between characters');
        delayFieldsContainer.appendChild(minDelayField.field);

        maxDelayField = createField('Max Delay (ms)', 'maxDelay', 'number', defaults.maxDelay, 10, 5000, 'Maximum delay between characters');
        delayFieldsContainer.appendChild(maxDelayField.field);

        form.appendChild(delayFieldsContainer);
    }

    return {
        lengthField,
        delimiterField,
        triggerInputEventsContainer,
        delayFieldsContainer,
        triggerInputEventsField,
        minDelayField,
        maxDelayField
    };
}

function createButtons(buttonText) {
    const buttons = document.createElement('div');
    buttons.style.cssText = `
        display: flex;
        gap: 12px;
        margin-top: 25px;
    `;

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
        flex: 1;
        padding: 12px 20px;
        background: #f5f5f5;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
    `;
    cancelButton.onmouseover = () => cancelButton.style.background = '#e8e8e8';
    cancelButton.onmouseout = () => cancelButton.style.background = '#f5f5f5';

    const okButton = document.createElement('button');
    okButton.textContent = buttonText;
    okButton.style.cssText = `
        flex: 1;
        padding: 12px 20px;
        background: #4a90d9;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        color: white;
        transition: background 0.2s;
    `;
    okButton.onmouseover = () => okButton.style.background = '#3a80c9';
    okButton.onmouseout = () => okButton.style.background = '#4a90d9';

    buttons.appendChild(cancelButton);
    buttons.appendChild(okButton);

    return { buttons, cancelButton, okButton };
}

function setupEventHandlers({
    overlay,
    popup,
    generateRadio,
    typeRadio,
    cancelButton,
    okButton,
    lengthField,
    delimiterField,
    triggerInputEventsField,
    minDelayField,
    maxDelayField,
    triggerInputEventsContainer,
    delayFieldsContainer,
    title,
    resolve,
    reject,
    showTriggerInputEvents
}) {
    function closePopup() {
        document.body.removeChild(overlay);
    }

    // Function to update UI based on selected mode
    function updateUIMode(mode) {
        if (!okButton) return;
        if (mode === 'generate') {
            title.textContent = 'Generate Counterstring';
            okButton.textContent = 'Generate';
            if (triggerInputEventsContainer) {
                triggerInputEventsContainer.style.display = 'flex';
            }
            if (delayFieldsContainer) {
                delayFieldsContainer.style.display = 'none';
            }
        } else if (mode === 'type') {
            title.textContent = 'Type Counterstring';
            okButton.textContent = 'Start Typing';
            if (triggerInputEventsContainer) {
                triggerInputEventsContainer.style.display = 'none';
            }
            if (delayFieldsContainer) {
                delayFieldsContainer.style.display = 'block';
            }
        }
    }

    // Close dialog when clicking outside
    overlay.onclick = () => {
        closePopup();
        reject(null);
    };

    // Prevent closing when clicking inside the popup
    popup.onclick = (e) => {
        e.stopPropagation();
    };

    // Add event listeners to radio buttons
    generateRadio.addEventListener('change', () => updateUIMode('generate'));
    typeRadio.addEventListener('change', () => updateUIMode('type'));

    cancelButton.onclick = () => {
        closePopup();
        reject(null);
    };

    okButton.onclick = () => {
        const length = parseInt(lengthField.input.value, 10);

        if (isNaN(length) || length <= 0) {
            alert('Please enter a valid positive length');
            return;
        }

        const mode = generateRadio.checked ? 'generate' : 'type';
        const result = { mode, length };

        // Add checkbox value to result (only for generate mode)
        if (mode === 'generate' && triggerInputEventsField) {
            result.triggerInputEvents = triggerInputEventsField.input.checked;
        }

        let delimiterValue = delimiterField.input.value;

        if (delimiterValue.length > 0) {
            result.delimiter = delimiterValue.charAt(0);
        } else {
            result.delimiter = '*';
        }

        if (mode === 'type') {
            const minDelay = parseInt(minDelayField.input.value, 10);
            const maxDelay = parseInt(maxDelayField.input.value, 10);

            if (isNaN(minDelay) || minDelay < 0) {
                alert('Please enter a valid minimum delay');
                return;
            }

            if (isNaN(maxDelay) || maxDelay < 0) {
                alert('Please enter a valid maximum delay');
                return;
            }

            if (minDelay > maxDelay) {
                alert('Minimum delay must be less than or equal to maximum delay');
                return;
            }

            result.minDelay = minDelay;
            result.maxDelay = maxDelay;
        }

        closePopup();
        resolve(result);
    };

    // Initialize UI for default mode (generate)
    updateUIMode('generate');
}
