const {ImageView, TextInput, WebView, app, ui} = require('tabris');

const MARGIN = 8;
const NAV_SIZE = device.platform === 'Android' ? 48 : 30;

ui.contentView.background = '#f5f5f5';

let back = new ImageView({
  left: MARGIN, width: NAV_SIZE, height: NAV_SIZE, top: MARGIN,
  highlightOnTouch: true,
  image: {src: 'resources/arrow-back-black-24dp@3x.png', scale: 3},
}).on('tap', () => webView.goBack())
  .appendTo(ui.contentView);

let forward = new ImageView({
  left: back, width: NAV_SIZE, height: NAV_SIZE, top: MARGIN,
  highlightOnTouch: true,
  image: {src: 'resources/arrow-forward-black-24dp@3x.png', scale: 3},
}).on('tap', () => webView.goForward())
  .appendTo(ui.contentView);

let urlInput = new TextInput({
  id: 'urlInput',
  left: [forward, MARGIN], top: MARGIN, right: MARGIN,
}).on('accept', () => webView.url = urlInput.text)
  .appendTo(ui.contentView);

let webView = new WebView({
  left: 0, top: [urlInput, MARGIN], right: 0, bottom: 0,
  url: 'http://en.wikipedia.org'
}).on('load', updateNavigation)
  .appendTo(ui.contentView);

function updateNavigation() {
  urlInput.text = webView.url;
  updateNavigationButton(back, webView.canGoBack);
  updateNavigationButton(forward, webView.canGoForward);
}

function updateNavigationButton(button, enabled) {
  button.enabled = enabled;
  button.opacity = enabled ? 0.70 : 0.20;
}

app.on('backNavigation', (event) => {
  if (webView.canGoBack) {
    webView.goBack();
    event.preventDefault();
  }
});

updateNavigation();
