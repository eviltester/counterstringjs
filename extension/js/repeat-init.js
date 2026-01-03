var originalActiveElement = document.activeElement;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



(async function() {
    try {
        const originalActiveElement = document.activeElement;

        const config = await showRepeatDialog();

        if (!config) {
            return;
        }

        const activeElement = originalActiveElement;

        if (!activeElement) {
            throw new Error('No active element found');
        }

        if (config.mode === 'generate') {
            // Generate mode: instant value setting
            let repeatedContent = '';

            if (config.contentMode === 'text') {
                repeatedContent = config.text.repeat(config.repeatCount);
            } else if (config.contentMode === 'chr') {
                repeatedContent = config.chr.repeat(config.repeatCount);
            } else if (config.contentMode === 'regex') {
                try {
                    for (let i = 0; i < config.repeatCount; i++) {
                        const randomString = getRandomString(config.pattern, config.flags);
                        repeatedContent += randomString;
                    }
                } catch (error) {
                    alert('Error generating random strings: ' + error.message);
                    return;
                }
            }

            console.log(repeatedContent);

            // Create and dispatch input event to trigger form validation and event listeners
            const inputEvent = new InputEvent('input', {
                data: repeatedContent,
                inputType: 'insertText',
                bubbles: true,
                cancelable: true
            });
            activeElement.dispatchEvent(inputEvent);

            // Set the value
            try {
                activeElement.value = repeatedContent;
            } catch (error) {
                console.warn('Could not set repeat value due to invalid characters:', error.message);
                // Do not set the value
            }

        } else if (config.mode === 'type') {
            // Type mode: progressive character-by-character typing with speed control
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

            let contentToType = '';

            if (config.contentMode === 'text') {
                contentToType = config.text.repeat(config.repeatCount);
            } else if (config.contentMode === 'chr') {
                contentToType = config.chr.repeat(config.repeatCount);
            } else if (config.contentMode === 'regex') {
                try {
                    for (let i = 0; i < config.repeatCount; i++) {
                        const randomString = getRandomString(config.pattern, config.flags);
                        contentToType += randomString;
                    }
                } catch (error) {
                    alert('Error generating random strings: ' + error.message);
                    document.removeEventListener('keydown', escapeHandler);
                    return;
                }
            }

            for (let i = 0; i < contentToType.length; i++) {
                if (abortController.signal.aborted) break;

                const char = contentToType[i];
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

                try {
                    activeElement.value += char;
                } catch (error) {
                    console.warn('Could not append character due to invalid character:', char, error.message);
                    // Do not append the character
                }

                charCount++;
            }

            if (cancelled) {
                console.log(`Typing cancelled at ${charCount}/${contentToType.length} characters`);
            } else {
                console.log(`Typing completed at ${charCount}/${contentToType.length} characters`);
            }
        }
    } catch (err) {
        if (err !== null) {
            console.error('Error with repeat:', err);
        }
    }
})();