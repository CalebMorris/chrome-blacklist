var timer = 1;
var selectors;
var storage = null;
var hidden = []; // { wrapper : , url : }

function isPathBanned(url, bans) {
  if (! bans) { return false; }
  for(var i = 0; i < bans.length; i++) {
    if (url === bans[i]) { return true; }
  }
  return false;
}

function filterUnhiddenItems() {
  var bans = storage.bans || [];
  for(var i = 0; i < hidden.length; i++) {
    var item = hidden[i];
    if (isPathBanned(item.url, bans)) {
      item.wrapper.removeAttribute('hidden');
      hidden.splice(i, 1);
    }
  }
}

function filterNewHiddenItems(initial) {
  for(var i = 0; i < selectors.length; i++) {
    var item = selectors[i];
    var linkWrapper = item.querySelector('.r');
    if (! linkWrapper) { continue; }
    var linkInfo = linkWrapper.firstChild;
    if (! linkInfo) { continue; }

    if (isPathBanned(linkInfo.href, storage.bans)) {
      item.setAttribute('hidden', 'hidden'); // Example on how to hide an item
      hidden.push({ wrapper : item, url : linkInfo.href });
    } else if(initial) {
      linkWrapper.insertBefore(generateBanButton(linkInfo.href, item), linkInfo);
    }
  }
}

function updateHiddenItems() {
  // Filter out unhidden
  filterUnhiddenItems();
  // Add new hidden
  filterNewHiddenItems();
}

function onStorageChanged(changes, areaName) {
  var keys = Object.keys(changes);
  var banChanges = false;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (key === 'bans') { banChanges = true; }
    storage[key] = changes[key].newValue;
  }

  if (banChanges) {
    updateHiddenItems();
  }
}

function loadStorage(cb) {
  chrome.storage.sync.get(null, function(items) {
    if (chrome.runtime.lastError) {
      return cb(new Error(chrome.runtime.lastError));
    }
    return cb(null, items);
  });
}

function saveStorage(storage, cb) {
  chrome.storage.sync.set(storage, function() {
    if (chrome.runtime.lastError) {
      return cb(new Error(chrome.runtime.lastError));
    }
    return cb();
  });
}

function onBanClick(url, searchItem, event) {
  if (! storage.bans) {
    storage.bans = [];
  }
  searchItem.setAttribute('hidden', 'hidden');
  hidden.push({ url : url, wrapper : searchItem });
  storage.bans.push(url);
  saveStorage(storage, function(err) { if (err) { throw err; } });
}

function generateBanButton(url, searchItem) {
  var banner = document.createElement('label');

  var banButton = document.createElement('img');
  banButton.setAttribute('src', chrome.extension.getURL('../../images/blacklist_48x48.png'));
  banButton.setAttribute('style', 'width:1.5em;height:2ex');
  banButton.setAttribute('title', 'Ban `' + url + '`');

  banner.appendChild(banButton);
  banner.setAttribute('class', 'banbutton');
  banner.addEventListener('click', onBanClick.bind(this, url, searchItem));

  return banner;
}

function checkIfLoaded(cb) {
  if (selectors && selectors.length && storage !== null) {
    filterNewHiddenItems(true);
  } else {
    timer *= 2;
    window.setTimeout(checkIfLoaded, timer);
  }

  selectors = document.querySelectorAll('li.g');
}

function main() {
  chrome.storage.onChanged.addListener(onStorageChanged);
  loadStorage(function(err, items) {
    if (err) {
      throw err;
    }
    storage = items;
  });
  window.setTimeout(checkIfLoaded, timer);
}

main();

