var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    id:         Number,
    title:      String,
    date:       { type: Date, default: Date.now },
    content:    String,
    address:    {
                    street: String,
                    city: String,
                    state: String,
                    zip: String
                }
});

var Event = mongoose.model('Event', eventSchema);

/*var event = new Event({
    id: 1,
    title: 'The Event of the Year',
    content: 'Cras tristique libero vel tortor sollicitudin volutpat. Nulla quis purus est. Sed dolor purus, mollis quis convallis iaculis, tincidunt vel enim. In eu justo ipsum. Pellentesque suscipit lacus ut pharetra rutrum. Proin porttitor euismod dolor in mattis. Sed ac elit eu eros eleifend semper. Quisque vitae faucibus tellus.',
    address: {
        street: '824 Willow Avenue',
        city: 'Apple Valley',
        state: 'CA',
        zip: '92307'
    }
});

var event = new Event({
    id: 2,
    title: 'Nunc at Odio Vulputate',
    content: 'Phasellus auctor erat nec odio ullamcorper accumsan. Donec eget pellentesque lorem. Morbi lobortis enim pulvinar est rutrum, vitae finibus ligula volutpat. Nunc at odio vulputate velit pharetra volutpat. Quisque non enim eros. Proin ultrices eget dui vel porttitor.',
    address: {
        street: '687 Olive Street',
        city: 'Quakertown',
        state: 'PA',
        zip: '18951'
    }
});

var event = new Event({
    id: 3,
    title: 'Curabitur Nec Orci',
    content: 'Nam non sapien est. Aenean pretium, arcu sed convallis mattis, lorem neque molestie odio, eu fringilla risus urna sed orci. Phasellus at gravida tellus. Nullam consectetur venenatis posuere. Fusce convallis risus tincidunt ex tempor, ac fermentum neque molestie. Fusce posuere elit mollis, vulputate ipsum et, semper felis. Donec eget suscipit enim. Sed consequat vehicula nibh, eget fermentum ante consequat ac.',
    address: {
        street: '33 Elm Street',
        city: 'Lakeland',
        state: 'FL',
        zip: '33801'
    }
});

var event = new Event({
    id: 4,
    title: 'Aliquam vel Ligula Dapibus',
    content: 'Phasellus nec lorem id ligula sollicitudin convallis sit amet sit amet lectus. Phasellus placerat turpis eu turpis efficitur, eget lobortis tortor efficitur. Aenean faucibus ex nec efficitur tincidunt. Curabitur sodales eros suscipit ante tristique porta. Nullam luctus lorem lacus, at tempor leo accumsan a. Cras ac efficitur ex. Aliquam quis posuere magna.',
    address: {
        street: '180 Walnut Street',
        city: 'Westlake',
        state: 'OH',
        zip: '44145'
    }
});

event.save(function(err, model) {
    if (err) {
        console.log('An error happened and the event was not saved to the database.');
    }
    else {
        console.log('The event appears to have been successfully recorded to the database.');
    }
});*/

module.exports = Event;