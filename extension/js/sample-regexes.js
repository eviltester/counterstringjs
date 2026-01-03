// Sample regexes for test data generation
if (typeof sampleRegexes === 'undefined') {
    var sampleRegexes = [
    { name: 'Select a sample...', regex: '' },
    { name: 'Email', regex: '[a-z0-9._+-]{1,20}@[a-z0-9]{3,15}\\.[a-z]{2,4}' },
    { name: 'Phone Number (US)', regex: '\\d{3}-\\d{3}-\\d{4}' },
    { name: 'URL', regex: 'https?://[a-z0-9]{3,15}\\.[a-z]{2,4}' },
    { name: 'Credit Card', regex: '\\d{4} \\d{4} \\d{4} \\d{4}' },
    { name: 'SSN', regex: '\\d{3}-\\d{2}-\\d{4}' },
    { name: 'ZIP Code', regex: '\\d{5}(-\\d{4})?' },
    { name: 'Full Name', regex: '[A-Z][a-z]{1,10} [A-Z][a-z]{1,10}' },
    { name: 'Address', regex: '\\d+ [A-Z][a-z]{1,10} [A-Z][a-z]{1,10}' },
    { name: 'City', regex: '[A-Z][a-z]{1,10}' },
    { name: 'State (US)', regex: '[A-Z]{2}' },
    { name: 'Username', regex: '[a-z0-9_]{3,15}' },
    { name: 'Password', regex: '[a-zA-Z0-9!@#$%^&*]{8,20}' },
    { name: 'GUID', regex: '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}' },
    { name: 'IP Address', regex: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
    { name: 'Hex Color', regex: '#[a-f0-9]{6}' },
    { name: 'Binary (8-bit)', regex: '[01]{8}' },
    { name: 'Octal (3-digit)', regex: '[0-7]{3}' },
    { name: 'Hex Number', regex: '0x[a-f0-9]{4}' },
    { name: 'Float', regex: '\\d+\\.\\d{2}' },
    { name: 'Integer', regex: '\\d{1,5}' },
    { name: 'Alphanumeric', regex: '[a-zA-Z0-9]{5,10}' },
    { name: 'Lowercase Letters', regex: '[a-z]{5,10}' },
    { name: 'Uppercase Letters', regex: '[A-Z]{5,10}' },
    { name: 'Mixed Case Letters', regex: '[a-zA-Z]{5,10}' },
    { name: 'Sentence', regex: '([A-Z][a-z]{4,15} ){5,20}' },
    { name: 'Lorem Ipsum Phrase', regex: '(Lorem ipsum dolor sit amet, consectetur adipiscing elit\\. ){1,3}' }
    ];
}