var clearButton = document.getElementById('clear-button');
var banlistWrapper = document.getElementById('banlist-wrapper');
var loadingMessage = document.getElementById('loading-message');
var emptyBanlistMessage = document.createTextNode('You have no bans');
var hasSetUp = false;
var storage = null;

function saveStorage(storage, cb) {
  chrome.storage.sync.set(storage, function() {
    if (chrome.runtime.lastError) {
      return cb(new Error(chrome.runtime.lastError));
    }
    return cb();
  });
}

function onClearBanlist(cb) {
  chrome.storage.sync.clear(function() {
    storage.bans = [];
    while(banlistWrapper.firstChild) {
      banlistWrapper.removeChild(banlistWrapper.firstChild);
    }
    banlistWrapper.appendChild(emptyBanlistMessage);
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

function onRemoveBanClick(url, element, event) {
  if (banlistWrapper.firstElementChild) {
    banlistWrapper.firstElementChild.removeChild(element);
    for (var i = 0; i < storage.bans.length; i++) {
      if (storage.bans[i] === url) {
        storage.bans.splice(i, 1);
        break;
      }
    };
    saveStorage(storage, function(err) { if (err) { throw err; } });
  }
}

function generateBanlistRow(url) {
  var row = document.createElement('tr');
  var element = document.createElement('td');
  var closeButton = document.createElement('button');
    closeButton.appendChild(document.createTextNode('X'));
  var text = document.createElement('label');
    text.appendChild(document.createTextNode(url));
  element.setAttribute('title', url);
  element.appendChild(closeButton);
  element.appendChild(text);
  row.appendChild(element);

  // Remove that row on clicking X
  closeButton.addEventListener('click', onRemoveBanClick.bind(this, url, row));

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

  if (! hasSetUp) {
    banlistWrapper.removeChild(loadingMessage);
    hasSetUp = true;
  }

  if (storage.bans && storage.bans.length > 0) {
    generateBanlistTable(storage.bans);
  } else {
    banlistWrapper.appendChild(emptyBanlistMessage);
  }
});

clearButton.addEventListener('click', onClearBanlist);
