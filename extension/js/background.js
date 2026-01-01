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
    });
}

chrome.runtime.onInstalled.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener(contextMenuHandler);


function contextMenuHandler(info, tab){

    if(info.menuItemId==="generateCounterstring"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/counterstring.js', 'js/counterstring-init.js']
              });
        }catch(e){
            console.error("Counterstring script error:", e);
        }
    }

    if(info.menuItemId==="typeCounterstring"){
        try{
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['js/generateSchema.js', 'js/incrementalForwardCounterString.js', 'js/typeCounterstring.js']
              });
        }catch(e){
            console.error("Type Counterstring script error:", e);
        }
    }
}