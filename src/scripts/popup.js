
function loadStorage(cb) {
  chrome.storage.sync.get(null, function(items) {
    if (chrome.runtime.lastError) {
      return cb(new Error(chrome.runtime.lastError));
    }
    return cb(null, items);
  });
}

debugger;

loadStorage(function(err, items) {
  debugger;
});
