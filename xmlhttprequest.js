const {Button, TextView, ui} = require('tabris');

new Button({
  left: 10, top: 10,
  text: "Find words starting with 'mobile'"
}).on('select', () => {
  let xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === xhr.DONE) {
      new TextView({
        left: 10, right: 10, top: 'prev() 10',
        text: JSON.parse(xhr.responseText)[1].join(', ')
      }).appendTo(ui.contentView);
    }
  };
  xhr.open('GET', 'http://en.wiktionary.org/w/api.php?action=opensearch&search=mobile&limit=100');
  xhr.send();
}).appendTo(ui.contentView);
