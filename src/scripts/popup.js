var clearButton = document.getElementById('clear-button');
var banlistWrapper = document.getElementById('banlist-wrapper');
var loadingMessage = document.getElementById('loading-message');
var storage = null;

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

function generateBanlistRow(url) {
  var row = document.createElement('tr');
  var element = document.createElement('td');
  var text = document.createTextNode(url);
  element.appendChild(text);
  row.appendChild(element);

  return row;
}

function generateBanlistTable(bans) {
  var table = document.createElement('table');
  for(var i = 0; i < bans.length; i++) {
    table.appendChild(generateBanlistRow(bans[i]));
  }
  banlistWrapper.appendChild(table);
}

loadStorage(function(err, items) {
  if (err) {
    throw err;
  }
  storage = items;
  banlistWrapper.removeChild(loadingMessage);
  if (storage.bans && storage.bans.length > 0) {
    generateBanlistTable(storage.bans);
  } else {
    banlistWrapper.appendChild(document.createTextNode('You have no bans'));
  }
});

clearButton.addEventListener('click', onClearBanlist);
