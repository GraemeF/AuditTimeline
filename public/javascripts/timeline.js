// DOM element where the Timeline will be attached
var container = document.getElementById('mytimeline');

$.getJSON("/timeline", function (data) {
  var options = {};
  var timeline = new vis.Timeline(container, data, options);
  timeline.setGroups(_(data)
      .chain()
      .map(function (item) {
        return item.group;
      })
      .uniq()
      .map(function (g) {
        return {id: g, content: g};
      })
      .valueOf());
  timeline.fit();
});