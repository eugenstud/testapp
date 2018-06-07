const {WidgetCollection, CollectionView, Composite, TextView, ImageView, Button, ui} = require('tabris');
const{ _ } = require('underscore');

let img = {src:'resources/delete-black-24dp@3x.png'};

let camera = navigator.camera;

let CollectionItem = require('./src/collectionitem.js');

let items = [
	{title: 'Up for lunch?', sender: 'Johanna Smith', time: '11:35'},
	{title: 'JavaScript for mobile applications', sender: 'JavaScript Newsletter', time: '08:03'},
	{title: 'This is just a spam message', sender: 'Spammer', time: '04:32'},
	{title: 'CoolGrocery Discount Newsletter', sender: 'Local CoolGrocery', time: 'yesterday'},
	{title: 'Cinema this weekend?', sender: 'Robert J. Schmidt', time: 'yesterday'},
	{title: 'Coffee Club Newsletter', sender: 'Coffee Club', time: 'yesterday'},
	{title: 'Fraud mail', sender: 'Unsuspicious Jack', time: 'yesterday'}
];
var backup = _.clone(items);

let collectionView = new CollectionView({
	left: 0, right: 0, top: 0, bottom: 0,
	refreshEnabled: true,
	itemCount: items.length,
	//cellHeight: 64,
	createCell: () => {
		//let cell = new CollectionItem();
		let cell = new Composite({
			background: '#d0d0d0'
		});
		//});
		new ImageView({
			left: 22, top: 22, height: 20, image: 'resources/delete-black-24dp@3x.png', scaleMode: 'fit'
		}).on('tap', event => {
			let {target, velocityX, translationX} = event;
			animateDismiss(event);
			let index = items.indexOf(target.item);
			items.splice(index, 1);
			collectionView.remove(index);
			console.debug('deleted');
		}).appendTo(cell);
		let container = new Composite({
			id: 'container',
			left: 0, top: 0, bottom: 0, right: 0,
			background: 'white'
		}).on('panHorizontal', event => handlePan(event))
		//handleTap(event))
			.appendTo(cell);

		new TextView({
			id: 'senderText',
			top: 8, left: 64,
			font: 'bold 18px'
		}).appendTo(container);
		new TextView({
			id: 'titleText',
			bottom: 8, left: 64
		}).appendTo(container);
		new TextView({
			id: 'timeText',
			textColor: '#b8b8b8',
			top: 8, right: 16
		}).appendTo(container);
		new ImageView({
			left: 2, top: 2, height: 56, scaleMode: 'fit', image: 'resources/ian.jpg'
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

new Button({
	bottom: 5, left:0, right: 0, text:"Refresh"
}).on('select', event => {
	items = _.clone(backup);
	console.debug(backup.length);
	collectionView.load(items.length);
}).appendTo(ui.contentView);

function handlePan(event) {
	let {target, state, translationX} = event;
	target.transform = {translationX};
	if (state === 'end') {
		handlePanFinished(event);
	}
}

function handleTap(event) {
	let {target, state, translationX} = event;
	animateDismiss(event);
	//target.transform = {translationX};
	//if (state === 'end') {
	//  handlePanFinished(event);
	//}
}

function handlePanFinished(event) {
	let {target, velocityX, translationX} = event;
	let beyondCenter = Math.abs(translationX) > target.bounds.width / 2;
	let fling = Math.abs(velocityX) > 200;
	let sameDirection = sign(velocityX) === 1;//sign(translationX);
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
		transform: {translationX: sign(translationX) * bounds.width / 2}
	}, {
		duration: 200,
		easing: 'ease-out'
	}).then(() => {
		let index = items.indexOf(target.item);
		//items.splice(index, 1);
		//collectionView.remove(index);
	});
}

function animateCancel({target}) {
	target.animate({transform: {translationX: 0}}, {duration: 200, easing: 'ease-out'});
}

function sign(number) {
	return number ? number < 0 ? -1 : 1 : 0;
}

/*cordova.plugins.barcodeScanner.scan(
      function (result) {
          console.error("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      },
      function (error) {
          console.error("Scanning failed: " + error);
      },
      {
          preferFrontCamera : true, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: true, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt : "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
      }
   );*/


camera.getPicture(
	function(imageData){
		img.src = "data:image/jpeg;base64," + imageData;
		ui.contentView.find("ImageView")[1].image = img;
	},
	function(message){
		console.error(message);
	},
	{
		quality: 5,
		destinationType: Camera.DestinationType.DATA_URL,
		correctOrientation: true
	});
