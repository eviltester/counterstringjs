var count = window.prompt("Counterstring Length?", "100");

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCodeForChar(char) {
    if (char === '*') {
        return 'Digit8';
    } else if (char >= '0' && char <= '9') {
        return 'Digit' + char;
    } else if (char >= 'a' && char <= 'z') {
        return 'Key' + char.toUpperCase();
    } else if (char >= 'A' && char <= 'Z') {
        return 'Key' + char.toUpperCase();
    }
    return 'Unknown';
}

(async function() {
    try{
        if (count === null || count === '') {
            console.log('Cancelled by user');
        } else {
            const length = parseInt(count, 10);
            
            if (isNaN(length) || length <= 0) {
                throw new Error('Please enter a valid positive number');
            }

            const activeElement = document.activeElement;
            
            if (!activeElement) {
                throw new Error('No active element found');
            }

            const abortController = new AbortController();
            let cancelled = false;

            function escapeHandler(e) {
                if (e.key === 'Escape') {
                    console.log('Counterstring typing cancelled');
                    abortController.abort();
                    cancelled = true;
                    document.removeEventListener('keydown', escapeHandler);
                }
            }

            document.addEventListener('keydown', escapeHandler);

            var schema = generateSchemaForCounterString(length);
            console.log('Schema generated for length', length);

            var charCount = 0;
            let currentResult = 0;

            activeElement.focus();

            var charSegments = [];
            incrementalForwardCounterString(schema, function(segment, position) {
                charSegments.push({segment, position});
                return !abortController.signal.aborted;
            }, abortController.signal);

            for (const {segment, position} of charSegments) {
                if (abortController.signal.aborted) break;

                for (let i = 0; i < segment.length; i++) {
                    if (abortController.signal.aborted) {
                        currentResult = charCount;
                        break;
                    }

                    const char = segment[i];
                    const charCode = char.charCodeAt(0);

                    console.log(`Typing char ${charCount + 1}/${length}: "${char}" at position ${position}`);

                    const keydownEvent = new KeyboardEvent('keydown', {
                        key: char,
                        code: getCodeForChar(char),
                        keyCode: charCode,
                        which: charCode,
                        bubbles: true
                    });
                    activeElement.dispatchEvent(keydownEvent);

                    const delay = Math.random() * 100 + 100;
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
        }
    } catch (err) {
        console.error('Error while typing counterstring:', err);
    }
})();
