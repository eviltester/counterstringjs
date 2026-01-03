async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



(async function() {
    try {
        const originalActiveElement = document.activeElement;

        const config = await showRangeDialog({
            title: 'Range',
            buttonText: 'OK',
            showDelay: true
        });

        if (!config) {
            return;
        }

        const activeElement = originalActiveElement;

        if (!activeElement) {
            throw new Error('No active element found');
        }

        if (config.mode === 'generate') {
            // Generate mode: instant value setting
            const rangeString = getRangeString(config.start, config.end);

            console.log(rangeString);

            // Create and dispatch input event to trigger form validation and event listeners
            const inputEvent = new InputEvent('input', {
                data: rangeString,
                inputType: 'insertText',
                bubbles: true,
                cancelable: true
            });
            activeElement.dispatchEvent(inputEvent);

            // Set the value
            activeElement.value = rangeString;

        } else if (config.mode === 'type') {
            // Type mode: progressive character-by-character typing
            const abortController = new AbortController();
            let cancelled = false;
            let charCount = 0;

            function escapeHandler(e) {
                if (e.key === 'Escape') {
                    abortController.abort();
                    cancelled = true;
                    document.removeEventListener('keydown', escapeHandler);
                }
            }

            document.addEventListener('keydown', escapeHandler);

            activeElement.focus();

            for (let code = config.start; code <= config.end; code++) {
                if (abortController.signal.aborted) break;

                const char = String.fromCharCode(code);
                const charCode = char.charCodeAt(0);

                const keydownEvent = new KeyboardEvent('keydown', {
                    key: char,
                    code: getCodeForChar(char),
                    keyCode: charCode,
                    which: charCode,
                    bubbles: true
                });
                activeElement.dispatchEvent(keydownEvent);

                const delay = Math.random() * (config.maxDelay - config.minDelay) + config.minDelay;
                await sleep(delay);

                const keyupEvent = new KeyboardEvent('keyup', {
                    key: char,
                    code: getCodeForChar(char),
                    keyCode: charCode,
                    which: charCode,
                    bubbles: true
                });
                activeElement.dispatchEvent(keyupEvent);

                const inputEvent = new InputEvent('input', {
                    data: char,
                    inputType: 'insertText',
                    bubbles: true,
                    cancelable: true
                });
                activeElement.dispatchEvent(inputEvent);

                activeElement.value += char;

                charCount++;
            }

            if (cancelled) {
                console.log(`Typing cancelled at ${charCount}/${config.end - config.start + 1} characters`);
            } else {
                console.log(`Typing completed at ${charCount}/${config.end - config.start + 1} characters`);
            }
        }
    } catch (err) {
        if (err !== null) {
            console.error('Error with range:', err);
        }
    }
})();