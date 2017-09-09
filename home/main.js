// Copyright 2014–2017 Sander Dijkhuis <mail@sanderdijkhuis.nl>

(function cv() {
  "use strict";

  main();

  function main() {
    fetchJSON(str(BASE, "/posts/888"), onHomeLoad);
  }

  function onHomeLoad(home) {
    var container = document.getElementById("home");

    container.innerHTML = home.content;
  }
})();
