var timer = 1;
var selectors;
var storage = null;

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
  storage.bans.push(url);
  saveStorage(storage, function(err) { if (err) { throw err; } });
}

function isPathBanned(url, bans) {
  if (! bans) { return false; }
  for(var i = 0; i < bans.length; i++) {
    if (url === bans[i]) { return true; }
  }
  return false;
}

function generateBanButton(url, searchItem) {
  var banner = document.createElement('label');
  banner.appendChild(document.createTextNode('B'));
  banner.setAttribute('class', 'banbutton');

  banner.addEventListener('click', onBanClick.bind(this, url, searchItem));

  return banner;
}

function onLoaded() {
  for(var i = 0; i < selectors.length; i++) {
    var item = selectors[i];
    var linkWrapper = item.querySelector('.r');
    if (! linkWrapper) { continue; }
    var linkInfo = linkWrapper.firstChild;
    if (! linkInfo) { continue; }

    console.log('item', linkInfo.href);
    if (isPathBanned(linkInfo.href, storage.bans)) {
      item.setAttribute('hidden', 'hidden'); // Example on how to hide an item
    } else {
      linkWrapper.insertBefore(generateBanButton(linkInfo.href, item), linkInfo);
    }
  }
}

function checkIfLoaded(cb) {
  if (selectors && selectors.length && storage !== null) {
    console.log('google loaded');
    onLoaded();
  } else {
    timer *= 2;
    window.setTimeout(checkIfLoaded, timer);
  }

  selectors = document.querySelectorAll('li.g');
}

function main() {
  loadStorage(function(err, items) {
    if (err) {
      throw err;
    }
    storage = items;
  });
  window.setTimeout(checkIfLoaded, timer);
}

main();

