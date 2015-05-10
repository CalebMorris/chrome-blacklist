console.log('test script loaded');

var timer = 1;
var selectors;

function onLoaded() {
  console.log('selectors', selectors);

  for(var i = 0; i < selectors.length; i++) {
    var item = selectors[i];
    var linkInfo = item.querySelector('.r a');
    if (linkInfo) {
      console.log('item', linkInfo.href);
      if (linkInfo.href === 'http://www.speedtest.net/') {
        item.setAttribute('hidden', 'hidden'); // Example on how to hide an item
      }
    }
  }
}

function checkIfLoaded(cb) {
  if (selectors && selectors.length) {
    console.log('google loaded');
    onLoaded();
  } else {
    timer *= 2;
    window.setTimeout(checkIfLoaded, timer);
  }

  selectors = document.querySelectorAll('li.g');
}

window.setTimeout(checkIfLoaded, timer);

