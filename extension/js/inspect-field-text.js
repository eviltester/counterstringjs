(() => {
    let field = document.activeElement;
    while (field?.shadowRoot?.activeElement) {
        field = field.shadowRoot.activeElement;
    }

    let text;
    let maxLength;
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        text = field.value;
        maxLength = field.maxLength;
    } else if (field?.isContentEditable) {
        text = field.innerText;
    }

    const dialog = document.createElement('dialog');
    dialog.setAttribute('aria-label', 'Inspect Field Text');
    dialog.style.cssText = `
        position: fixed;
        inset: 0;
        margin: auto;
        width: min(360px, calc(100% - 32px));
        box-sizing: border-box;
        padding: 24px;
        border: none;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        background: white;
        color: #333;
        font: 14px/1.5 system-ui, sans-serif;
    `;

    const heading = document.createElement('h2');
    heading.textContent = 'Inspect Field Text';
    heading.style.cssText = 'margin: 0 0 12px; color: inherit; font: 600 20px/1.3 system-ui, sans-serif;';

    const length = document.createElement('p');
    length.textContent = text === undefined
        ? 'Focus an editable text field and try again.'
        : `Length: ${text.length} (UTF-16 code units)`;
    dialog.append(heading, length);

    if (maxLength >= 0) {
        const limit = document.createElement('p');
        limit.textContent = `Declared maxlength: ${maxLength}`;
        dialog.append(limit);
    }

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => dialog.remove(), { once: true });

    dialog.append(closeButton);
    document.body.append(dialog);
    dialog.showModal();
})();
