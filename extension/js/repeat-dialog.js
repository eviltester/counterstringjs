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

        radioGroup.appendChild(repeatTextLabel);
        radioGroup.appendChild(chrLabel);
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
            } else {
                textInputGroup.style.display = 'none';
                chrInputGroup.style.display = 'block';
            }
        });

        chrRadio.addEventListener('change', function() {
            if (this.checked) {
                textInputGroup.style.display = 'none';
                chrInputGroup.style.display = 'block';
            } else {
                textInputGroup.style.display = 'block';
                chrInputGroup.style.display = 'none';
            }
        });

        cancelButton.onclick = () => {
            closePopup();
            reject(null);
        };

        typeButton.onclick = () => {
            const mode = repeatTextRadio.checked ? 'text' : 'chr';
            const repeatCount = parseInt(repeatCountInput.value, 10);
            
            if (mode === 'text') {
                const text = textInput.value;
                if (!text || repeatCount < 1) {
                    alert('Please enter text and a valid repeat count');
                    return;
                }
                closePopup();
                resolve({ action: 'type', mode, text, repeatCount });
            } else {
                const chrCode = parseInt(chrInput.value, 10);
                if (isNaN(chrCode) || repeatCount < 1) {
                    alert('Please enter a valid Chr number and repeat count');
                    return;
                }
                const chr = String.fromCharCode(chrCode);
                closePopup();
                resolve({ action: 'type', mode, chr, repeatCount });
            }
        };

        generateButton.onclick = () => {
            const mode = repeatTextRadio.checked ? 'text' : 'chr';
            const repeatCount = parseInt(repeatCountInput.value, 10);
            
            if (mode === 'text') {
                const text = textInput.value;
                if (!text || repeatCount < 1) {
                    alert('Please enter text and a valid repeat count');
                    return;
                }
                closePopup();
                resolve({ action: 'generate', mode, text, repeatCount });
            } else {
                const chrCode = parseInt(chrInput.value, 10);
                if (isNaN(chrCode) || repeatCount < 1) {
                    alert('Please enter a valid Chr number and repeat count');
                    return;
                }
                const chr = String.fromCharCode(chrCode);
                closePopup();
                resolve({ action: 'generate', mode, chr, repeatCount });
            }
        };

        textInput.focus();
    });
}
