angular.module('markdownFilter', ['truncate'])
    .filter('markdown', function() {
      return function(value) {
        if (value) {
            var converter = new showdown.Converter();
            converter.setOption('smoothLivePreview', 'true');
            converter.setOption('strikethrough', 'true');
            converter.setOption('tables', 'true');
            converter.setOption('simplifiedAutoLink', 'true')
            var html = converter.makeHtml(value);
            return html;
        } else {
            return '';
        }
      };
    })
    .filter('markdownPreview', ['$filter', function($filter) {
      return function(value, limit) {
        if (value) {
            var preview = $filter('characters')(value,250),
                html = $filter('markdown')(preview);
            return html;
        } else {
            return '';
        }
      };
    }])
    
    /* if (html.indexOf('<p>')>=0){
                var pStart  = html.indexOf('<p>') + 3,
                    pEnd    = html.indexOf('</p>'),
                    pSlice  = html.slice(pStart,pEnd);
                    while (pSlice.indexOf('<img')>=0) {
                        var iSliceA = pSlice.slice(pSlice.indexOf('<img')),
                            iSliceB = iSliceA.slice(0, iSliceA.indexOf('>')+1);
                        pSlice = pSlice.replace(iSliceB, '');
                    }
                    console.log(pSlice);
                    return $filter('characters')(pSlice,240); 
        } else {
                return '';
            }*/