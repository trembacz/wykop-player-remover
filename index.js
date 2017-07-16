(function () {
  let findNode = function(el, className) {
    while (el.parentNode) {
      el = el.parentNode;
      if (el.classList !== undefined && el.classList.contains(className))
        return el;
    }
    return null;
  }

  let createHTML = function(ytID, type) {
    let config = {
      "home": { "height": "385px", "autoplay": "1" },
      "details": { "height": "425px", "autoplay": "0" },
      "related": { "height": "425px", "autoplay": "1" }
    }

    let d = document.createElement('div');
    let outerHTML = `<iframe id="yt-${ytID}" class="youtube-player vtop" type="text/html" width="100%" height="${config[type].height}" src="https://www.youtube.com/embed/${ytID}?wmode=opaque&fs=1&rel=0&autohide=0&autoplay=${config[type].autoplay}" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>`;
    
    if (type === 'home') {
      d.innerHTML = outerHTML;
    } else {
      let e = document.createElement('div')
      e.classList.add('videoWrapper');
      e.innerHTML = outerHTML;
      d.innerHTML = e.innerHTML;
    }
    return d.firstChild;
  };
  
  new MutationObserver(function(element) {
    for (elem in element) {
      for (el of element[elem]['addedNodes']) {
        let ytBlock = findNode(el, "jwplayer");
        let ytID = ytBlock ? ytBlock.id.match(/^yt-(.*)$/mi)[1].replace('_youtube', '') : false;
        if (ytID) {
          let playerHTML = '';
          if (ytBlock.parentNode.classList.contains("block")) {
            playerHTML = createHTML(ytID, 'home');
          } else if (ytBlock.parentNode.classList.contains("screen")) {
            playerHTML = createHTML(ytID, 'details');
          } else if (ytBlock.parentNode.classList.contains("screen") && ytBlock.parentNode.parentNode.id === "relatedVideoPlayer") {
            playerHTML = createHTML(ytID, 'related');
          }
          ytBlock.parentNode.replaceWith(playerHTML);
        }
      }
    }
  }).observe(document, { childList: true, subtree: true })

})();
