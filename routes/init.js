module.exports = function (server) {
    require('./metricsRoutes')(server);

    require('./infoRoutes')(server);
    require('./healthRoutes')(server);
};