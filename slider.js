const {Slider, TextView, ui} = require('tabris');

// Create a slider with a selection handler

let textView = new TextView({
  left: 10, right: 10, top: '30%',
  alignment: 'center',
  font: '22px sans-serif',
  text: '50'
}).appendTo(ui.contentView);

new Slider({
  left: 50, top: [textView, 20], right: 50,
  minimum: -50,
  selection: 50,
  maximum: 150
}).on('selectionChanged', ({value}) => textView.text = value)
  .appendTo(ui.contentView);
