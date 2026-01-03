# CounterString JS

An Example of creating a CounterString tool in JavaScript.

Initially created as a "Snippet" run from chrome dev tools.

The source for this is in the `\snippets` directory.

Then the Snippet was converted into a simple Chrome Extension.

See the `extension` folder.


## Blog Posts & Videos

Description of writing the snippets version:

- [eviltester.com/blog/eviltester/2019-02-19-counterstring-snippets](https://www.eviltester.com/blog/eviltester/2019-02-19-counterstring-snippets/)
    - [youtu.be/l4D3MGg2iMI](https://youtu.be/l4D3MGg2iMI)
- YouTube Video showing creation of the Chrome Extension
    - [youtu.be/Olz4wo-ILwI](https://youtu.be/Olz4wo-ILwI)

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

- 202601?? - 0.3.2
   - added optional input event when generating counterstring
   - migrated and expanded features from https://github.com/eviltester/testtoolhub
      - binary chop
      - character range
   - added basic regex functionality from anywaydata.com test data generation as generate or type
      - uses http://fent.github.io/randexp.js/
   - allow 'repeat' to use regex generation
   - simplified UI combine counterstring dialog
- 20260101 - 0.3.1 - added unit tests, custom dialogs, typing, and repeat functionality
- 20251231 - 0.3 - bug fix amended context menu to use id because it would lose the async returned value
- 20251221 - 0.2 - updated to manifest 3 and new API usage, with extra error handling
- 0.1 using manifest 2

## Publishing extension

https://developer.chrome.com/docs/webstore/publish