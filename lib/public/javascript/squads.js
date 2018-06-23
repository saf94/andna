"use strict";

var _quickstart = require("../../quickstart");

var exportButton = document.getElementsByClassName("export");

var _loop = function _loop(i) {
  exportButton[i].addEventListener("click", function() {
    var nameToExport =
      exportButton[i].parentNode.previousSibling.previousSibling.previousSibling
        .previousSibling.previousSibling.previousSibling.textContent;
    console.log(nameToExport);
    (0, _quickstart.quickstart)(nameToExport);
  });
};

for (var i = 0; i < exportButton.length; i++) {
  _loop(i);
}
