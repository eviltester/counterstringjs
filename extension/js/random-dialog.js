function showRandomDialog(options) {
    return new Promise((resolve, reject) => {
        const showDelay = options.showDelay !== undefined ? options.showDelay : false;
        const defaults = {
            pattern: '',
            flags: '',
            minDelay: showDelay ? '50' : undefined,
            maxDelay: showDelay ? '150' : undefined
        };

        // Create overlay
        const overlay = createOverlay();

        // Create popup
        const popup = createPopup();

        // Create title
        const title = createTitle(options.title || 'Random');

        // Create mode selector
        const { modeField, generateRadio, typeRadio } = createModeSelector();

        // Create form
        const form = document.createElement('div');

        // Create form fields
        const { sampleField, patternField, flagsField, delayFieldsContainer, minDelayField, maxDelayField, links } = createRandomFormFields(form, defaults, showDelay);

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
        setupRandomEventHandlers({
            overlay,
            popup,
            generateRadio,
            typeRadio,
            cancelButton,
            okButton,
            sampleField,
            patternField,
            flagsField,
            minDelayField: minDelayField,
            maxDelayField: maxDelayField,
            delayFieldsContainer,
            title,
            resolve,
            reject
        });

        patternField.input.focus();
    });
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'random-popup-overlay';
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
    popup.id = 'random-popup';
    popup.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        min-width: 400px;
        max-width: 500px;
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
    generateRadio.id = 'mode-generate-random';
    generateRadio.name = 'random-mode';
    generateRadio.value = 'generate';
    generateRadio.checked = true;
    generateRadio.style.cssText = 'margin-right: 8px;';

    const generateLabel = document.createElement('label');
    generateLabel.htmlFor = 'mode-generate-random';
    generateLabel.textContent = 'Generate Random';
    generateLabel.style.cssText = `
        font-weight: 500;
        color: #555;
        font-size: 14px;
        cursor: pointer;
        margin-right: 20px;
    `;

    const typeRadio = document.createElement('input');
    typeRadio.type = 'radio';
    typeRadio.id = 'mode-type-random';
    typeRadio.name = 'random-mode';
    typeRadio.value = 'type';
    typeRadio.style.cssText = 'margin-right: 8px;';

    const typeLabel = document.createElement('label');
    typeLabel.htmlFor = 'mode-type-random';
    typeLabel.textContent = 'Type Random';
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

function createRandomFormFields(form, defaults, showDelay) {
    function createField(label, id, type, value, min, max, helpText, rows) {
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

        let input;
        if (type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = rows || 3;
            input.style.resize = 'vertical';
        } else {
            input = document.createElement('input');
            input.type = type;
        }
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
            font-family: monospace;
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

    // Sample regex dropdown
    const sampleField = document.createElement('div');
    sampleField.style.cssText = 'margin-bottom: 20px;';

    const sampleLabel = document.createElement('label');
    sampleLabel.textContent = 'Sample Regexes';
    sampleLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #555;
        font-size: 14px;
    `;

    const sampleSelect = document.createElement('select');
    sampleSelect.id = 'sampleRegex';
    sampleSelect.style.cssText = `
        width:100%;
        padding: 10px 12px;
        border:2px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.2s;
    `;
    sampleSelect.onfocus = () => sampleSelect.style.borderColor = '#4a90d9';
    sampleSelect.onblur = () => sampleSelect.style.borderColor = '#ddd';

    sampleRegexes.forEach(sample => {
        const option = document.createElement('option');
        option.value = sample.regex;
        option.textContent = sample.name;
        sampleSelect.appendChild(option);
    });

    sampleField.appendChild(sampleLabel);
    sampleField.appendChild(sampleSelect);
    form.appendChild(sampleField);

    const patternField = createField('Regex Pattern', 'pattern', 'textarea', defaults.pattern, undefined, undefined, 'Enter a valid regular expression pattern');
    form.appendChild(patternField.field);

    // Populate textarea when sample is selected
    sampleSelect.onchange = () => {
        patternField.input.value = sampleSelect.value;
    };

    const flagsField = createField('Flags', 'flags', 'text', defaults.flags, undefined, undefined, 'Only \'i\' (case-insensitive) and \'m\' (multiline) are allowed');
    form.appendChild(flagsField.field);

    let minDelayField, maxDelayField, delayFieldsContainer;
    if (showDelay) {
        delayFieldsContainer = document.createElement('div');

        minDelayField = createField('Min Delay (ms)', 'minDelay', 'number', defaults.minDelay, 10, 5000, 'Minimum delay between characters');
        delayFieldsContainer.appendChild(minDelayField.field);

        maxDelayField = createField('Max Delay (ms)', 'maxDelay', 'number', defaults.maxDelay, 10, 5000, 'Maximum delay between characters');
        delayFieldsContainer.appendChild(maxDelayField.field);

        form.appendChild(delayFieldsContainer);
    }

    // Add links
    const links = document.createElement('div');
    links.style.cssText = `
        margin-bottom: 20px;
        font-size: 12px;
        color: #666;
    `;
    links.innerHTML = 'RegEx info <a href="https://anywaydata.com/docs/test-data/regex-test-data" target="_blank">anywaydata.com</a> | <a href="http://fent.github.io/randexp.js/" target="_blank">randexp.js</a>';
    form.appendChild(links);

    return {
        sampleField,
        patternField,
        flagsField,
        delayFieldsContainer,
        minDelayField,
        maxDelayField,
        links
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

function setupRandomEventHandlers(params) {
    const {
        overlay,
        popup,
        generateRadio,
        typeRadio,
        cancelButton: cancelBtn,
        okButton: okBtn,
        sampleField: sampleParam,
        patternField: patternParam,
        flagsField: flagsParam,
        minDelayField: minDelayParam,
        maxDelayField: maxDelayParam,
        delayFieldsContainer,
        title,
        resolve,
        reject
    } = params;
    function closePopup() {
        document.body.removeChild(overlay);
    }

    // Function to update UI based on selected mode
    function updateUIMode(mode) {
        if (!okBtn) return;
        if (mode === 'generate') {
            title.textContent = 'Generate Random';
            okBtn.textContent = 'Generate';
            if (delayFieldsContainer) {
                delayFieldsContainer.style.display = 'none';
            }
        } else if (mode === 'type') {
            title.textContent = 'Type Random';
            okBtn.textContent = 'Start Typing';
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

    cancelBtn.onclick = () => {
        closePopup();
        reject(null);
    };

    okBtn.onclick = () => {
        const pattern = patternParam.input.value.trim();
        const flags = flagsParam.input.value.trim();

        if (pattern === '') {
            alert('Please enter a regex pattern');
            return;
        }

        const mode = generateRadio.checked ? 'generate' : 'type';
        const result = { mode, pattern, flags };

        if (mode === 'type') {
            const minDelay = parseInt(minDelayParam.input.value, 10);
            const maxDelay = parseInt(maxDelayParam.input.value, 10);

            if (isNaN(minDelay) || minDelay < 0) {
                alert('Please enter a valid minimum delay');
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

