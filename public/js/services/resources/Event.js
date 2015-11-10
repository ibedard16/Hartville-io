/*global app*/
app.factory('Event', ['$resource', '$http', 'appConfig', function($resource, $http, appConfig) {
    
    function processEventTime (event) {
    	event.start = new Date(event.start.utc);
		event.end = new Date(event.end.utc);
    }
    
    function processEvent (data, headersGetter) {
    	data = JSON.parse(data);
    	
    	if (data.events) {
			var events = data.events;
			
			for (var i = 0; i < events.length; i++) {
				processEventTime(events[i]);
			}
			
			return events;
		} else {
			var event = data;
			processEventTime(event);
			return [event];
		}
    }
    
    var Event = $resource('https://www.eventbriteapi.com/v3/events/:id/', {
    	id: 'search', 
    	expand: 'venue',
    	sort_by: 'date',
    	'user.id': appConfig.eventBrite.userId, 
    	token: appConfig.eventBrite.anon_token, 
    	tracking_code: appConfig.eventBrite.tracking_code
    }, {
    	'get': {
    		transformResponse: processEvent,
    		isArray: true,
    		cache: true
    	}
    });
    
    return Event;
}]);