const {TextView, CollectionView, Slider, ui} = require('tabris');

let columnCountTextView = new TextView({
  bottom: 16, right: 16, width: 32,
  font: 'bold 14px'
}).appendTo(ui.contentView);

let slider = new Slider({
  left: 16, bottom: 0, right: [columnCountTextView, 16], height: 48,
  minimum: 1,
  maximum: 8
}).on('selectionChanged', ({value: selection}) => {
  collectionView.columnCount = selection;
  columnCountTextView.text = selection;
}).appendTo(ui.contentView);

let items = createItems();

let collectionView = new CollectionView({
  left: 0, top: 0, right: 0, bottom: slider,
  itemCount: items.length,
  cellHeight: 128,
  createCell: () => new TextView({
    font: 'bold 32px',
    textColor: '#555555',
    alignment: 'center',
    maxLines: 1
  }),
  updateCell: (cell, index) => {
    cell.set({
      text: items[index],
      background: index % 2 === 0 ? '#CFD8DC' : '#ffffff'
    });
  }
}).appendTo(ui.contentView);

slider.selection = 3;

function createItems() {
  let items = [];
  for (let i = 1; i <= 100; i++) {
    items.push(i);
  }
  return items;
}
