// Copyright 2014–2017 Sander Dijkhuis <mail@sanderdijkhuis.nl>

(function producties() {
  "use strict";

  var CLASSES = { "Film / tv": "film_tv", Toneel: "toneel" };

  main();

  function main() {
    fetchJSON(
      str(BASE, "/posts?type=jetpack-portfolio&number=100"),
      onPortfolioLoad
    );
  }

  function onPortfolioLoad(portfolio) {
    var container = document.getElementById("productions");
    var fragment = document.createDocumentFragment();

    portfolio.posts
      .map(project)
      .sort(function(a, b) {
        return b.year - a.year;
      })
      .map(projectNode)
      .forEach(appendTo(fragment));
    container.innerHTML = "";
    container.appendChild(fragment);

    fancybox(
      ".productions .thumbnail a, .productions .info a, .productions .gallery a",
      { closeClick: true }
    )
      .filter(".gallery a")
      .hide();

    fancybox(".productions a.trailer, .productions a.video", {
      helpers: { media: {} }
    });

    createFilterBar();
  }

  function project(post) {
    var content = element("div", { innerHTML: post.content });
    var project = {
      title: post.title,
      year: parseInt(
        Object.keys(post.terms["jetpack-portfolio-tag"])
          .filter(function(t) {
            return t.substr(0, 5) === "jaar-";
          })[0]
          .substr(5),
        10
      ),
      types: Object.keys(post.terms["jetpack-portfolio-type"]),
      content: content,
      pictures: [],
      videos: []
    };
    var children = array(content.children).map(function(node) {
      return {
        node: node,
        imageNodes: array(node.getElementsByTagName("img")),
        iframeNodes: array(node.getElementsByTagName("iframe"))
      };
    });

    children.filter(hasAny("imageNodes")).forEach(function(child) {
      var captionNode = child.node.getElementsByTagName("figcaption")[0];
      child.imageNodes
        .map(function(node) {
          return Object.assign(
            { src: node.src.split("?")[0] },
            captionNode ? { caption: captionNode.innerText } : null
          );
        })
        .forEach(pushTo(project.pictures));
      content.removeChild(child.node);
    });

    children.filter(hasAny("iframeNodes")).forEach(function(child) {
      child.iframeNodes.map(get("src")).forEach(pushTo(project.videos));
      content.removeChild(child.node);
    });

    return project;
  }

  function projectNode(project, i) {
    var id = str("project-", i);
    return element(
      "article",
      { className: project.types.map(getFrom(CLASSES)).join(" ") },
      [
        element("div", { className: "thumbnail" }, [
          project.pictures.length === 0
            ? null
            : element(
                "a",
                {
                  href: str(project.pictures[0].src, "?w=800&h=800"),
                  title: project.pictures[0].caption,
                  rel: id
                },
                [
                  element("img", {
                    src: str(project.pictures[0].src, "?w=150&h=150")
                  })
                ]
              )
        ]),
        element("div", { className: "description" }, [
          element("header", {}, [
            element("h1", { textContent: project.title }),
            element("h2", {
              textContent:
                project.types.map(getFrom(CLASSES)).indexOf("toneel") === -1
                  ? project.year
                  : str(project.year, "–", project.year + 1)
            })
          ]),
          element("div", { className: "extra" }, [project.content]),
          element(
            "p",
            { className: "gallery" },
            project.pictures.slice(1).map(function(picture, i) {
              return element("a", {
                href: picture.src,
                title: picture.caption,
                textContent: i + 2,
                rel: id
              });
            })
          ),
          element(
            "p",
            { className: "video" },
            project.videos.map(function(video, i) {
              ({ video: video });
              return element("a", {
                className: "video",
                href: video,
                textContent: i === 0 ? "video" : str("video ", i + 1)
              });
            })
          )
        ])
      ]
    );
  }

  function createFilterBar() {
    var productions = jQuery(".all.productions");
    var filters = [
      ["", "Alle"],
      ["toneel", "Toneel"],
      ["film_tv", "Film & tv"]
    ];
    var toggle = jQuery("<div>")
      .addClass("toggle")
      .html(
        jQuery.map(filters, function(filter) {
          return (
            '<div class="option" data-type="' +
            filter[0] +
            '">' +
            filter[1] +
            "</div>"
          );
        })
      )
      .insertBefore(productions)
      .find("div")
      .click(function(e) {
        var option = jQuery(e.target);
        option
          .addClass("active")
          .siblings()
          .removeClass("active");
        applyFilter(option.attr("data-type"));
      })
      .first()
      .click();
    function applyFilter(type) {
      type
        ? productions
            .find("." + type)
            .show()
            .siblings(":not(." + type + ")")
            .hide()
        : productions.find(".toneel, .film_tv").show();
    }
  }
})();
