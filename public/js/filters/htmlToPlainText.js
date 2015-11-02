app.filter('htmlToPlainText', function() {
    return function(text) {
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
  }
);
