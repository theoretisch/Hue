const hue = require('huejay');
module.exports = {
  loadBridges: async () => {
    const bridgesDiscovered = await hue.discover();
    const bridgesList = bridgesDiscovered.map(bridge => {
      return {'id': bridge.id, 'ip': bridge.ip};
    });
    return bridgesList;
  },
  connectClient: async function(ip, username) {
    const client = new hue.Client({host: ip, port: 80, username: username});

    const isConnected = await client.bridge.ping();
    if (isConnected) {

      const isAuthenticated = await client.bridge.isAuthenticated();
      if (isAuthenticated) {
        return client;
      }
    }
    return null;
  }
}
