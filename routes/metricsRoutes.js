const MetricsApi = require('../api/metricsApi');

const initRoutes = function (server) {
    server.get('/', async function (req, res, next) {
        const metricsForService = await MetricsApi.getAllMetrics();

        if (metricsForService) {
            res.json({
                success: true,
                data: metricsForService
            });
        } else {
            res.json(500, {
                success: false,
                message: 'Metrics not found'
            });
        }

        return next();
    });

    server.get('/:serviceName', async function (req, res, next) {
        const metricsForService = await MetricsApi.getMetricsForService(req.params.serviceName);

        if (metricsForService) {
            res.json({
                success: true,
                data: metricsForService
            });
        } else {
            res.json(500, {
                success: false,
                message: 'Metrics not found'
            });
        }

        return next();
    });
};

module.exports = initRoutes;