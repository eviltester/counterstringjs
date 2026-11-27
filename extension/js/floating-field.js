/* exported getFloatingField, getFloatingFieldValue, getFloatingFieldSelector, generateIntoFloatingField, typeIntoFloatingField */
function getFloatingField(element) {
    if (element instanceof HTMLInputElement && !['text', 'search', 'tel', 'url', 'email', 'password', 'number'].includes(element.type)) {
        return null;
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        return element.readOnly || element.matches(':disabled') ? null : element;
    }

    if (element?.isContentEditable) {
        while (element.parentElement?.isContentEditable) {
            element = element.parentElement;
        }
        return element;
    }

    return null;
}

function getFloatingFieldValue(field) {
    return field.isContentEditable ? field.innerText : field.value;
}

function getFloatingFieldSelector(field) {
    const root = field.getRootNode();
    let suffix = '';

    for (let element = field; element; element = element.parentElement) {
        const tag = CSS.escape(element.localName);
        const id = element.id ? `#${CSS.escape(element.id)}` : null;
        const candidates = [tag, ...Array.from(element.classList, name => `.${CSS.escape(name)}`)];

        for (const attribute of ['name', 'data-testid', 'type', 'aria-label']) {
            const value = element.getAttribute(attribute);
            if (value) {
                const selector = `[${attribute}="${CSS.escape(value)}"]`;
                candidates.push(selector, tag + selector);
            }
        }
        if (element.hasAttribute('contenteditable')) candidates.push('[contenteditable]');

        candidates.sort((a, b) => a.length - b.length);
        if (id) candidates.unshift(id);

        for (const candidate of candidates) {
            const selector = candidate + suffix;
            const matches = root.querySelectorAll(selector);
            if (matches.length === 1 && matches[0] === field) return selector;
        }

        const siblings = Array.from(element.parentNode.children);
        const sameTag = siblings.filter(sibling => sibling.localName === element.localName);
        const siblingSelector = candidates.find(candidate => siblings.filter(sibling => sibling.matches(candidate)).length === 1)
            ?? `${tag}:nth-of-type(${sameTag.indexOf(element) + 1})`;

        if (!element.parentElement) {
            // A shadow root can contain several top-level elements with identical descendants.
            return `${siblingSelector}:not(* > *)${suffix}`;
        }
        suffix = ` > ${siblingSelector}${suffix}`;
    }
}

function setFloatingFieldText(field, text, append) {
    if (field.isContentEditable) {
        if (append) {
            field.append(text === '\n' ? document.createElement('br') : document.createTextNode(text));
        } else {
            field.innerText = text;
        }
    } else {
        const prototype = field instanceof HTMLInputElement ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
        setter.call(field, append ? field.value + text : text);
    }
}

function notifyFloatingFieldInput(field, text) {
    field.dispatchEvent(new InputEvent('input', {
        bubbles: true, composed: true, inputType: 'insertText', data: text
    }));
}

function generateIntoFloatingField(field, text, notify) {
    setFloatingFieldText(field, text, false);
    if (notify) notifyFloatingFieldInput(field, text);
}

async function typeIntoFloatingField(field, text, minDelay, maxDelay, signal) {
    let typed = 0;
    field.focus();

    for (const character of text) {
        if (signal.aborted || !field.isConnected || !getFloatingField(field)) break;

        const keyCode = character.charCodeAt(0);
        const options = { key: character, code: getCodeForChar(character), keyCode, which: keyCode, bubbles: true, composed: true };
        field.dispatchEvent(new KeyboardEvent('keydown', options));
        if (signal.aborted) break;

        await new Promise(resolve => {
            function finishDelay() {
                clearTimeout(timer);
                signal.removeEventListener('abort', finishDelay);
                resolve();
            }
            const timer = setTimeout(finishDelay, minDelay + Math.random() * (maxDelay - minDelay));
            signal.addEventListener('abort', finishDelay, { once: true });
        });

        if (signal.aborted || !field.isConnected || !getFloatingField(field)) break;

        setFloatingFieldText(field, character, true);
        notifyFloatingFieldInput(field, character);
        field.dispatchEvent(new KeyboardEvent('keyup', options));
        typed += character.length;
    }
    return typed;
}
