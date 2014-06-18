var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');
var moment = require('moment');

var createVisDataItem = function (item) {
  var duration = item.Event.ElapsedMilliseconds || 0;
  var start = moment(item.CreatedDateTime)
      .subtract(duration, 'milliseconds');

  return {
    id: item._id,
    group: item.Context.RequestId,
    content: item.Event._t || item.Event.type,
    start: start,
    end: item.CreatedDateTime,
    type: duration > 0 ? 'rangeoverflow' : 'point'
  };
};

exports.list = function (req, res) {

  MongoClient.connect(process.env.AUDIT_MONGODB_CONNECTIONSTRING, function (err, db) {
    if (err) {
      return res.send(500, err);
    }

    var collection = db.collection(process.env.AUDIT_MONGODB_COLLECTION);
    return collection
        .find()
        .toArray(function (err, items) {
          if (err) {
            return res.send(500, err);
          }

          return res
              .json(_(items)
                  .chain()
                  .map(createVisDataItem)
                  .valueOf());
        });
  });

};