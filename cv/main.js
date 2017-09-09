// Copyright 2014–2017 Sander Dijkhuis <mail@sanderdijkhuis.nl>

(function cv() {
  "use strict";

  main();

  function main() {
    fetchJSON(str(BASE, "/posts/878"), onCVLoad);
  }

  function onCVLoad(cv) {
    var container = document.getElementById("cv");

    setPageTitle(cv.title);

    container.innerHTML = cv.content;

    array(container.getElementsByClassName("gallery-item")).forEach(
      adjustGalleryItem
    );

    fancybox(".cv a:has(img)", { fitToView: false }).attr("rel", "static");
  }

  function adjustGalleryItem(item) {
    var img = firstOrNull(item.getElementsByTagName("img"));
    var caption = firstOrNull(item.getElementsByTagName("figcaption"));

    img.title = caption.innerText;

    if (caption) caption.parentNode.removeChild(caption);
  }
})();
