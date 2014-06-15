(function(){
  var MAIN_CONTENT_SELECTOR = '#main';

  var find = function(selector, context) {
    return (context || document).querySelector(selector);
  };

  var loadChapter = function(url) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.responseType = 'document';

    xhr.onload = function() {
      var newChapter = find(MAIN_CONTENT_SELECTOR, this.response);
      var newTitle = find('title', this.response).textContent;
      var currentChapter = find(MAIN_CONTENT_SELECTOR);

      find('title').textContent = newTitle;

      currentChapter.parentNode.replaceChild(newChapter, currentChapter);
      find('.chapter').classList.add('animated', 'fadeInUpBig');
      window.scrollTo(0, 0);
    };

    xhr.send();
  };

  if (history && history.pushState) {

    find('body').addEventListener('click', function(e) {

      if (e.target.tagName.toLowerCase() === 'a') {
        e.preventDefault();
        loadChapter(e.target.href);
        history.pushState(null, null, e.target.href);
      }
    });

    setTimeout(function() {
      window.onpopstate = function() {
        loadChapter(window.location.href);
      };
    }, 1000);
  }
}())