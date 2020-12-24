$("#searchBtnId").click(function(){
openURLsInTabs();
  });

function openURLsInTabs()
{
  chrome.tabs.executeScript( {
               code: "window.getSelection().toString();"
           }, function(selection) {
             let lines=selection[0].split(/[\r\n]+/);

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
});
}
function openInNewTab(baseURI,searchString)
{
  chrome.tabs.create({
        url: baseURI+encodeURIComponent(searchString),
        "active":false
    });
}

chrome.storage.sync.get(['searchedWebsite'],function(obj){
if(!obj.searchedWebsite)
{
  console.log('Cannot find default website value.')
}
else
 {
     $('#websitesDropdownMenu a').parents('.dropdown').find('.dropdown-toggle').html(obj.searchedWebsite + ' <span class="caret"></span>');

  }
});

$('#websitesDropdownMenu a').on('click', function () {

    var newSearchedWebsite=($(this).text());
      chrome.storage.sync.set({'searchedWebsite':newSearchedWebsite},function(){
        let lastError = chrome.runtime.lastError;
       if (lastError) {
             console.log(lastError.message);
              return;
            }
            $('#websitesDropdownMenu a').parents('.dropdown').find('.dropdown-toggle').html(newSearchedWebsite + ' <span class="caret"></span>');
          });
  });
