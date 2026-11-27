(() => {
    const hostId = 'counterstring-floating-dialog';
    if (document.getElementById(hostId)) return;
    const legacyDialogs = '#counterstring-popup-overlay, #range-popup-overlay, #random-popup-overlay, #repeat-dialog-overlay, #binary-chop-dialog-overlay';

    const create = createFloatingElement;
    const host = create('div', { id: hostId });
    const root = host.attachShadow({ mode: 'open' });
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(`
        :host {
            all: initial; position: fixed; display: block; z-index: 2147483647;
            top: 16px; right: 16px; width: min(346px, calc(100vw - 24px));
            color: #202a38; color-scheme: light; font: 14px/1.4 system-ui, sans-serif;
        }
        *, *::before, *::after { box-sizing: border-box; }
        [hidden] { display: none !important; }
        .dialog {
            max-height: calc(100vh - 32px); overflow: auto; overscroll-behavior: contain;
            border: 1px solid #cbd5e1; border-radius: 12px; background: #fff;
            box-shadow: 0 12px 32px #13243b2a;
        }
        header {
            display: flex; justify-content: space-between; align-items: center; gap: 12px;
            position: sticky; top: 0; z-index: 1; padding: 10px 12px 10px 16px;
            border-bottom: 1px solid #dce4ef; background: #f0f5fc;
            cursor: move; user-select: none; touch-action: none;
        }
        h2 { margin: 0; font-size: 16px; font-weight: 670; }
        .body { display: grid; gap: 12px; padding: 14px 16px 16px; }
        .settings, label { display: grid; gap: 5px; }
        .settings { gap: 10px; }
        label { min-width: 0; font-weight: 550; }
        .two-columns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        input, textarea, select, button { font: inherit; color: inherit; }
        input:not([type=checkbox]), textarea, select {
            width: 100%; min-height: 34px; padding: 6px 8px; border: 1px solid #bdc9d8;
            border-radius: 6px; background-color: #fff; font-weight: 400;
        }
        textarea { resize: vertical; }
        .output { font: 12px/1.45 ui-monospace, Consolas, monospace; }
        .checkbox { display: flex; align-items: center; gap: 7px; font-weight: 400; }
        .checkbox input { margin: 0; }
        .target {
            display: grid; gap: 3px; min-width: 0; padding: 8px 10px;
            border: 1px solid #dce4ef; border-radius: 6px; background: #f6f8fc;
        }
        .target span, .target small, summary { color: #46566d; font-size: 12px; font-weight: 600; }
        .target code { overflow-wrap: anywhere; font: 13px/1.4 ui-monospace, Consolas, monospace; }
        .target small:empty, .status:empty { display: none; }
        summary { cursor: pointer; }
        details .two-columns { margin-top: 7px; }
        .actions { display: flex; flex-wrap: wrap; gap: 7px; }
        button {
            min-height: 34px; padding: 5px 10px; border: 1px solid #bdc9d8;
            border-radius: 6px; background: #fff; font-weight: 600; cursor: pointer;
        }
        button:hover:not(:disabled) { background: #edf3fb; }
        .primary { background: #2457a6; border-color: #2457a6; color: #fff; }
        .primary:hover:not(:disabled) { background: #194686; }
        button:disabled { opacity: .55; cursor: default; }
        .close { min-height: 29px; padding: 0 8px; font-size: 19px; line-height: 1; }
        :focus-visible { outline: 2px solid #2457a6; outline-offset: 2px; }
        .inspection, .status { margin: 0; }
        .status { color: #344866; font-size: 13px; }
    `);
    root.adoptedStyleSheets = [stylesheet];

    const lifetime = new AbortController();
    const signal = lifetime.signal;
    let activeElement = document.activeElement;
    while (activeElement?.shadowRoot?.activeElement) {
        activeElement = activeElement.shadowRoot.activeElement;
    }
    let field = activeElement?.closest(legacyDialogs) ? null : getFloatingField(activeElement);
    let typing;
    let feedbackVersion = 0;

    const initialLength = field?.maxLength > 0 ? Math.min(field.maxLength, 1000000) : 100;
    const tools = createFloatingTools(initialLength);
    const toolSelect = createFloatingSelect('Tool', Object.entries(tools).map(([id, tool]) => [id, tool.label]));
    const targetSelector = create('code');
    targetSelector.setAttribute('aria-live', 'polite');
    const targetDetails = create('small');
    const target = create('div', { className: 'target' }, create('span', { textContent: 'Target field' }), targetSelector, targetDetails);

    const closeButton = create('button', { type: 'button', className: 'close', textContent: '×' });
    closeButton.setAttribute('aria-label', 'Close Floating Dialog');
    const header = create('header', {}, create('h2', { id: 'floating-title', textContent: 'CounterString' }), closeButton);
    const minDelay = floatingNumber('Min delay (ms)', 50, 0, 5000);
    const maxDelay = floatingNumber('Max delay (ms)', 150, 0, 5000);
    const typingSettings = create('details', {}, create('summary', { textContent: 'Typing options' }),
        create('div', { className: 'two-columns' }, labelFloatingControl(minDelay), labelFloatingControl(maxDelay)));

    const generate = create('button', { type: 'button', className: 'primary', textContent: 'Generate' });
    const type = create('button', { type: 'button', textContent: 'Type' });
    const copy = create('button', { type: 'button', textContent: 'Copy' });
    const actions = create('div', { className: 'actions' }, generate, type, copy);
    const status = create('p', { className: 'status' });
    status.setAttribute('role', 'status');
    const clipboardText = create('textarea', { name: 'Text to copy', rows: 3, readOnly: true, className: 'output' });
    const clipboardFallback = labelFloatingControl(clipboardText);
    clipboardFallback.hidden = true;

    const body = create('div', { className: 'body' }, target, labelFloatingControl(toolSelect),
        ...Object.values(tools).map(tool => tool.controls), typingSettings, actions, status, clipboardFallback);
    const dialog = create('section', { className: 'dialog' }, header, body);
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'floating-title');
    root.append(dialog);

    function updateInspection() {
        tools.inspect.inspection.textContent = field
            ? `Length: ${getFloatingFieldValue(field).length} (UTF-16 code units)`
            : 'Click or Tab into an editable field to inspect it.';
    }

    function updateTarget() {
        const selector = field && getFloatingFieldSelector(field);
        targetSelector.textContent = selector || 'No field selected';
        const details = [];
        if (field?.maxLength >= 0) details.push(`maxlength ${field.maxLength}`);
        if (field?.getRootNode() instanceof ShadowRoot) details.push('Shadow root');
        targetDetails.textContent = details.join(' · ');
        if (toolSelect.value === 'inspect') updateInspection();
    }

    function updateActions() {
        const tool = tools[toolSelect.value];
        actions.hidden = Boolean(tool.inspection);
        typingSettings.hidden = Boolean(tool.report || tool.inspection);
        type.hidden = typingSettings.hidden;
        type.textContent = typing ? 'Stop typing' : 'Type';
        type.disabled = !typing && !field;
        generate.disabled = Boolean(typing || (!tool.report && !field));
        copy.textContent = tool.report ? 'Copy report' : 'Copy';
        copy.disabled = Boolean(typing || (tool.report && !tool.report.value));
        toolSelect.disabled = Boolean(typing);
    }

    function clearFeedback() {
        feedbackVersion++;
        status.textContent = '';
        clipboardFallback.hidden = true;
    }

    function selectTool() {
        for (const [id, tool] of Object.entries(tools)) {
            tool.controls.hidden = id !== toolSelect.value;
        }
        clearFeedback();
        if (toolSelect.value === 'inspect') updateInspection();
        updateActions();
    }

    function selectField(nextField) {
        if (field === nextField) return;
        field = nextField;
        updateTarget();
        updateActions();
    }

    function trackField(event) {
        const path = event.composedPath();
        if (path.includes(host) || path.some(node => node.matches?.(legacyDialogs))) return;
        const nextField = getFloatingField(path[0]);
        if (nextField) selectField(nextField);
    }

    async function copyText(text) {
        const version = feedbackVersion;
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            if (signal.aborted || version !== feedbackVersion) return;
            clipboardText.value = text;
            clipboardFallback.hidden = false;
            clipboardText.focus();
            clipboardText.select();
            if (!document.execCommand('copy')) {
                status.textContent = 'Press Ctrl+C or Command+C to copy the selected text.';
                return;
            }
            clipboardFallback.hidden = true;
            copy.focus();
        }
        if (version === feedbackVersion) status.textContent = 'Copied to clipboard.';
    }

    async function run(action) {
        if (typing) {
            if (action === 'type') typing.abort();
            return;
        }

        clearFeedback();
        const tool = tools[toolSelect.value];
        const destination = field;
        try {
            if (action === 'copy') {
                await copyText(tool.report ? tool.report.value : tool.getText());
                return;
            }
            if (tool.report) {
                tool.report.value = tool.getText();
                updateActions();
                return;
            }
            if (!destination?.isConnected || !getFloatingField(destination)) {
                selectField(null);
                throw new Error('Select an editable field on the page.');
            }

            const text = tool.getText();
            if (action === 'generate') {
                generateIntoFloatingField(destination, text, tool.shouldNotify?.() ?? true);
                status.textContent = `Generated ${text.length} code units.`;
                return;
            }

            const minimum = readFloatingNumber(minDelay);
            const maximum = readFloatingNumber(maxDelay);
            if (minimum > maximum) throw new Error('Min delay must be less than or equal to max delay.');
            typing = new AbortController();
            updateActions();
            status.textContent = `Typing into ${targetSelector.textContent}…`;
            try {
                const count = await typeIntoFloatingField(destination, text, minimum, maximum, typing.signal);
                status.textContent = typing.signal.aborted || count < text.length
                    ? `Typing stopped after ${count} code units.`
                    : `Typed ${count} code units.`;
            } finally {
                typing = undefined;
                updateActions();
            }
        } catch (error) {
            status.textContent = error.message;
        }
    }

    function positionAt(left, top) {
        const maxLeft = Math.max(0, window.innerWidth - host.offsetWidth);
        const maxTop = Math.max(0, window.innerHeight - host.offsetHeight);
        host.style.left = `${Math.min(maxLeft, Math.max(0, left))}px`;
        host.style.top = `${Math.min(maxTop, Math.max(0, top))}px`;
        host.style.right = 'auto';
    }

    let drag;
    header.addEventListener('pointerdown', event => {
        if (event.button !== 0 || event.target === closeButton) return;
        const { left, top } = host.getBoundingClientRect();
        drag = { pointer: event.pointerId, x: event.clientX - left, y: event.clientY - top };
        header.setPointerCapture(event.pointerId);
        event.preventDefault();
    });
    header.addEventListener('pointermove', event => {
        if (drag?.pointer === event.pointerId) positionAt(event.clientX - drag.x, event.clientY - drag.y);
    });
    header.addEventListener('lostpointercapture', () => { drag = null; });
    function keepVisible() {
        if (host.style.left) positionAt(host.offsetLeft, host.offsetTop);
    }
    window.addEventListener('resize', keepVisible, { signal });
    const resizeObserver = new ResizeObserver(keepVisible);

    const observer = new MutationObserver(() => {
        if (!host.isConnected) close();
        if (field && !field.isConnected) selectField(null);
    });
    function close() {
        observer.disconnect();
        resizeObserver.disconnect();
        lifetime.abort();
        typing?.abort();
        host.remove();
    }

    closeButton.addEventListener('click', close);
    toolSelect.addEventListener('change', selectTool);
    generate.addEventListener('click', () => run('generate'));
    type.addEventListener('click', () => run('type'));
    copy.addEventListener('click', () => run('copy'));
    document.addEventListener('focusin', trackField, { capture: true, signal });
    document.addEventListener('pointerdown', trackField, { capture: true, signal });
    document.addEventListener('input', event => {
        if (toolSelect.value === 'inspect' && getFloatingField(event.composedPath()[0]) === field) updateInspection();
    }, { capture: true, signal });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && typing) typing.abort();
    }, { capture: true, signal });

    updateTarget();
    selectTool();
    document.body.append(host);
    observer.observe(document, { childList: true, subtree: true });
    resizeObserver.observe(host);
})();
