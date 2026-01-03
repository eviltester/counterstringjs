async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



(async function() {
    try {
        const originalActiveElement = document.activeElement;

        const config = await showRangeDialog({
            title: 'Type Range',
            buttonText: 'Type',
            showDelay: true
        });

        if (!config) {
            return;
        }

        const start = config.start;
        const end = config.end;
        const minDelay = config.minDelay;
        const maxDelay = config.maxDelay;

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

        activeElement.focus();

        let charCount = 0;

        for (let code = start; code <= end; code++) {
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
            console.log(`Typing cancelled at ${charCount}/${end - start + 1} characters`);
        } else {
            console.log(`Typing completed at ${charCount}/${end - start + 1} characters`);
        }
    } catch (err) {
        if (err !== null) {
            console.error('Error while typing range:', err);
        }
    }
})();