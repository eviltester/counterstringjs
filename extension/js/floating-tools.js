/* exported createFloatingElement, createFloatingSelect, labelFloatingControl, floatingNumber, readFloatingNumber, createFloatingTools */
function createFloatingElement(tag, properties = {}, ...children) {
    const element = Object.assign(document.createElement(tag), properties);
    element.append(...children);
    return element;
}

function createFloatingSelect(name, options) {
    const select = createFloatingElement('select', { name });
    for (const [value, label] of options) {
        select.add(new Option(label, value));
    }
    return select;
}

function labelFloatingControl(control) {
    return createFloatingElement('label', {}, createFloatingElement('span', { textContent: control.name }), control);
}

function floatingNumber(name, value, min, max) {
    return createFloatingElement('input', { name, type: 'number', value, min, max, required: true });
}

function readFloatingNumber(input) {
    if (!input.validity.valid || !Number.isSafeInteger(input.valueAsNumber)) {
        throw new Error(`${input.name} must be a whole number between ${input.min} and ${input.max}.`);
    }
    return input.valueAsNumber;
}

function createFloatingRegexSettings() {
    const sample = createFloatingSelect('Regex sample', sampleRegexes.map(({ regex, name }) => [regex, name]));
    const pattern = createFloatingElement('textarea', { name: 'Regex pattern', rows: 2 });
    const flags = createFloatingElement('input', { name: 'Regex flags', type: 'text', placeholder: 'i or m' });

    sample.addEventListener('change', () => {
        if (sample.value) pattern.value = sample.value;
    });
    pattern.addEventListener('input', () => { sample.value = ''; });

    return {
        controls: createFloatingElement('div', { className: 'settings' }, ...[sample, pattern, flags].map(labelFloatingControl)),
        values: () => ({ pattern: pattern.value.trim(), flags: flags.value.trim() })
    };
}

function createFloatingTools(initialLength) {
    const length = floatingNumber('Length', initialLength, 1, 1000000);
    const delimiter = createFloatingElement('input', { name: 'Delimiter', type: 'text', maxLength: 1, value: '*' });
    const triggerInput = createFloatingElement('input', { type: 'checkbox', checked: true });
    const counterstring = {
        label: 'Counterstring',
        controls: createFloatingElement('div', { className: 'settings' },
            createFloatingElement('div', { className: 'two-columns' }, labelFloatingControl(length), labelFloatingControl(delimiter)),
            createFloatingElement('label', { className: 'checkbox' }, triggerInput, 'Trigger input events on Generate')),
        getText: () => getCounterString(readFloatingNumber(length), delimiter.value),
        shouldNotify: () => triggerInput.checked
    };

    const regex = createFloatingRegexSettings();
    const random = {
        label: 'Random from Regex',
        controls: regex.controls,
        getText() {
            const { pattern, flags } = regex.values();
            return getRandomString(pattern, flags);
        }
    };

    const ranges = getRangePresets();
    const presetOptions = Object.keys(ranges).map(name => [name, name]);
    const preset = createFloatingSelect('Range preset', [['', 'Custom'], ...presetOptions]);
    const from = floatingNumber('Start Unicode', 13, 0, 65535);
    const to = floatingNumber('End Unicode', 32, 0, 65535);
    preset.addEventListener('change', () => {
        if (preset.value) [from.value, to.value] = ranges[preset.value];
    });
    for (const input of [from, to]) {
        input.addEventListener('input', () => { preset.value = ''; });
    }
    const range = {
        label: 'Character Range',
        controls: createFloatingElement('div', { className: 'settings' }, labelFloatingControl(preset),
            createFloatingElement('div', { className: 'two-columns' }, labelFloatingControl(from), labelFloatingControl(to))),
        getText: () => getRangeString(readFloatingNumber(from), readFloatingNumber(to))
    };

    const content = createFloatingSelect('Content type', [['text', 'Text'], ['chr', 'Character code'], ['regex', 'Regex']]);
    const repeats = floatingNumber('Repeats', 10, 1, 1000);
    const text = createFloatingElement('textarea', { name: 'Text', rows: 3 });
    const chr = floatingNumber('Character code', 65, 0, 65535);
    const repeatRegex = createFloatingRegexSettings();
    const contentSettings = { text: labelFloatingControl(text), chr: labelFloatingControl(chr), regex: repeatRegex.controls };
    function showRepeatContent() {
        for (const [mode, controls] of Object.entries(contentSettings)) {
            controls.hidden = mode !== content.value;
        }
    }
    content.addEventListener('change', showRepeatContent);
    showRepeatContent();
    const repeat = {
        label: 'Repeat Text / Chr',
        controls: createFloatingElement('div', { className: 'settings' }, labelFloatingControl(content),
            ...Object.values(contentSettings), labelFloatingControl(repeats)),
        getText() {
            const config = { contentMode: content.value, repeatCount: readFloatingNumber(repeats) };
            if (content.value === 'text') {
                if (text.value === '') throw new Error('Enter text to repeat.');
                config.text = text.value;
            } else if (content.value === 'chr') {
                config.chr = String.fromCharCode(readFloatingNumber(chr));
            } else {
                Object.assign(config, repeatRegex.values());
            }
            return getRepeatedText(config);
        }
    };

    const start = floatingNumber('Start', 1024, 0, Number.MAX_SAFE_INTEGER);
    const end = floatingNumber('End', 2048, 0, Number.MAX_SAFE_INTEGER);
    const bound = createFloatingSelect('Bound', [['upper', 'Upper'], ['lower', 'Lower']]);
    const report = createFloatingElement('textarea', { name: 'Binary Chop report', rows: 7, readOnly: true, className: 'output' });
    const binaryChop = {
        label: 'Binary Chop',
        controls: createFloatingElement('div', { className: 'settings' },
            createFloatingElement('div', { className: 'two-columns' }, labelFloatingControl(start), labelFloatingControl(end)),
            labelFloatingControl(bound), labelFloatingControl(report)),
        getText: () => getBinaryChopReport(readFloatingNumber(start), readFloatingNumber(end), bound.value).text,
        report
    };

    const inspection = createFloatingElement('p', { className: 'inspection' });
    const inspect = { label: 'Inspect Field Text', controls: inspection, inspection };
    return { counterstring, random, range, repeat, binaryChop, inspect };
}
