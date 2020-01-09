const amqp = require('amqplib/callback_api');

const etcd = require('./etcd');

const watcher = etcd.watcher('cloud_amqp_url');

watcher.on('change', (res) => {
	start(res.node.value);
}); // Triggers on all changes

etcd.get('cloud_amqp_url', (err, res) => {
	if (err) {
		console.log(err);

		return;
	}

	start(res.node.value);
});

let amqpConnection = null;

const start = (cloudAmqpUrl) => {
	amqp.connect(cloudAmqpUrl + '?heartbeat=60', function (err, conn) {
		if (err) {
			console.error('[AMQP]', err.message);

			return setTimeout(start, 1000);
		}

		conn.on('error', function (err) {
			if (err.message !== 'Connection closing') {
				console.error('[AMQP] conn error', err.message);
			}
		});

		conn.on('close', function () {
			console.error('[AMQP] reconnecting');
			return setTimeout(start, 1000);
		});

		console.log('[AMQP] connected');

		amqpConnection = conn;

		startPublisher();
		startWorker();
	});
};

let publishChannel = null;

let offlinePublishQueue = [];

function startPublisher() {
	amqpConnection.createConfirmChannel(function (err, channel) {
		if (closeConnectionOnError(err)) return;

		channel.on('error', function (err) {
			console.error('[AMQP] channel error', err.message);

		});

		channel.on('close', function () {
			console.log('[AMQP] channel closed');
		});

		publishChannel = channel;

		while (true) {
			let m = offlinePublishQueue.shift();

			if (!m) break;

			publish(m[0], m[1], m[2]);
		}
	});
}

const QUEUE_NAME = 'metrics';

// A worker that acknowledges messages only if processed successfully
function startWorker() {
	amqpConnection.createChannel(function (err, channel) {
		if (closeConnectionOnError(err)) return;

		channel.on('error', function (err) {
			console.error('[AMQP] channel error', err.message);
		});

		channel.on('close', function () {
			console.log('[AMQP] channel closed');
		});

		channel.prefetch(10);

		channel.assertQueue(QUEUE_NAME, { durable: true }, function (err, _ok) {
			if (closeConnectionOnError(err)) return;

			channel.consume(QUEUE_NAME, processMessage, { noAck: false });

			console.log(`[AMQP] worker is listening for messages on queue ${QUEUE_NAME}`);
		});

		function processMessage(message) {
			work(message, function (ok) {
				try {
					if (ok)
						channel.ack(message);
					else
                        channel.reject(message, true);
				} catch (ex) {
					closeConnectionOnError(ex);
				}
			});
		}
	});
}

function work(message, callback) {
	if (onMessageReceivedCallback) onMessageReceivedCallback(message);

	callback(true);
}

function closeConnectionOnError(err) {
	if (!err) return false;

	console.error('[AMQP] error', err);

	amqpConnection.close();

	amqpConnection = null;

	return true;
}

function closeConnection() {
	console.error('[AMQP] connection closed');

	amqpConnection.close();

	amqpConnection = null;

	return true;
}

let onMessageReceivedCallback;

const setCallbackOnMessageReceived = function (callback) {
	onMessageReceivedCallback = callback;
};

module.exports = setCallbackOnMessageReceived;