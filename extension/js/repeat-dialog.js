function showRepeatDialog() {
    return new Promise((resolve, reject) => {
        // Create overlay
        const overlay = createOverlay();

        // Create popup
        const popup = createPopup();

        // Create title
        const title = createTitle('Repeat');

        // Create mode selector
        const { modeField, generateRadio, typeRadio } = createModeSelector();

        // Create form
        const form = document.createElement('div');

        // Create speed controls (for type mode)
        const { speedControls, minDelayField, maxDelayField } = createSpeedControls();

        // Create content type selector and inputs
        const { contentTypeField, repeatTextRadio, chrRadio, regexRadio, textInputGroup, chrInputGroup, regexInputGroup, textInput, chrInput, regexInput, flagsInput, sampleSelect, repeatCountInput, repeatCountGroup } = createContentTypeControls();

        // Create buttons
        const { buttons, cancelButton, okButton } = createButtons();

        // Assemble DOM
        popup.appendChild(title);
        popup.appendChild(modeField);
        popup.appendChild(speedControls);
        popup.appendChild(form);
        form.appendChild(contentTypeField);
        form.appendChild(textInputGroup);
        form.appendChild(chrInputGroup);
        form.appendChild(regexInputGroup);
        form.appendChild(repeatCountGroup);
        popup.appendChild(buttons);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Setup event handlers
        setupRepeatEventHandlers({
            overlay,
            popup,
            generateRadio,
            typeRadio,
            speedControls,
            minDelayField,
            maxDelayField,
            repeatTextRadio,
            chrRadio,
            regexRadio,
            textInputGroup,
            chrInputGroup,
            regexInputGroup,
            sampleSelect,
            regexInput,
            textInput,
            chrInput,
            flagsInput,
            repeatCountInput,
            cancelButton,
            okButton,
            title,
            resolve,
            reject
        });

        textInput.focus();
    });
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'repeat-dialog-overlay';
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
    popup.id = 'repeat-dialog-popup';
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
    generateRadio.id = 'mode-generate-repeat';
    generateRadio.name = 'repeat-mode';
    generateRadio.value = 'generate';
    generateRadio.checked = true;
    generateRadio.style.cssText = 'margin-right: 8px;';

    const generateLabel = document.createElement('label');
    generateLabel.htmlFor = 'mode-generate-repeat';
    generateLabel.textContent = 'Generate Repeat';
    generateLabel.style.cssText = `
        font-weight: 500;
        color: #555;
        font-size: 14px;
        cursor: pointer;
        margin-right: 20px;
    `;

    const typeRadio = document.createElement('input');
    typeRadio.type = 'radio';
    typeRadio.id = 'mode-type-repeat';
    typeRadio.name = 'repeat-mode';
    typeRadio.value = 'type';
    typeRadio.style.cssText = 'margin-right: 8px;';

    const typeLabel = document.createElement('label');
    typeLabel.htmlFor = 'mode-type-repeat';
    typeLabel.textContent = 'Type Repeat';
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

function createSpeedControls() {
    const speedControls = document.createElement('div');
    speedControls.style.cssText = 'margin-bottom: 20px;';

    const minDelayField = document.createElement('div');
    minDelayField.style.cssText = 'margin-bottom: 20px;';

    const minDelayLabel = document.createElement('label');
    minDelayLabel.textContent = 'Min Delay (ms)';
    minDelayLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #555;
        font-size: 14px;
    `;

    const minDelayInput = document.createElement('input');
    minDelayInput.type = 'number';
    minDelayInput.value = '100';
    minDelayInput.min = '10';
    minDelayInput.max = '5000';
    minDelayInput.style.cssText = `
        width: 100%;
        padding: 10px 12px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.2s;
    `;
    minDelayInput.onfocus = () => minDelayInput.style.borderColor = '#4a90d9';
    minDelayInput.onblur = () => minDelayInput.style.borderColor = '#ddd';

    const minDelayHelp = document.createElement('div');
    minDelayHelp.textContent = 'Minimum delay between characters';
    minDelayHelp.style.cssText = `
        font-size: 12px;
        color: #888;
        margin-top: 5px;
    `;

    minDelayField.appendChild(minDelayLabel);
    minDelayField.appendChild(minDelayInput);
    minDelayField.appendChild(minDelayHelp);

    const maxDelayField = document.createElement('div');
    maxDelayField.style.cssText = 'margin-bottom: 20px;';

    const maxDelayLabel = document.createElement('label');
    maxDelayLabel.textContent = 'Max Delay (ms)';
    maxDelayLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #555;
        font-size: 14px;
    `;

    const maxDelayInput = document.createElement('input');
    maxDelayInput.type = 'number';
    maxDelayInput.value = '200';
    maxDelayInput.min = '10';
    maxDelayInput.max = '5000';
    maxDelayInput.style.cssText = `
        width: 100%;
        padding: 10px 12px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.2s;
    `;
    maxDelayInput.onfocus = () => maxDelayInput.style.borderColor = '#4a90d9';
    maxDelayInput.onblur = () => maxDelayInput.style.borderColor = '#ddd';

    const maxDelayHelp = document.createElement('div');
    maxDelayHelp.textContent = 'Maximum delay between characters';
    maxDelayHelp.style.cssText = `
        font-size: 12px;
        color: #888;
        margin-top: 5px;
    `;

    maxDelayField.appendChild(maxDelayLabel);
    maxDelayField.appendChild(maxDelayInput);
    maxDelayField.appendChild(maxDelayHelp);

    speedControls.appendChild(minDelayField);
    speedControls.appendChild(maxDelayField);

    return { speedControls, minDelayField: minDelayInput, maxDelayField: maxDelayInput };
}

function createContentTypeControls() {
    const contentTypeField = document.createElement('div');
    contentTypeField.style.cssText = 'margin-bottom: 20px;';

    const repeatTextLabel = document.createElement('label');
    repeatTextLabel.style.cssText = `
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-weight: 500;
        color: #555;
        font-size: 14px;
        cursor: pointer;
    `;

    const repeatTextRadio = document.createElement('input');
    repeatTextRadio.type = 'radio';
    repeatTextRadio.name = 'content-mode';
    repeatTextRadio.checked = true;
    repeatTextRadio.style.cssText = 'margin-right: 8px;';

    const repeatTextSpan = document.createElement('span');
    repeatTextSpan.textContent = 'Text';
    repeatTextSpan.style.cssText = 'font-size: 14px;';

    repeatTextLabel.appendChild(repeatTextRadio);
    repeatTextLabel.appendChild(repeatTextSpan);

    const chrLabel = document.createElement('label');
    chrLabel.style.cssText = `
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-weight: 500;
        color: #555;
        font-size: 14px;
        cursor: pointer;
    `;

    const chrRadio = document.createElement('input');
    chrRadio.type = 'radio';
    chrRadio.name = 'content-mode';
    chrRadio.style.cssText = 'margin-right: 8px;';

    const chrSpan = document.createElement('span');
    chrSpan.textContent = 'Chr';
    chrSpan.style.cssText = 'font-size: 14px;';

    chrLabel.appendChild(chrRadio);
    chrLabel.appendChild(chrSpan);

    const regexLabel = document.createElement('label');
    regexLabel.style.cssText = `
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-weight: 500;
        color: #555;
        font-size: 14px;
        cursor: pointer;
    `;

    const regexRadio = document.createElement('input');
    regexRadio.type = 'radio';
    regexRadio.name = 'content-mode';
    regexRadio.style.cssText = 'margin-right: 8px;';

    const regexSpan = document.createElement('span');
    regexSpan.textContent = 'Regex';
    regexSpan.style.cssText = 'font-size: 14px;';

    regexLabel.appendChild(regexRadio);
    regexLabel.appendChild(regexSpan);

    contentTypeField.appendChild(repeatTextLabel);
    contentTypeField.appendChild(chrLabel);
    contentTypeField.appendChild(regexLabel);

    // Text input
    const textInputGroup = document.createElement('div');
    textInputGroup.style.cssText = 'margin-bottom: 20px;';

    const textLabel = document.createElement('label');
    textLabel.textContent = 'Text:';
    textLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #555;
        font-size: 14px;
    `;

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.style.cssText = `
        width: 100%;
        padding: 10px 12px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.2s;
    `;
    textInput.onfocus = () => textInput.style.borderColor = '#4a90d9';
    textInput.onblur = () => textInput.style.borderColor = '#ddd';

    textInputGroup.appendChild(textLabel);
    textInputGroup.appendChild(textInput);

    // Chr input
    const chrInputGroup = document.createElement('div');
    chrInputGroup.style.cssText = 'margin-bottom: 20px; display: none;';

    const chrLabel2 = document.createElement('label');
    chrLabel2.textContent = 'Chr:';
    chrLabel2.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #555;
        font-size: 14px;
    `;

    const chrInput = document.createElement('input');
    chrInput.type = 'number';
    chrInput.value = '13';
    chrInput.min = '1';
    chrInput.max = '65535';
    chrInput.style.cssText = `
        width: 100%;
        padding: 10px 12px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.2s;
    `;
    chrInput.onfocus = () => chrInput.style.borderColor = '#4a90d9';
    chrInput.onblur = () => chrInput.style.borderColor = '#ddd';

    chrInputGroup.appendChild(chrLabel2);
    chrInputGroup.appendChild(chrInput);

    // Regex input
    const regexInputGroup = document.createElement('div');
    regexInputGroup.style.cssText = 'margin-bottom: 20px; display: none;';

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
    sampleSelect.style.cssText = `
        width: 100%;
        padding: 10px 12px;
        border: 2px solid #ddd;
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

    const regexLabel2 = document.createElement('label');
    regexLabel2.textContent = 'Regex Pattern:';
    regexLabel2.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #555;
        font-size: 14px;
    `;

    const regexInput = document.createElement('textarea');
    regexInput.rows = 3;
    regexInput.style.cssText = `
        width: 100%;
        padding: 10px 12px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        font-family: monospace;
        resize: vertical;
        transition: border-color 0.2s;
    `;
    regexInput.onfocus = () => regexInput.style.borderColor = '#4a90d9';
    regexInput.onblur = () => regexInput.style.borderColor = '#ddd';

    const flagsLabel = document.createElement('label');
    flagsLabel.textContent = 'Flags:';
    flagsLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #555;
        font-size: 14px;
    `;

    const flagsInput = document.createElement('input');
    flagsInput.type = 'text';
    flagsInput.placeholder = 'i, m';
    flagsInput.style.cssText = `
        width: 100%;
        padding: 10px 12px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.2s;
    `;
    flagsInput.onfocus = () => flagsInput.style.borderColor = '#4a90d9';
    flagsInput.onblur = () => flagsInput.style.borderColor = '#ddd';

    regexInputGroup.appendChild(sampleField);
    regexInputGroup.appendChild(regexLabel2);
    regexInputGroup.appendChild(regexInput);
    regexInputGroup.appendChild(flagsLabel);
    regexInputGroup.appendChild(flagsInput);

    // Repeat count
    const repeatCountGroup = document.createElement('div');
    repeatCountGroup.style.cssText = 'margin-bottom: 20px;';

    const repeatCountLabel = document.createElement('label');
    repeatCountLabel.textContent = 'Repeats:';
    repeatCountLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #555;
        font-size: 14px;
    `;

    const repeatCountInput = document.createElement('input');
    repeatCountInput.type = 'number';
    repeatCountInput.value = '10';
    repeatCountInput.min = '1';
    repeatCountInput.max = '1000';
    repeatCountInput.style.cssText = `
        width: 100%;
        padding: 10px 12px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.2s;
    `;
    repeatCountInput.onfocus = () => repeatCountInput.style.borderColor = '#4a90d9';
    repeatCountInput.onblur = () => repeatCountInput.style.borderColor = '#ddd';

    repeatCountGroup.appendChild(repeatCountLabel);
    repeatCountGroup.appendChild(repeatCountInput);

    return {
        contentTypeField,
        repeatTextRadio,
        chrRadio,
        regexRadio,
        textInputGroup,
        chrInputGroup,
        regexInputGroup,
        textInput,
        chrInput,
        regexInput,
        flagsInput,
        sampleSelect,
        repeatCountInput,
        repeatCountGroup
    };
}

function createButtons() {
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
    okButton.textContent = 'OK';
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

function setupRepeatEventHandlers({
    overlay,
    popup,
    generateRadio,
    typeRadio,
    speedControls,
    minDelayField,
    maxDelayField,
    repeatTextRadio,
    chrRadio,
    regexRadio,
    textInputGroup,
    chrInputGroup,
    regexInputGroup,
    sampleSelect,
    regexInput,
    textInput,
    chrInput,
    flagsInput,
    repeatCountInput,
    cancelButton,
    okButton,
    title,
    resolve,
    reject
}) {
    function closePopup() {
        document.body.removeChild(overlay);
    }

    // Function to update UI based on selected mode
    function updateUIMode(mode) {
        if (mode === 'generate') {
            title.textContent = 'Generate Repeat';
            okButton.textContent = 'Generate';
            speedControls.style.display = 'none';
        } else if (mode === 'type') {
            title.textContent = 'Type Repeat';
            okButton.textContent = 'Start Typing';
            speedControls.style.display = 'block';
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

    repeatTextRadio.addEventListener('change', function() {
        if (this.checked) {
            textInputGroup.style.display = 'block';
            chrInputGroup.style.display = 'none';
            regexInputGroup.style.display = 'none';
        }
    });

    chrRadio.addEventListener('change', function() {
        if (this.checked) {
            textInputGroup.style.display = 'none';
            chrInputGroup.style.display = 'block';
            regexInputGroup.style.display = 'none';
        }
    });

    regexRadio.addEventListener('change', function() {
        if (this.checked) {
            textInputGroup.style.display = 'none';
            chrInputGroup.style.display = 'none';
            regexInputGroup.style.display = 'block';
        }
    });

    // Populate textarea when sample is selected
    sampleSelect.onchange = () => {
        regexInput.value = sampleSelect.value;
    };

    cancelButton.onclick = () => {
        closePopup();
        reject(null);
    };

    okButton.onclick = () => {
        const mode = generateRadio.checked ? 'generate' : 'type';
        const contentMode = repeatTextRadio.checked ? 'text' : (chrRadio.checked ? 'chr' : 'regex');
        const repeatCount = parseInt(repeatCountInput.value, 10);

        if (repeatCount < 1) {
            alert('Please enter a valid repeat count');
            return;
        }

        let result = { mode, contentMode, repeatCount };

        if (contentMode === 'text') {
            const text = textInput.value;
            if (!text) {
                alert('Please enter text');
                return;
            }
            result.text = text;
        } else if (contentMode === 'chr') {
            const chrCode = parseInt(chrInput.value, 10);
            if (isNaN(chrCode) || chrCode < 1 || chrCode > 65535) {
                alert('Please enter a valid Chr number (1-65535)');
                return;
            }
            result.chr = String.fromCharCode(chrCode);
        } else if (contentMode === 'regex') {
            const pattern = regexInput.value.trim();
            const flags = flagsInput.value.trim();
            if (!pattern) {
                alert('Please enter a regex pattern');
                return;
            }
            // Validate flags
            const validFlags = /^[im]*$/;
            if (!validFlags.test(flags)) {
                alert('Flags must contain only \'i\' and/or \'m\'');
                return;
            }
            result.pattern = pattern;
            result.flags = flags;
        }

        if (mode === 'type') {
            const minDelay = parseInt(minDelayField.value, 10);
            const maxDelay = parseInt(maxDelayField.value, 10);

            if (isNaN(minDelay) || minDelay < 10) {
                alert('Please enter a valid minimum delay (>= 10ms)');
                return;
            }

            if (isNaN(maxDelay) || maxDelay < 10) {
                alert('Please enter a valid maximum delay (>= 10ms)');
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