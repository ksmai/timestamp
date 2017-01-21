module.exports = function(express) {
  var api = express.Router();

  api.get('/time/:time', function(req, res) {
    res.send(`wanna convert ${req.params.time}?`);

  });

  api.get('/timediff/:time1/:time2', function(req, res) {
    res.send(`wanna know ${req.params.time1} - ${req.params.time2}`);

  });

  return api;
};
