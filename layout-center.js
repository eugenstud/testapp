const {Composite, ui} = require('tabris');

new Composite({
  centerX: 0, centerY: 0, width: 100, height: 100,
  background: 'red'
}).appendTo(ui.contentView);
