var originalActiveElement = document.activeElement;

(function() {
    var abortController = null;
    var cancelled = false;
    var charCount = 0;

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getCodeForChar(char) {
        if (char === ' ') {
            return 'Space';
        } else if (char === '!') {
            return 'Digit1';
        } else if (char === '*') {
            return 'Digit8';
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

    function escapeHandler(e) {
        if (e.key === 'Escape' && !e.repeat) {
            if (abortController) {
                abortController.abort();
                cancelled = true;
            }
            document.removeEventListener('keydown', escapeHandler);
        }
    }

    async function typeText(text, repeatCount) {
        for (let r = 0; r < repeatCount; r++) {
            for (let i = 0; i < text.length; i++) {
                if (abortController && abortController.signal.aborted) {
                    return false;
                }

                const char = text[i];
                const charCode = char.charCodeAt(0);

                const keydownEvent = new KeyboardEvent('keydown', {
                    key: char,
                    code: getCodeForChar(char),
                    keyCode: charCode,
                    which: charCode,
                    bubbles: true
                });
                document.activeElement.dispatchEvent(keydownEvent);

                const delay = Math.random() * 50 + 50;
                await sleep(delay);

                const keyupEvent = new KeyboardEvent('keyup', {
                    key: char,
                    code: getCodeForChar(char),
                    keyCode: charCode,
                    which: charCode,
                    bubbles: true
                });
                document.activeElement.dispatchEvent(keyupEvent);

                const inputEvent = new InputEvent('input', {
                    data: char,
                    inputType: 'insertText',
                    bubbles: true,
                    cancelable: true
                });
                document.activeElement.dispatchEvent(inputEvent);

                document.activeElement.value += char;

                charCount++;
            }
        }
        return true;
    }

    async function typeChr(chr, repeatCount) {
        const text = chr.repeat(parseInt(repeatCount, 10));
        return typeText(text, 1);
    }

    showRepeatDialog().then(function(result) {
        if (!result) {
            return;
        }

        const activeElement = originalActiveElement;
        
        if (!activeElement) {
            throw new Error('No active element found');
        }

        abortController = new AbortController();

        activeElement.focus();

        // Add escape handler only when we're about to start typing
        document.addEventListener('keydown', escapeHandler);

        if (result.action === 'type') {
            if (result.mode === 'text' && result.text) {
                typeText(result.text, result.repeatCount).then(function() {
                    if (cancelled) {
                        const totalChars = result.text.length * result.repeatCount;
                        console.log(`Typing cancelled at ${charCount}/${totalChars} characters`);
                    } else {
                        const totalChars = result.text.length * result.repeatCount;
                        console.log(`Typing completed at ${charCount}/${totalChars} characters`);
                    }
                    document.removeEventListener('keydown', escapeHandler);
                });
            } else if (result.mode === 'chr' && result.chr) {
                typeChr(result.chr, result.repeatCount).then(function() {
                    if (cancelled) {
                        console.log(`Typing cancelled at ${charCount}/${result.repeatCount} characters`);
                    } else {
                        console.log(`Typing completed at ${charCount}/${result.repeatCount} characters`);
                    }
                    document.removeEventListener('keydown', escapeHandler);
                });
            }
        } else if (result.action === 'generate') {
            if (result.mode === 'text' && result.text) {
                const repeatedText = result.text.repeat(result.repeatCount);
                activeElement.value = repeatedText;
                console.log(`Generated "${result.text}" repeated ${result.repeatCount} times: ${repeatedText}`);
                // log the text to allow copy pasting
                console.log(`${repeatedText}`);
            } else if (result.mode === 'chr' && result.chr) {
                const repeatedText = result.chr.repeat(result.repeatCount);
                activeElement.value = repeatedText;
                console.log(`Generated "${result.chr}" (code ${result.chrCode}) repeated ${result.repeatCount} times`);
            }
            document.removeEventListener('keydown', escapeHandler);
        }
    }).catch(function(err) {
        if (err !== null) {
            console.error('Error while repeating:', err);
        }
        document.removeEventListener('keydown', escapeHandler);
    });
})();