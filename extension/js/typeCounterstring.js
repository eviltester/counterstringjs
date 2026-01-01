async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCodeForChar(char) {
    if (char === ' ') {
        return 'Space';
    } else if (char === '!') {
        return 'Digit1';
    } else if (char === '"') {
        return 'Quote';
    } else if (char === '#') {
        return 'Digit3';
    } else if (char === '$') {
        return 'Digit4';
    } else if (char === '%') {
        return 'Digit5';
    } else if (char === '&') {
        return 'Digit6';
    } else if (char === '\'') {
        return 'Quote';
    } else if (char === '(') {
        return 'Digit9';
    } else if (char === ')') {
        return 'Digit0';
    } else if (char === '*') {
        return 'Digit8';
    } else if (char === '+') {
        return 'Equal';
    } else if (char === ',') {
        return 'Comma';
    } else if (char === '-') {
        return 'Minus';
    } else if (char === '.') {
        return 'Period';
    } else if (char === '/') {
        return 'Slash';
    } else if (char === ':') {
        return 'Semicolon';
    } else if (char === ';') {
        return 'Semicolon';
    } else if (char === '<') {
        return 'Comma';
    } else if (char === '=') {
        return 'Equal';
    } else if (char === '>') {
        return 'Period';
    } else if (char === '?') {
        return 'Slash';
    } else if (char === '@') {
        return 'Digit2';
    } else if (char === '[') {
        return 'BracketLeft';
    } else if (char === ']') {
        return 'BracketRight';
    } else if (char === '^') {
        return 'Digit6';
    } else if (char === '_') {
        return 'Minus';
    } else if (char === '`') {
        return 'Backquote';
    } else if (char === '{') {
        return 'BracketLeft';
    } else if (char === '|') {
        return 'Backslash';
    } else if (char === '}') {
        return 'BracketRight';
    } else if (char === '~') {
        return 'Backquote';
    } else if (char >= '0' && char <= '9') {
        return 'Digit' + char;
    } else if (char >= 'a' && char <= 'z') {
        return 'Key' + char.toUpperCase();
    } else if (char >= 'A' && char <= 'Z') {
        return 'Key' + char.toUpperCase();
    } else {
        return 'Space';
    }
}

(async function() {
    try {
        const originalActiveElement = document.activeElement;
        
        const config = await showCounterstringDialog({
            title: 'Type Counterstring',
            buttonText: 'Start Typing',
            showDelay: true
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
        console.error('Error while typing counterstring:', err);
    }
})();
