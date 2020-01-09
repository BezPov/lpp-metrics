const healthCheckService = require('../services/healthCheck');

const eventEmitter = require('../services/eventEmitter');

const initRoutes = function (server) {
    server.get('/health/live', healthCheckService.healthCheck);

    server.get('/health/ready', healthCheckService.readinessCheck);

    server.get('/health/unhealthy', (req, res, next) => {
        eventEmitter.emit('shouldApplicationBeRestarted', true);

        res.send(200);
    });
};

module.exports = initRoutes;