var contextMenus = {};

function createContextMenu() {
    chrome.contextMenus.removeAll(() => {
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

        contextMenus.typeCounterstring = 
            chrome.contextMenus.create(
                {
                    "id": "typeCounterstring",
                    "title":"Type Counterstring",
                    "contexts" : ["editable"]
                },
                function (){
                    if(chrome.runtime.lastError){
                        console.error("Error creating Type Counterstring context menu:", chrome.runtime.lastError.message);
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

        contextMenus.typeRange =
            chrome.contextMenus.create(
                {
                    "id": "typeRange",
                    "title":"Type Range",
                    "contexts" : ["editable"]
                },
                function (){
                    if(chrome.runtime.lastError){
                        console.error("Error creating Type Range context menu:", chrome.runtime.lastError.message);
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

        contextMenus.typeRandom =
            chrome.contextMenus.create(
                {
                    "id": "typeRandom",
                    "title":"Type Random",
                    "contexts" : ["editable"]
                },
                function (){
                    if(chrome.runtime.lastError){
                        console.error("Error creating Type Random context menu:", chrome.runtime.lastError.message);
                    }
                }
            );
    });
}

chrome.runtime.onInstalled.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener(contextMenuHandler);


function contextMenuHandler(info, tab){

    if(info.menuItemId==="generateCounterstring"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/dialog.js', 'js/counterstring.js', 'js/counterstring-init.js']
              });
        }catch(e){
            console.error("Counterstring script error:", e);
        }
    }

    if(info.menuItemId==="typeCounterstring"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/dialog.js', 'js/generateSchema.js', 'js/incrementalForwardCounterString.js', 'js/typeCounterstring.js']
              });
        }catch(e){
            console.error("Type Counterstring script error:", e);
        }
    }

    if(info.menuItemId==="repeatTextOrChr"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/repeat-dialog.js', 'js/repeat-init.js']
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

    if(info.menuItemId==="generateRange"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/range-dialog.js', 'js/range.js', 'js/range-init.js']
              });
        }catch(e){
            console.error("Generate Range script error:", e);
        }
    }

    if(info.menuItemId==="typeRange"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/range-dialog.js', 'js/typeRange.js']
              });
        }catch(e){
            console.error("Type Range script error:", e);
        }
    }

    if(info.menuItemId==="generateRandom"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/external/randexp.min.js', 'js/random-dialog.js', 'js/random.js', 'js/random-init.js']
              });
        }catch(e){
            console.error("Generate Random script error:", e);
        }
    }

    if(info.menuItemId==="typeRandom"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/external/randexp.min.js', 'js/random-dialog.js', 'js/random.js', 'js/typeRandom.js']
              });
        }catch(e){
            console.error("Type Random script error:", e);
        }
    }
}
