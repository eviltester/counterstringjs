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

        const config = await showRandomDialog({
            title: 'Type Random',
            buttonText: 'Type',
            showDelay: true
        });

        if (!config) {
            return;
        }

        const pattern = config.pattern;
        const flags = config.flags;
        const minDelay = config.minDelay;
        const maxDelay = config.maxDelay;

        const activeElement = originalActiveElement;

        if (!activeElement) {
            throw new Error('No active element found');
        }

        // Generate the full random string upfront
        const randomString = getRandomString(pattern, flags);

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

        activeElement.focus();

        let charCount = 0;

        for (let i = 0; i < randomString.length; i++) {
            if (abortController.signal.aborted) break;

            const char = randomString[i];
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

        if (cancelled) {
            console.log(`Typing cancelled at ${charCount}/${randomString.length} characters`);
        } else {
            console.log(`Typing completed at ${charCount}/${randomString.length} characters`);
        }
    } catch (err) {
        if (err !== null) {
            alert('Error: ' + err.message);
        }
    }
})();