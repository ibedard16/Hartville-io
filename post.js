var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:wzgk1212@ds059672.mongolab.com:59672/hartvilleio');

var postSchema = mongoose.Schema({
    title:      String,
    author:     String,
    date:       { type: Date, default: Date.now },
    content:    String,
    categories: Array,
    images:     Array
});

var Post = mongoose.model('Post', postSchema);

/*var post0 = new post({
			title: 'Etiam Dapibus',
			link: '#/blog/0',
			author: 'John Smith',
			date: 1388123412323,
			content: 'Sed congue quam sed est porta, at tempor feugiat. Etiam dapibus congue imperdiet. Nam commodo nisi et diam gravida elementum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas malesuada fringilla ex, id placerat diam consectetur quis. Lorem et magna consectetur vitae. Maecenas eu venenatis mauris, congue congue nulla.',
			teaser: 'Mauris sodales neque vitae bibendum varius. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per turpis duis.',
			categories: ['Community'],
			images: [
				{
					full: 'images/post-01-full.jpg',
					thumb: ''
				}
			]
		});
var post1 = new post({
	title: 'In Augue Orci',
	link: '#/blog/1',
	author: 'Tom Sulivan',
	date: 1912123512443,
	content: 'Aliquam lacinia, ex at lobortis varius, velit nulla tempor neque, vitae rutrum leo eros sodales ligula. In augue orci, varius non nunc sed, consequat imperdiet massa. Duis vitae blandit felis, sed luctus massa. Etiam dignissim nunc urna, a egestas enim cursus quis. Nam nec pretium sapien. Phasellus quis consectetur sem.',
	teaser: 'Proin eget leo dictum, viverra ipsum id, tincidunt justo. Mauris leo est, dapibus in ligula eget, varius vehicula sapien nullam.',
	categories: ['Community', 'Technology'],
	images: [
		{
			full: 'images/post-02-full.jpg',
			thumb: ''
		}
	]
});
var post2 = new post({
	title: 'Nullam et Nisi',
	link: '#/blog/2',
	author: 'Tom Sulivan',
	date: 1312123442323,
	content: 'Morbi molestie diam id urna fringilla commodo eget vel justo. In bibendum viverra risus, a tempus elit auctor tincidunt. Quisque id malesuada nunc, ut eleifend metus. Quisque eget vehicula nunc. Fusce faucibus sit amet libero accumsan viverra. Vestibulum facilisis enim eget nisi ullamcorper iaculis. Nullam et nisi turpis. Proin pretium risus a magna elementum ultrices.',
	teaser: 'Proin at lorem eu mi tristique facilisis. Nulla bibendum viverra vestibulum. Quisque ut varius odio. Sed posuere porta volutpat.',
	categories: ['News'],
	images: [
		{
			full: 'images/post-03-full.jpg',
			thumb: ''
		}
	]
});
var post3 = new post({
	title: 'Curabitur Eget Semper',
	link: '#/blog/3',
	author: 'Joanne Smith',
	date: 1336123517323,
	content: 'Curabitur eget semper nibh. Ut sed blandit velit, sit amet pellentesque libero. Vivamus varius dolor sed quam accumsan porta. Nunc feugiat orci nec semper lobortis. Nullam eget accumsan est. Nam placerat eleifend suscipit. Aenean tincidunt ultrices nulla ut volutpat. Pellentesque sem magna, molestie ut massa ut, convallis dictum leo. In bibendum viverra risus, a tempus elit auctor tincidunt. Quisque id malesuada nunc, ut eleifend metus.',
	teaser: 'Pellentesque vel sagittis elit. Vivamus non felis tempus, varius mauris vitae, maximus neque. Integer massa quam, commodo metus.',
	categories: ['Technology', 'Science'],
	images: [
		{
			full: 'images/post-04-full.jpg',
			thumb: ''
		}
	]
});

post0.save(function (err) {
    if (err) {
        console.log(500,'Too bad, so sad. Whatever you were trying to do didn\'t work!', err);
    };
});

post1.save(function (err) {
    if (err) {
        console.log(500,'Too bad, so sad. Whatever you were trying to do didn\'t work!', err);
    };
});

post2.save(function (err) {
    if (err) {
        console.log(500,'Too bad, so sad. Whatever you were trying to do didn\'t work!', err);
    };
});

post3.save(function (err) {
    if (err) {
        console.log(500,'Too bad, so sad. Whatever you were trying to do didn\'t work!', err);
    };
});*/

module.exports = Post;