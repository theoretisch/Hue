const hue = require('huejay');

module.exports = (Server) => {
  const utils = require('./utils');
  Server.express.get('/bridge/:id/lights', async (req, res) => {
    try {
      const bridgeIp = req.session.bridges.filter(bridge => bridge.id == req.params.id).shift().ip;
      const client = await utils.connectClient(bridgeIp, Server.config.app.username);
      req.session.lights = await client.lights.getAll();

      Server.log.debug('lights', req.session.lights);
      res.send(req.session.lights.map(light => {
        return {id: light.id, type: light.type, uniqueId: light.uniqueId, model: light.model, state: light.state}
      }));
    } catch (error) {
      Server.log.error(error.message);
      res.sendStatus(500);
    };
  });
}
