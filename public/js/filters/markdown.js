angular.module('markdownFilter', ['truncate'])
    .filter('markdown', function() {
      return function(value) {
        if (value) {
            var converter 	= new showdown.Converter(),
                html        = converter.makeHtml(value);
            return html;
        } else {
            return '';
        }
      };
    })
    .filter('markdownPreview', ['$filter', function($filter) {
      return function(value, limit) {
        if (value) {
            var converter 	= new showdown.Converter(),
                html        = converter.makeHtml(value);
            if (html.indexOf('<p>')>=0){
                var pStart  = html.indexOf('<p>') + 3,
                    pEnd    = html.indexOf('</p>'),
                    pSlice  = html.slice(pStart,pEnd);
                    return $filter('words')(pSlice,limit);
            } else {
                return '';
            }
        } else {
            return '';
        }
      };
    }])