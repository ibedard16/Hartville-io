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
    title: 'The Event of the Year',
    content: 'Cras tristique libero vel tortor sollicitudin volutpat. Nulla quis purus est. Sed dolor purus, mollis quis convallis iaculis, tincidunt vel enim. In eu justo ipsum. Pellentesque suscipit lacus ut pharetra rutrum. Proin porttitor euismod dolor in mattis. Sed ac elit eu eros eleifend semper. Quisque vitae faucibus tellus.',
    address: {
        street: '824 Willow Avenue',
        city: 'Apple Valley',
        state: 'CA',
        zip: '92307'
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