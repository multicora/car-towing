app.filter('startWithLetter', function () {
  return function (items, letter) {
    if (!letter || letter.length == 0) {
      return items;
    }
    var i = 0;
    var filtered = [];
    var letterMatch = new RegExp(letter, 'i');
      for (i; i < items.length; i++) {
        var item = items[i];
        if (letterMatch.test(item.name.substring(0, 1))) {
          filtered.push(item);
        }
      }
    return filtered;
    };
});