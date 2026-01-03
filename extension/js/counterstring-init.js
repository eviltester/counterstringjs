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
            title: 'Counterstring',
            buttonText: 'OK',
            showDelay: true,
            showTriggerInputEvents: true
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
            const counterString = getCounterString(config.length, config.delimiter);

            if (config.triggerInputEvents) {
                // Create and dispatch input event to trigger form validation and event listeners
                const inputEvent = new InputEvent('input', {
                    data: counterString,
                    inputType: 'insertText',
                    bubbles: true,
                    cancelable: true
                });
                activeElement.dispatchEvent(inputEvent);
            }

            // Set the value
            activeElement.value = counterString;
            console.log(`Generated counterstring of length ${config.length} with delimiter "${config.delimiter}"`);

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

            const schema = generateSchemaForCounterString(config.length, config.delimiter);

            let charSegments = [];
            incrementalForwardCounterString(schema, function(segment) {
                charSegments.push(segment);
                return !abortController.signal.aborted;
            }, abortController.signal, config.delimiter);

            activeElement.focus();

            for (const segment of charSegments) {
                if (abortController.signal.aborted) break;

                for (let i = 0; i < segment.length; i++) {
                    if (abortController.signal.aborted) {
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

                if (abortController.signal.aborted) {
                    break;
                }
            }

            if (cancelled) {
                console.log(`Typing cancelled at ${charCount}/${config.length} characters`);
            } else {
                console.log(`Typing completed at ${charCount}/${config.length} characters`);
            }
        }
    } catch (err) {
        if (err !== null) {
            console.error('Error with counterstring:', err);
        }
    }
})();
