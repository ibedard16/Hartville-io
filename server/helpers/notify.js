module.exports = function (responseObject, messageType, messageBody, messageTitle) {
    responseObject.send({notification: {type:messageType,body:messageBody,title:messageTitle}});
};