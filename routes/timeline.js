var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');
var moment = require('moment');


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

          return res.json(_(items).chain()
              .map(function (item) {
                return _.omit(item, 'StackTrace');
              }).valueOf());
        });
  });

};