const hue = require('huejay');

module.exports = function(Server) {
  const utils = require('./utils');
  Server.express.use(async (req, res, next) => {
    if (Object.keys(req.session.bridges).length === 0) {
      req.session.bridges = await loadBridges();
    }
    next();
  });

  require('./bridge')(Server);
  require('./lights')(Server);

}
