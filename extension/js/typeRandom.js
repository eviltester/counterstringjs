async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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