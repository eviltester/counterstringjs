function showRangeDialog(options) {
    return new Promise((resolve, reject) => {
        const showDelay = options.showDelay !== undefined ? options.showDelay : false;
        const defaults = {
            start: '13',
            end: '32',
            minDelay: showDelay ? '50' : undefined,
            maxDelay: showDelay ? '150' : undefined
        };

        // Create overlay
        const overlay = createOverlay();

        // Create popup
        const popup = createPopup();

        // Create title
        const title = createTitle(options.title || 'Range');

        // Create mode selector
        const { modeField, generateRadio, typeRadio } = createModeSelector();

        // Create form
        const form = document.createElement('div');

        // Create form fields
        const { startField, endField, delayFieldsContainer, minDelayField, maxDelayField } = createRangeFormFields(form, defaults, showDelay);

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
        setupRangeEventHandlers({
            overlay,
            popup,
            generateRadio,
            typeRadio,
            cancelButton,
            okButton,
            startField,
            endField,
            minDelayField,
            maxDelayField,
            delayFieldsContainer,
            title,
            resolve,
            reject
        });

        startField.input.focus();
    });
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'range-popup-overlay';
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
    popup.id = 'range-popup';
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
    generateRadio.id = 'mode-generate-range';
    generateRadio.name = 'range-mode';
    generateRadio.value = 'generate';
    generateRadio.checked = true;
    generateRadio.style.cssText = 'margin-right: 8px;';

    const generateLabel = document.createElement('label');
    generateLabel.htmlFor = 'mode-generate-range';
    generateLabel.textContent = 'Generate Range';
    generateLabel.style.cssText = `
        font-weight: 500;
        color: #555;
        font-size: 14px;
        cursor: pointer;
        margin-right: 20px;
    `;

    const typeRadio = document.createElement('input');
    typeRadio.type = 'radio';
    typeRadio.id = 'mode-type-range';
    typeRadio.name = 'range-mode';
    typeRadio.value = 'type';
    typeRadio.style.cssText = 'margin-right: 8px;';

    const typeLabel = document.createElement('label');
    typeLabel.htmlFor = 'mode-type-range';
    typeLabel.textContent = 'Type Range';
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

function createRangeFormFields(form, defaults, showDelay) {
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

    const startField = createField('Start Unicode', 'start', 'number', defaults.start, 0, 65535, 'Unicode code point (0-65535)');
    form.appendChild(startField.field);

    const endField = createField('End Unicode', 'end', 'number', defaults.end, 0, 65535, 'Unicode code point (0-65535)');
    form.appendChild(endField.field);

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
        startField,
        endField,
        delayFieldsContainer,
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

function setupRangeEventHandlers({
    overlay,
    popup,
    generateRadio,
    typeRadio,
    cancelButton,
    okButton,
    startField,
    endField,
    minDelayField,
    maxDelayField,
    delayFieldsContainer,
    title,
    resolve,
    reject
}) {
    function closePopup() {
        document.body.removeChild(overlay);
    }

    // Function to update UI based on selected mode
    function updateUIMode(mode) {
        if (!okButton) return;
        if (mode === 'generate') {
            title.textContent = 'Generate Range';
            okButton.textContent = 'Generate';
            if (delayFieldsContainer) {
                delayFieldsContainer.style.display = 'none';
            }
        } else if (mode === 'type') {
            title.textContent = 'Type Range';
            okButton.textContent = 'Start Typing';
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
        const start = parseInt(startField.input.value, 10);
        const end = parseInt(endField.input.value, 10);

        if (isNaN(start) || start < 0 || start > 65535) {
            alert('Please enter a valid start Unicode (0-65535)');
            return;
        }

        if (isNaN(end) || end < 0 || end > 65535) {
            alert('Please enter a valid end Unicode (0-65535)');
            return;
        }

        if (start > end) {
            alert('Invalid input: Start Unicode must be less than or equal to End Unicode');
            return;
        }

        const mode = generateRadio.checked ? 'generate' : 'type';
        const result = { mode, start, end };

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