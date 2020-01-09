const axios = require('axios');

const logger = require('../services/logging');

const MetricModel = require('../models/Metric');

class MetricsApi {
    static async addNewMetric(metricJson) {
        const metric = JSON.parse(metricJson);

        metric._createdAt = new Date();

        try {
            const createdMetric = await MetricModel.create(metric);

            return createdMetric;
        } catch (ex) {
            logger.error(`[${process.env.npm_package_name}] Adding a metric produced an error: ${JSON.stringify(ex)}`);
        }
    }

    static async getMetricsForService(serviceName) {
        return MetricModel.find({ 'service.name': serviceName });
    }
}

module.exports = MetricsApi;