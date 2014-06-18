// DOM element where the Timeline will be attached
var container = document.getElementById('mytimeline');

$.getJSON("/timeline", function (data) {
  var options = {};
  var timeline = new vis.Timeline(container, data, options);
});