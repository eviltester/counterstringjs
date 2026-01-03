function showRepeatDialog() {
    return new Promise((resolve, reject) => {
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

        const popup = document.createElement('div');
        popup.id = 'repeat-dialog-popup';
        popup.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            min-width: 400px;
            max-width: 500px;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Repeat Text / Chr';
        title.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 20px;
            font-weight: 600;
            color: #333;
        `;

        const form = document.createElement('div');

        const radioGroup = document.createElement('div');
        radioGroup.style.cssText = 'margin-bottom: 15px;';

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
        repeatTextRadio.name = 'mode';
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
        chrRadio.name = 'mode';
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
        regexRadio.name = 'mode';
        regexRadio.style.cssText = 'margin-right: 8px;';

        const regexSpan = document.createElement('span');
        regexSpan.textContent = 'Regex';
        regexSpan.style.cssText = 'font-size: 14px;';

        regexLabel.appendChild(regexRadio);
        regexLabel.appendChild(regexSpan);

        radioGroup.appendChild(repeatTextLabel);
        radioGroup.appendChild(chrLabel);
        radioGroup.appendChild(regexLabel);
        form.appendChild(radioGroup);

        const textInputGroup = document.createElement('div');
        textInputGroup.id = 'repeat-text-input-group';

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
        textInput.id = 'repeat-text-input';
        textInput.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
        `;

        textInputGroup.appendChild(textLabel);
        textInputGroup.appendChild(textInput);
        form.appendChild(textInputGroup);

        const chrInputGroup = document.createElement('div');
        chrInputGroup.id = 'repeat-chr-input-group';
        chrInputGroup.style.display = 'none';

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
        chrInput.id = 'repeat-chr-input';
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
        `;

        chrInputGroup.appendChild(chrLabel2);
        chrInputGroup.appendChild(chrInput);
        form.appendChild(chrInputGroup);

        const regexInputGroup = document.createElement('div');
        regexInputGroup.id = 'repeat-regex-input-group';
        regexInputGroup.style.display = 'none';

        // Sample regex dropdown
        const sampleField = document.createElement('div');
        sampleField.style.cssText = 'margin-bottom: 15px;';

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
        sampleSelect.id = 'repeat-sample-regex';
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
        regexInputGroup.appendChild(sampleField);

        const regexPatternLabel = document.createElement('label');
        regexPatternLabel.textContent = 'Regex Pattern:';
        regexPatternLabel.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #555;
            font-size: 14px;
        `;

        const regexInput = document.createElement('textarea');
        regexInput.id = 'repeat-regex-input';
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
        `;

        regexInputGroup.appendChild(regexPatternLabel);
        regexInputGroup.appendChild(regexInput);

        const flagsLabel = document.createElement('label');
        flagsLabel.textContent = 'Flag (i or m):';
        flagsLabel.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #555;
            font-size: 14px;
        `;

        const flagsInput = document.createElement('input');
        flagsInput.type = 'text';
        flagsInput.id = 'repeat-flags-input';
        flagsInput.placeholder = 'i';
        flagsInput.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
        `;

        regexInputGroup.appendChild(flagsLabel);
        regexInputGroup.appendChild(flagsInput);

        // Populate textarea when sample is selected
        sampleSelect.onchange = () => {
            regexInput.value = sampleSelect.value;
        };

        form.appendChild(regexInputGroup);

        const repeatCountGroup = document.createElement('div');
        repeatCountGroup.id = 'repeat-count-group';

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
        repeatCountInput.id = 'repeat-count-input';
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
        `;

        repeatCountGroup.appendChild(repeatCountLabel);
        repeatCountGroup.appendChild(repeatCountInput);
        form.appendChild(repeatCountGroup);

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

        const typeButton = document.createElement('button');
        typeButton.textContent = 'Type';
        typeButton.style.cssText = `
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
        typeButton.onmouseover = () => typeButton.style.background = '#3a80c9';
        typeButton.onmouseout = () => typeButton.style.background = '#4a90d9';

        const generateButton = document.createElement('button');
        generateButton.textContent = 'Generate';
        generateButton.style.cssText = `
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
        generateButton.onmouseover = () => generateButton.style.background = '#3a80c9';
        generateButton.onmouseout = () => generateButton.style.background = '#4a90d9';

        buttons.appendChild(cancelButton);
        buttons.appendChild(typeButton);
        buttons.appendChild(generateButton);

        popup.appendChild(title);
        popup.appendChild(form);
        popup.appendChild(buttons);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        function closePopup() {
            document.body.removeChild(overlay);
        }

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

        cancelButton.onclick = () => {
            closePopup();
            reject(null);
        };

        typeButton.onclick = () => {
            const mode = repeatTextRadio.checked ? 'text' : (chrRadio.checked ? 'chr' : 'regex');
            const repeatCount = parseInt(repeatCountInput.value, 10);

            if (mode === 'text') {
                const text = textInput.value;
                if (!text || repeatCount < 1) {
                    alert('Please enter text and a valid repeat count');
                    return;
                }
                closePopup();
                resolve({ action: 'type', mode, text, repeatCount });
            } else if (mode === 'chr') {
                const chrCode = parseInt(chrInput.value, 10);
                if (isNaN(chrCode) || repeatCount < 1) {
                    alert('Please enter a valid Chr number and repeat count');
                    return;
                }
                const chr = String.fromCharCode(chrCode);
                closePopup();
                resolve({ action: 'type', mode, chr, repeatCount });
            } else if (mode === 'regex') {
                const pattern = regexInput.value.trim();
                const flags = flagsInput.value.trim();
                if (!pattern || repeatCount < 1) {
                    alert('Please enter a regex pattern and a valid repeat count');
                    return;
                }
                // Validate flags
                const validFlags = /^[im]*$/;
                if (!validFlags.test(flags)) {
                    alert('Flags must contain only \'i\' and/or \'m\'');
                    return;
                }
                closePopup();
                resolve({ action: 'type', mode, pattern, flags, repeatCount });
            }
        };

        generateButton.onclick = () => {
            const mode = repeatTextRadio.checked ? 'text' : (chrRadio.checked ? 'chr' : 'regex');
            const repeatCount = parseInt(repeatCountInput.value, 10);

            if (mode === 'text') {
                const text = textInput.value;
                if (!text || repeatCount < 1) {
                    alert('Please enter text and a valid repeat count');
                    return;
                }
                closePopup();
                resolve({ action: 'generate', mode, text, repeatCount });
            } else if (mode === 'chr') {
                const chrCode = parseInt(chrInput.value, 10);
                if (isNaN(chrCode) || repeatCount < 1) {
                    alert('Please enter a valid Chr number and repeat count');
                    return;
                }
                const chr = String.fromCharCode(chrCode);
                closePopup();
                resolve({ action: 'generate', mode, chr, repeatCount });
            } else if (mode === 'regex') {
                const pattern = regexInput.value.trim();
                const flags = flagsInput.value.trim();
                if (!pattern || repeatCount < 1) {
                    alert('Please enter a regex pattern and a valid repeat count');
                    return;
                }
                // Validate flags
                const validFlags = /^[im]*$/;
                if (!validFlags.test(flags)) {
                    alert('Flags must contain only \'i\' and/or \'m\'');
                    return;
                }
                closePopup();
                resolve({ action: 'generate', mode, pattern, flags, repeatCount });
            }
        };

        textInput.focus();
    });
}
