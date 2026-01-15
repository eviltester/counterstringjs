# CounterString JS

An Example of creating a CounterString tool in JavaScript.

Initially created as a "Snippet" run from chrome dev tools.

The source for this is in the `\snippets` directory.

Then the Snippet was converted into a simple Chrome Extension.

See the `extension` folder.

## Release

- Amend `manifest.json` version
- Amend `package.json` version
- `npm run build`

## Blog Posts & Videos

Description of writing the snippets version:

- [eviltester.com/blog/eviltester/2019-02-19-counterstring-snippets](https://www.eviltester.com/blog/eviltester/2019-02-19-counterstring-snippets/)
    - [youtu.be/l4D3MGg2iMI](https://youtu.be/l4D3MGg2iMI)
- YouTube Video showing creation of the Chrome Extension
    - [youtu.be/Olz4wo-ILwI](https://youtu.be/Olz4wo-ILwI)

## A Note on events

'copy to clipboard' generation allows you to paste the text into the field
this triggers the normal browser trusted events and all validation supported
by HTML fields and forms will take effect.

Typing and Generate both use JavaScript to trigger events and set values.
JavaScript events are 'synthetic' events which are also called 'untrusted'
events. So browsers do not do exactly the same behaviour with untrusted events.

Generate, sets the value of the field with JavaScript then fires synthetic
events to 'simulate' user input behaviour. These are not guaranteed to trigger all
browser behaviour on edit. If you require this after generating, just edit
one of the chars in the field to trigger any behaviour that JavaScript did
not trigger.

Typing triggers keydown, keyup and input events. This can trigger most javascript
methods that have been assigned as listeners to fields, but does not trigger all
the default browser input validation.

Generate and Typing are useful ways of entering data that is harder to enter for
a human, and can enter data beyond the limits of the HTML validation, making it
suitable for testing.

Paste is suitable for testing the human interaction with the browser events.

## Detailed Description

A CounterString is a string of text e.g. `*3*5*7*9*12*15*` where:

- the string is a specific length e.g. 15
- the last character in the string is an *
- the numbers before each * are the position of the *

This can act as Test Data for helping test the length allowed in forms and other data fields. If the value is truncated then you can tell from the numbers and the '*' how long the string is e.g. `*3*5*7*9*12*15` is 14 characters long because the '*' after 15 is missing.

Counterstrings are commonly used in  exploratory testing.

This extension is a simple CounterString generator, which:

- displays a dialog asking for the number of characters,
- then generates a CounterString of that length
- the CounterString is logged to the dev console to allow copy and pasting,
- the copy to clipboard option is default to make copy pasting easier
- the extension also inserts the CounterString into the value of the field that was selected when the right click context menu was displayed
- this supports supports testing online forms.

Instructions for use:

- right click on and input field
- enter value of CounterString
- CounterString will be logged to the console (use dev tools to see it)
- CounterString will be inserted as the value of the WebElement you clicked on

Note:

- works with forms on the actual page
- this extension does not work with forms embedded in frames

This is open source and source can be found at GitHub:

- https://github.com/eviltester/counterstringjs


## How to Install as Chrome Extension?

You can download this from the Chrome Store:

- [The Counterstring Chrome Store Page](https://chrome.google.com/webstore/detail/counterstring/keklpkmokeicakpclclkdmclhgkklmbd)

To install from source added as an "unpacked extension":

- download the zip file from releases
- unzip the file
- visit chrome://extensions
- switch on Developer mode
- Click Load Unpacked
- choose the extension folder (the one with the `manifest.json` in it)

## Regex Data Generation

Regex Data Generation uses the MIT Licensed `randexp.js`

- http://fent.github.io/randexp.js/

## Versions

- 20260115 - 0.4.1
   - added a generate to clipboard (copy to clipboard) option to allow manual pasting
   - use maxlength as default for counterstring if the field has this set
   - make copy to clipboard the default generation option
   - allow esc to close dialogs and make modal so click main page does not close dialog
      - because it was closing too often as I was configuring values
- 20260103 - 0.4.0
   - added optional input event when generating counterstring
   - migrated and expanded features from https://github.com/eviltester/testtoolhub
      - binary chop
      - character range
   - added basic regex functionality from anywaydata.com test data generation as generate or type
      - uses http://fent.github.io/randexp.js/
   - allow 'repeat' to use regex generation
   - simplified UI combine counterstring dialog
   - simplified UI combine range dialog
   - simplified UI combine random dialog
- 20260101 - 0.3.1 - added unit tests, custom dialogs, typing, and repeat functionality
- 20251231 - 0.3 - bug fix amended context menu to use id because it would lose the async returned value
- 20251221 - 0.2 - updated to manifest 3 and new API usage, with extra error handling
- 0.1 using manifest 2

## Publishing extension

https://developer.chrome.com/docs/webstore/publish