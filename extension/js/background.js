var contextMenus = {};

function createContextMenu() {
    chrome.contextMenus.removeAll(() => {
        contextMenus.openFloatingDialog = chrome.contextMenus.create(
            {
                id: 'openFloatingDialog',
                title: 'Open Floating Dialog',
                contexts: ['page', 'editable']
            },
            () => {
                if (chrome.runtime.lastError) {
                    console.error('Error creating Open Floating Dialog context menu:', chrome.runtime.lastError.message);
                }
            }
        );

        contextMenus.createCounterString = 
            chrome.contextMenus.create(
                {
                    "id": "generateCounterstring",
                    "title":"Generate Counterstring",
                    "contexts" : ["editable"]
                },
                function (){
                    if(chrome.runtime.lastError){
                        console.error("Error creating Counterstring context menu:", chrome.runtime.lastError.message);
                    }
                }
            );

        contextMenus.inspectFieldText = chrome.contextMenus.create(
            {
                id: 'inspectFieldText',
                title: 'Inspect Field Text',
                contexts: ['editable']
            },
            () => {
                if (chrome.runtime.lastError) {
                    console.error('Error creating Inspect Field Text context menu:', chrome.runtime.lastError.message);
                }
            }
        );

        contextMenus.generateRandom =
            chrome.contextMenus.create(
                {
                    "id": "generateRandom",
                    "title":"Generate Random",
                    "contexts" : ["editable"]
                },
                function (){
                    if(chrome.runtime.lastError){
                        console.error("Error creating Generate Random context menu:", chrome.runtime.lastError.message);
                    }
                }
            );

        contextMenus.generateRange =
            chrome.contextMenus.create(
                {
                    "id": "generateRange",
                    "title":"Generate Range",
                    "contexts" : ["editable"]
                },
                function (){
                    if(chrome.runtime.lastError){
                        console.error("Error creating Generate Range context menu:", chrome.runtime.lastError.message);
                    }
                }
            );


        contextMenus.repeatTextOrChr = 
            chrome.contextMenus.create(
                {
                    "id": "repeatTextOrChr",
                    "title":"Repeat Text / Chr...",
                    "contexts" : ["editable"]
                },
                function (){
                    if(chrome.runtime.lastError){
                        console.error("Error creating Repeat Text/Chr context menu:", chrome.runtime.lastError.message);
                    }
                }
            );

        contextMenus.binaryChop =
            chrome.contextMenus.create(
                {
                    "id": "binaryChop",
                    "title":"Binary Chop",
                    "contexts" : ["editable"]
                },
                function (){
                    if(chrome.runtime.lastError){
                        console.error("Error creating Binary Chop context menu:", chrome.runtime.lastError.message);
                    }
                }
            );
    });
}

chrome.runtime.onInstalled.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener(contextMenuHandler);
chrome.action.onClicked.addListener(tab => openFloatingDialog(tab.id));

function openFloatingDialog(tabId, frameId = 0) {
    if (tabId === undefined) return;

    chrome.scripting.executeScript({
        target: { tabId, frameIds: [frameId] },
        files: [
            'js/keyboard-utils.js', 'js/counterstring.js', 'js/external/randexp.min.js',
            'js/sample-regexes.js', 'js/random.js', 'js/range.js', 'js/repeat.js',
            'js/binaryChop.js', 'js/floating-field.js', 'js/floating-tools.js', 'js/floating-dialog.js'
        ]
    }).catch(error => console.error('Floating Dialog script error:', error));
}

function contextMenuHandler(info, tab){

    if (info.menuItemId === 'openFloatingDialog') {
        openFloatingDialog(tab.id, info.frameId);
        return;
    }

    if (info.menuItemId === 'inspectFieldText') {
        chrome.scripting.executeScript({
            target: { tabId: tab.id, frameIds: [info.frameId ?? 0] },
            files: ['js/inspect-field-text.js']
        }).catch(error => console.error('Inspect Field Text script error:', error));
        return;
    }

    if(info.menuItemId==="generateCounterstring"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/keyboard-utils.js', 'js/dialog.js', 'js/counterstring.js', 'js/generateSchema.js', 'js/incrementalForwardCounterString.js', 'js/counterstring-init.js']
              });
        }catch(e){
            console.error("Counterstring script error:", e);
        }
    }

    if(info.menuItemId==="generateRandom"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/keyboard-utils.js', 'js/external/randexp.min.js', 'js/sample-regexes.js', 'js/random-dialog.js', 'js/random.js', 'js/random-init.js']
              });
        }catch(e){
            console.error("Random script error:", e);
        }
    }

    if(info.menuItemId==="generateRange"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/keyboard-utils.js', 'js/range-dialog.js', 'js/range.js', 'js/range-init.js']
              });
        }catch(e){
            console.error("Range script error:", e);
        }
    }

    if(info.menuItemId==="repeatTextOrChr"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/keyboard-utils.js', 'js/external/randexp.min.js', 'js/sample-regexes.js', 'js/random.js', 'js/repeat.js', 'js/repeat-dialog.js', 'js/repeat-init.js']
              });
        }catch(e){
            console.error("Repeat Text/Chr script error:", e);
        }
    }

    if(info.menuItemId==="binaryChop"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/binaryChop.js', 'js/binary-chop-dialog.js', 'js/binary-chop-init.js']
              });
        }catch(e){
            console.error("Binary Chop script error:", e);
        }
    }
}
