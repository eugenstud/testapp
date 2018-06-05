const {CollectionView, Composite, TextView, ui} = require('tabris');

let items = [
  {title: 'Up for lunch?', sender: 'Johanna Smith', time: '11:35'},
  {title: 'JavaScript for mobile applications', sender: 'JavaScript Newsletter', time: '08:03'},
  {title: 'This is just a spam message', sender: 'Spammer', time: '04:32'},
  {title: 'CoolGrocery Discount Newsletter', sender: 'Local CoolGrocery', time: 'yesterday'},
  {title: 'Cinema this weekend?', sender: 'Robert J. Schmidt', time: 'yesterday'},
  {title: 'Coffee Club Newsletter', sender: 'Coffee Club', time: 'yesterday'},
  {title: 'Fraud mail', sender: 'Unsuspicious Jack', time: 'yesterday'}
];

let collectionView = new CollectionView({
  left: 0, right: 0, top: 0, bottom: 0,
  itemCount: items.length,
  cellHeight: 64,
  createCell: () => {
    let cell = new Composite({
      background: '#d0d0d0'
    });
    let container = new Composite({
      id: 'container',
      left: 0, top: 0, bottom: 0, right: 0,
      background: 'white'
    }).on('panHorizontal', event => handlePan(event))
      .appendTo(cell);
    new TextView({
      id: 'senderText',
      top: 8, left: 16,
      font: 'bold 18px'
    }).appendTo(container);
    new TextView({
      id: 'titleText',
      bottom: 8, left: 16
    }).appendTo(container);
    new TextView({
      id: 'timeText',
      textColor: '#b8b8b8',
      top: 8, right: 16
    }).appendTo(container);
    new Composite({
      left: 0, bottom: 0, right: 0, height: 1,
      background: '#b8b8b8'
    }).appendTo(cell);
    return cell;
  },
  updateCell: (view, index) => {
    let item = items[index];
    view.find('#container').set('transform', {translationX: 0});
    view.find('#container').first().item = item;
    view.find('#senderText').set('text', item.sender);
    view.find('#titleText').set('text', item.title);
    view.find('#timeText').set('text', item.time);
  }
}).appendTo(ui.contentView);

function handlePan(event) {
  let {target, state, translationX} = event;
  target.transform = {translationX};
  if (state === 'end') {
    handlePanFinished(event);
  }
}

function handlePanFinished(event) {
  let {target, velocityX, translationX} = event;
  let beyondCenter = Math.abs(translationX) > target.bounds.width / 2;
  let fling = Math.abs(velocityX) > 200;
  let sameDirection = sign(velocityX) === sign(translationX);
  // When swiped beyond the center, trigger dismiss if flinged in the same direction or let go.
  // Otherwise, detect a dismiss only if flinged in the same direction.
  let dismiss = beyondCenter ? sameDirection || !fling : sameDirection && fling;
  if (dismiss) {
    animateDismiss(event);
  } else {
    animateCancel(event);
  }
}

function animateDismiss({target, translationX}) {
  let bounds = target.bounds;
  target.animate({
    transform: {translationX: sign(translationX) * bounds.width}
  }, {
    duration: 200,
    easing: 'ease-out'
  }).then(() => {
    let index = items.indexOf(target.item);
    items.splice(index, 1);
    collectionView.remove(index);
  });
}

function animateCancel({target}) {
  target.animate({transform: {translationX: 0}}, {duration: 200, easing: 'ease-out'});
}

function sign(number) {
  return number ? number < 0 ? -1 : 1 : 0;
}
