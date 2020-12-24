chrome.runtime.onInstalled.addListener(function() {
var contextMenuItem={
  "id":"OpenSesame",
  "title":"OpenSesame",
  "contexts":["selection","page"]
}
chrome.contextMenus.create(contextMenuItem,function()
{
  let lastError = chrome.runtime.lastError;
  if (lastError) {
       console.log(lastError.message);
        return;
      }
});
});

chrome.contextMenus.onClicked.addListener(function( data) {
  if(data.menuItemId=="OpenSesame"&&data.selectionText)
    {

      chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
console.log("tabs"+tabs);
        chrome.tabs.sendMessage(tabs[0].id, {method: "getSelection"}, function(response){
            console.log("data"+response.data);
            openURLsInTabs(response.data);
        });
    });
   }
});
function openURLsInTabs(selectedText)
{
              let lines=selectedText.split(/[\r\n]+/);

             chrome.storage.sync.get(['searchedWebsite'],function(obj){
             if(!obj.searchedWebsite||obj.searchedWebsite.trim().length==0)
             {
               console.log('Cannot find default website value.')
             }
             else
              {
                switch (obj.searchedWebsite) {
                  case 'Goodreads':
                      var baseURI='https://www.goodreads.com/search?q=';
                    break;
                  case 'LinkedIn':
                       var baseURI='https://www.linkedin.com/search/results/all/?keywords=';
                      break;
                 case 'Wikipedia':
                        var baseURI='https://en.wikipedia.org/w/index.php?sort=relevance&search=';
                        break;
                 case 'CNN':
                            var baseURI='https://edition.cnn.com/search/?q=';
                          break;
                  default:
                    console.log('Cannot find default website value.')
                break;
                }

                 for(i=0;i<lines.length;i++)
                {
                  if(lines[i].trim().length>0)
                  openInNewTab(baseURI,lines[i]);
                }

               }
             });

}
function openInNewTab(baseURI,searchString)
{
  chrome.tabs.create({
        url: baseURI+encodeURIComponent(searchString),
        "active":false
    });
}
