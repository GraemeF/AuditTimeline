var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');

exports.list = function (req, res) {

  MongoClient.connect(process.env.AUDIT_MONGODB_CONNECTIONSTRING, function (err, db) {
    if (err) {
      return res.send(500, err);
    }

    var collection = db.collection(process.env.AUDIT_MONGODB_COLLECTION);
    collection
        .find({'Event.ElapsedMilliseconds': {$exists: true}})
        .toArray(function (err, items) {
          if (err) {
            return res.send(500, err);
          }

          return res.json(_(items).chain()
              .map(function (item) {
                return item;//item.Event.hasOwnProperty('ElapsedMilliseconds');
              }).valueOf());
        });
  });

};