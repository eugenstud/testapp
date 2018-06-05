const {ImageView, fs, ui} = require('tabris');

let file = fs.cacheDir + '/test.png';

let imageView = new ImageView({
  centerX: 0, centerY: 0, width: 400, height: 200,
  background: '#aaaaaa'
}).appendTo(ui.contentView);

fetch('http://lorempixel.com/400/200/')
  .then(res => res.arrayBuffer())
  .then(data => fs.writeFile(file, data))
  .then(() => imageView.image = file)
  .then(() => console.log('image:', file))
  .catch(err => console.error(err));
