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
			res.send(200);
		} else {
			res.send(500);
		}
	},
	healthCheckOnEveryRequest(req, res, next) {
		if (!shouldApplicationBeRestarted) {
			next();
		} else {
			res.send(500);
		}
	},
	readinessCheck(req, res, next) {
		if (DBConnected) {
			res.send(200);
		} else {
			res.send(500);
		}
	},
	readinessCheckOnEveryRequest(req, res, next) {
		if (DBConnected) {
			next();
		} else {
			res.send(500);
		}
	}
};