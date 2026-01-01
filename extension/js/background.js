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
}
