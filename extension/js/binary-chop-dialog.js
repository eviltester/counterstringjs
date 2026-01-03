function showBinaryChopDialog() {
    return new Promise((resolve, reject) => {
        let onGenerate = null;
        const overlay = document.createElement('div');
        overlay.id = 'binary-chop-dialog-overlay';
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
        popup.id = 'binary-chop-dialog-popup';
        popup.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            min-width: 450px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Binary Chop';
        title.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 20px;
            font-weight: 600;
            color: #333;
        `;

        const form = document.createElement('div');

        const startLabel = document.createElement('label');
        startLabel.textContent = 'Start:';
        startLabel.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #555;
            font-size: 14px;
        `;

        const startInput = document.createElement('input');
        startInput.type = 'number';
        startInput.id = 'binary-chop-start';
        startInput.value = '1024';
        startInput.min = '0';
        startInput.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
            margin-bottom: 15px;
        `;
        startInput.onfocus = () => startInput.style.borderColor = '#4a90d9';
        startInput.onblur = () => startInput.style.borderColor = '#ddd';

        form.appendChild(startLabel);
        form.appendChild(startInput);

        const endLabel = document.createElement('label');
        endLabel.textContent = 'End:';
        endLabel.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #555;
            font-size: 14px;
        `;

        const endInput = document.createElement('input');
        endInput.type = 'number';
        endInput.id = 'binary-chop-end';
        endInput.value = '2048';
        endInput.min = '0';
        endInput.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
            margin-bottom: 15px;
        `;
        endInput.onfocus = () => endInput.style.borderColor = '#4a90d9';
        endInput.onblur = () => endInput.style.borderColor = '#ddd';

        form.appendChild(endLabel);
        form.appendChild(endInput);

        const buttons = document.createElement('div');
        buttons.style.cssText = `
            display: flex;
            gap: 12px;
            margin-top: 10px;
            margin-bottom: 20px;
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
        buttons.appendChild(generateButton);

        const resultsLabel = document.createElement('label');
        resultsLabel.textContent = 'Results:';
        resultsLabel.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #555;
            font-size: 14px;
        `;

        const resultsTextarea = document.createElement('textarea');
        resultsTextarea.id = 'binary-chop-results';
        resultsTextarea.readOnly = true;
        resultsTextarea.rows = 15;
        resultsTextarea.style.cssText = `
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 12px;
            font-family: 'Courier New', monospace;
            box-sizing: border-box;
            background: #f9f9f9;
            resize: vertical;
        `;

        popup.appendChild(title);
        popup.appendChild(form);
        popup.appendChild(buttons);
        popup.appendChild(resultsLabel);
        popup.appendChild(resultsTextarea);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        function closePopup() {
            document.body.removeChild(overlay);
        }

        cancelButton.onclick = () => {
            closePopup();
            reject(null);
        };

        generateButton.onclick = () => {
            const start = parseInt(startInput.value, 10);
            const end = parseInt(endInput.value, 10);
            
            if (isNaN(start) || isNaN(end)) {
                alert('Please enter valid start and end values');
                return;
            }
            
            if (start < 0 || end < 0) {
                alert('Start and end must be non-negative integers');
                return;
            }
            
            if (start > end) {
                alert('End must be greater than or equal to start');
                return;
            }
            
            if (onGenerate) {
                onGenerate({ start, end, resultsTextarea });
            }
        };

        resolve({
            setOnGenerate: (callback) => {
                onGenerate = callback;
            },
            closePopup: () => {
                closePopup();
                resolve(null);
            }
        });

        startInput.focus();
    });
}
