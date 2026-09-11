/*
    Connections toggle on the start screen.
    Multi uses the dlThreads/ulThreads set in index.html (default 6), Single uses one connection.
    The engine reads dlThreads/ulThreads when each test phase starts, so switching them here is enough.
    Load this after app-2.5.4.min.js so it runs after the UI SVG has been inlined.
*/
var connMultiDl = dlThreads;
var connMultiUl = ulThreads;
window.addEventListener("load", initConnections);

function initConnections() {
  // "XHR"/"X" in the URL already set the connection count, so only restore the saved choice without it.
  if (!/[?&]x(hr)?=/i.test(location.search) && getCookieValue("connections") === "single") {
    dlThreads = ulThreads = 1;
  }
  var toggles = document.getElementsByClassName("connToggle");
  for (var i = 0; i < toggles.length; i++) {
    toggles[i].addEventListener("click", onConnectionsClick);
  }
  renderConnections();
}

function onConnectionsClick(e) {
  var el = e.target;
  while (el && !(el.getAttribute && el.getAttribute("data-conn"))) {
    el = el.parentNode;
  }
  if (!el) {
    return;
  }
  var choice = el.getAttribute("data-conn");
  if (choice === "toggle") {
    choice = dlThreads == 1 ? "multi" : "single";
  }
  if (choice === "single") {
    dlThreads = ulThreads = 1;
  } else {
    dlThreads = connMultiDl;
    ulThreads = connMultiUl;
  }
  createCookie("connections", choice, 365);
  renderConnections();
}

function renderConnections() {
  var mode = dlThreads == 1 ? "single" : "multi";
  var toggles = document.getElementsByClassName("connToggle");
  for (var i = 0; i < toggles.length; i++) {
    toggles[i].setAttribute("class", "connToggle is-" + mode);
  }
}
