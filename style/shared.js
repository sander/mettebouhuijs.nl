// Copyright 2014–2017 Sander Dijkhuis <mail@sanderdijkhuis.nl>

var BASE =
  "https://public-api.wordpress.com/rest/v1.1/sites/mettebouhuijssite.wordpress.com";

var FANCYBOX_DEFAULTS = {
  padding: 0,
  loop: false,
  openSpeed: 100,
  closeSpeed: 100,
  margin: [20, 60, 20, 60]
};

main();

function main() {
  enableTypeform();
}

function enableTypeform() {
  var id = "typef_orm_share",
    script,
    first;

  if (!document.getElementById(id)) {
    script = element("script", {
      id: id,
      src: "https://embed.typeform.com/embed.js"
    });
    first = document.getElementsByTagName("script")[0];
    first.parentNode.insertBefore(script, first);
  }
}

function setPageTitle(title) {
  document.title = str("Mette Bouhuijs | ", title);
}

function fancybox(selector, options) {
  return jQuery(selector).fancybox(jQuery.extend(FANCYBOX_DEFAULTS, options));
}

// General utilities

function fetchJSON(path, callback) {
  jQuery.getJSON({ url: path, dataType: "jsonp", success: callback });
}

// Returns the concatenation of arguments
function str() {
  return array(arguments).join("");
}

function array(v) {
  return Array.prototype.slice.call(v);
}

function firstOrNull(list) {
  return list.length > 0 ? list[0] : null;
}

// Returns <tag {...attrs}>{children}</tag>
function element(tag, attrs, children) {
  var result = document.createElement(tag);
  for (var key in attrs)
    if (attrs.hasOwnProperty(key) && attrs[key]) result[key] = attrs[key];
  if (children) children.filter(notNull).forEach(appendTo(result));
  return result;
}

function appendTo(parent) {
  return function(child) {
    parent.appendChild(child);
  };
}

function pushTo(arr) {
  return function(v) {
    arr.push(v);
  };
}

function hasAny(key) {
  return function(obj) {
    return obj[key].length > 0;
  };
}

function get(key) {
  return function(obj) {
    return obj[key];
  };
}

function getFrom(obj) {
  return function(key) {
    return obj[key];
  };
}

function notNull(v) {
  return v !== null;
}
