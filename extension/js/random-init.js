async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



(async function() {
    try {
        const originalActiveElement = document.activeElement;

        const config = await showRandomDialog({
            title: 'Random',
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
            try {
                const randomString = getRandomString(config.pattern, config.flags);

                console.log(randomString);

                // Create and dispatch input event to trigger form validation and event listeners
                const inputEvent = new InputEvent('input', {
                    data: randomString,
                    inputType: 'insertText',
                    bubbles: true,
                    cancelable: true
                });
                activeElement.dispatchEvent(inputEvent);

                // Set the value
                activeElement.value = randomString;
            } catch (error) {
                alert('Error: ' + error.message);
            }

        } else if (config.mode === 'type') {
            // Type mode: progressive character-by-character typing
            try {
                // Generate the full random string upfront
                const randomString = getRandomString(config.pattern, config.flags);

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
                    console.log(`Typing cancelled at ${charCount}/${randomString.length} characters`);
                } else {
                    console.log(`Typing completed at ${charCount}/${randomString.length} characters`);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    } catch (err) {
        if (err !== null) {
            console.error('Error with random:', err);
        }
    }
})();