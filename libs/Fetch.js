const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');
const FormData = require('form-data');

const defaultHeader = { 'Content-Type': 'application/json' };
const multipartHeader = { 'Content-Type': undefined };

if (!global.logger) {
	global.logger = {
		error(data) {
			console.error(data); // eslint-disable-line no-console
		},
	};
}

/**
 * A wrapper around node-fetch to handle JSON and errors.
 */
class Fetch {
	/**
	 * Fetch a micro service by giving an url and return JSON data..
	 * @param {String} url - The micro service url.
	 * @param {Object} params - URL parameters
	 * @return {Promise} A Promise with the JSON data.
	 */
	static get(url, params = null) {
		const ObjectURL = new URL(url);

		if (params) {
			const ObjectParams = new URLSearchParams(params);
			ObjectURL.search = ObjectParams.toString();
		}

		return fetch(ObjectURL.href, {
			method: 'GET',
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.isBoom) {
					logger.error(json.output);
					return Promise.reject(json);
				}
				return json;
			});
	}

	static post(url, body) {
		return fetch(url, {
			method:  'POST',
			body:    JSON.stringify(body),
			headers: defaultHeader,
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.isBoom) {
					logger.error(json.output);
					return Promise.reject(json);
				}
				return json;
			});
	}

	static put(url, body) {
		return fetch(url, {
			method:  'PUT',
			body:    JSON.stringify(body),
			headers: defaultHeader,
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.isBoom) {
					logger.error(json.output);
					return Promise.reject(json);
				}
				return json;
			});
	}

	static delete(url) {
		return fetch(url, {
			method: 'DELETE',
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.isBoom) {
					logger.error(json.output);
					return Promise.reject(json);
				}
				return json;
			});
	}

	static upload(url, file) {
		const formData = new FormData();

		formData.append('file', file.buffer);
		formData.append('encoding', file.encoding);
		formData.append('mimetype', file.mimetype);
		formData.append('originalname', file.originalname);
		formData.append('size', file.size);

		return fetch(url, {
			method:  'POST',
			body:    formData,
			headers: multipartHeader,
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.isBoom) {
					logger.error(json.output);
					return Promise.reject(json);
				}
				return json;
			});
	}
}

module.exports = Fetch;