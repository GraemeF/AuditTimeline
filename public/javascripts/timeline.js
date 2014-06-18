// DOM element where the Timeline will be attached
var container = document.getElementById('mytimeline');

var createVisDataItem = function (item) {
  var duration = item.Event.ElapsedMilliseconds || 0;
  var start = moment(item.CreatedDateTime)
      .subtract(duration, 'milliseconds');

  return {
    id: item._id,
    group: item.Context.RequestId,
    content: item.Event._t || item.Event.Type,
    start: start,
    end: item.CreatedDateTime,
    type: duration > 0 ? 'rangeoverflow' : 'point'
  };
};

$.getJSON("/timeline", function (data) {
  var options = {};
  var timeline = new vis.Timeline(container, _(data).chain().map(createVisDataItem).valueOf(), options);
  timeline.setGroups(_(data)
      .chain()
      .uniq(function (item) {
        return item.Context.RequestId;
      })
      .map(function (g) {
        return {
          id: g.Context.RequestId,
          content: JSON.stringify(g.Context, undefined, 2)
        };
      })
      .valueOf());

  var events = _.indexBy(data, '_id');

  function onSelect(properties) {
    console.log('Selected:', _(properties.items).map(function (id) {
      return events[id];
    }).valueOf());
  }

  timeline.on('select', onSelect);
});