module.exports = function (router) {
  // FOR TESTING ONLY
  // GET: /api/users/
  router.get('/', function(req, res) {
    res.json({message: 'Authentication successful.'});
  });
};
