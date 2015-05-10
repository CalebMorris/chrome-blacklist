console.log('test script loaded');

var timer = 1;
var selectors;

function onBanClick(url, event) {
  debugger;
}

function generateBanButton(url) {
  var banner = document.createElement('label');
  banner.appendChild(document.createTextNode('B'));
  banner.setAttribute('class', 'banbutton');

  banner.addEventListener('click', onBanClick.bind(this, url));

  return banner;
}

function onLoaded() {
  console.log('selectors', selectors);

  for(var i = 0; i < selectors.length; i++) {
    var item = selectors[i];
    var linkWrapper = item.querySelector('.r');
    if (! linkWrapper) { continue; }
    var linkInfo = linkWrapper.firstChild;
    if (! linkInfo) { continue; }

    console.log('item', linkInfo.href);
    if (linkInfo.href === 'http://www.speedtest.net/') {
      item.setAttribute('hidden', 'hidden'); // Example on how to hide an item
    } else {
      linkWrapper.insertBefore(generateBanButton(linkInfo.href), linkInfo);
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

