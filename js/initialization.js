chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({'searchedWebsite':'Goodreads'},function(){
     let lastError = chrome.runtime.lastError;
    if (lastError) {
          console.log(lastError.message);
           return;
         }
       });
 });
