async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



(async function() {
    try {
        const originalActiveElement = document.activeElement;
        
        const config = await showCounterstringDialog({
            title: 'Type Counterstring',
            buttonText: 'Start Typing',
            showDelay: true,
            showTriggerInputEvents: false
        });
        
        if (!config) {
            return;
        }

        const length = config ? config.length : null;
        const minDelay = config ? config.minDelay : null;
        const maxDelay = config ? config.maxDelay : null;
        const delimiter = config ? config.delimiter : '*';
        
        if (!length || isNaN(length) || length <= 0) {
            throw new Error('Invalid length: ' + length);
        }
        
        const activeElement = originalActiveElement;
        
        if (!activeElement) {
            throw new Error('No active element found');
        }

        const abortController = new AbortController();
        let cancelled = false;

        function escapeHandler(e) {
            if (e.key === 'Escape') {
                abortController.abort();
                cancelled = true;
                document.removeEventListener('keydown', escapeHandler);
            }
        }

        document.addEventListener('keydown', escapeHandler);

        var schema = generateSchemaForCounterString(length, delimiter);

        var charCount = 0;
        let currentResult = 0;

        activeElement.focus();

        var charSegments = [];
        incrementalForwardCounterString(schema, function(segment) {
            charSegments.push(segment);
            return !abortController.signal.aborted;
        }, abortController.signal, delimiter);

        for (const segment of charSegments) {
            if (abortController.signal.aborted) break;

            for (let i = 0; i < segment.length; i++) {
                if (abortController.signal.aborted) {
                    currentResult = charCount;
                    break;
                }

                const char = segment[i];
                const charCode = char.charCodeAt(0);

                const keydownEvent = new KeyboardEvent('keydown', {
                    key: char,
                    code: getCodeForChar(char),
                    keyCode: charCode,
                    which: charCode,
                    bubbles: true
                });
                activeElement.dispatchEvent(keydownEvent);

                const delay = Math.random() * (maxDelay - minDelay) + minDelay;
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

            if (abortController.signal.aborted) {
                break;
            }
        }

        currentResult = charCount;

        if (cancelled) {
            console.log(`Typing cancelled at ${currentResult}/${length} characters`);
        } else {
            console.log(`Typing completed at ${currentResult}/${length} characters`);
        }
    } catch (err) {
        if (err !== null) {
            console.error('Error while typing counterstring:', err);
        }
    }
})();
