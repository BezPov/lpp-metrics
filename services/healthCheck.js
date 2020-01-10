const eventEmitter = require('./eventEmitter');

let shouldApplicationBeRestarted = false;

let DBConnected = false;

eventEmitter.on('DBConnected', (isConnected) => {
	console.log('Database status changed', { isConnected });

	DBConnected = isConnected;
});

eventEmitter.on('shouldApplicationBeRestarted', (restartNeeded) => {
	console.log('shouldApplicationBeRestarted status changed', { restartNeeded });

	shouldApplicationBeRestarted = restartNeeded;
});

module.exports = {
	healthCheck(req, res, next) {
		if (!shouldApplicationBeRestarted) {
			res.json(200, {
				status: 'healthy'
			});
		} else {
			res.json(500, {
				status: 'unhealthy'
			});
		}
	},
	healthCheckOnEveryRequest(req, res, next) {
		if (!shouldApplicationBeRestarted) {
			next();
		} else {
			res.json(500, {
				status: 'unhealthy'
			});
		}
	},
	readinessCheck(req, res, next) {
		if (DBConnected) {
			res.json(200, {
				status: 'ready'
			});
		} else {
			res.json(500, {
				status: 'not_ready'
			});
		}
	},
	readinessCheckOnEveryRequest(req, res, next) {
		if (DBConnected) {
			next();
		} else {
			res.json(500, {
				status: 'ready'
			});
		}
	}
};