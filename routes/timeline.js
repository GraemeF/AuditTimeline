var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');
var moment = require('moment');

var createVisDataItem = function (item) {
  var start = moment(item.CreatedDateTime)
      .subtract(item.Event.ElapsedMilliseconds, 'milliseconds');

  return {
    id: item._id,
    group: item.Context.RequestId,
    content: item.Event._t,
    start: start,
    end: item.CreatedDateTime
  };
};

exports.list = function (req, res) {

  MongoClient.connect(process.env.AUDIT_MONGODB_CONNECTIONSTRING, function (err, db) {
    if (err) {
      return res.send(500, err);
    }

    var collection = db.collection(process.env.AUDIT_MONGODB_COLLECTION);
    return collection
        .find({'Event.ElapsedMilliseconds': {$exists: true}})
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