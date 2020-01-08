const logger = require('../services/logging');

const initRoutes = function (server) {
    server.get('/info', function (req, res, next) {
        res.json({
            name: 'lpp-metrics',
            version: process.env.npm_package_version,
            description: 'Api gateway'
        });

        return next();
    });
};

module.exports = initRoutes;