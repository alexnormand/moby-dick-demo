var fs = require('fs');
var jsdom = require('jsdom');
var jade = require('jade');

var template = jade.compile(fs.readFileSync('./template.jade'));

var getChapters = function(window) {
  var $ = window.jQuery;

  return $('blockquote p > a').map(function(index) {
    var i = this.href.lastIndexOf('#');
    var label = this.textContent;
    var id = /^chapter(\d+)\./.exec(label.toLowerCase().split(' ').join(''));
    var text = $(this.href.slice(i)).parent().next().nextUntil('div', 'p').map(function() {
      return '<p>' + this.textContent + '</p>';
    }).get().join('');

    return {
      label: label,
      text:  text
    };
  }).get().slice(2);
};

var generateHTMLFile = function(chapter, i, chapters) {
  var html = template({
    prev: i || undefined,
    next: i < (chapters.length - 1) ? i + 2 : undefined,
    title: 'Moby Dick - ' + chapter.label,
    content: chapter.text
  });

  fs.writeFile('./chapters/' + (i + 1) + '.html', html, function(err) {
    console.log('wrote: ' + chapter.label);
  });
};


fs.readFile('./mobyDick.html', function(err, body) {
  jsdom.env({
    html: body,
    scripts: 'http://code.jquery.com/jquery.js',
    done: function(err, window) {
      getChapters(window).forEach(generateHTMLFile);
    }
  });
});





