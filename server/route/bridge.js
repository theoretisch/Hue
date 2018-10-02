const hue = require('huejay');

module.exports = (Server) => {
  const utils = require('./utils');
  Server.express.get('/bridges', async (req, res) => {
    try {
      req.session.bridges = await utils.loadBridges();
      res.send(req.session.bridges);
    } catch (error) {
      Server.log.error(error.message);
      res.sendStatus(500);
    };
  });

  Server.express.get('/bridge/:id', async (req, res) => {
    try {
      const bridgeIp = req.session.bridges.filter(bridge => bridge.id == req.params.id).shift().ip;
      const client = await utils.connectClient(bridgeIp, Server.config.app.username);

      const bridgeInformation = await client.bridge.get();
      res.send(bridgeInformation);
    } catch (error) {
      Server.log.error(error.message);
      res.sendStatus(500);
    };
  });
}
