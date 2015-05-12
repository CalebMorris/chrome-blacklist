console.log('popup script');

function onClearBanlist(cb) {
  chrome.storage.sync.clear(function() {
    console.log('cleared');
  });
}

function loadStorage(cb) {
  chrome.storage.sync.get(null, function(items) {
    if (chrome.runtime.lastError) {
      return cb(new Error(chrome.runtime.lastError));
    }
    return cb(null, items);
  });
}

loadStorage(function(err, items) {
  console.log('items', JSON.stringify(items));
});

var clearButton = document.getElementById('clear-button');

clearButton.addEventListener('click', onClearBanlist);
