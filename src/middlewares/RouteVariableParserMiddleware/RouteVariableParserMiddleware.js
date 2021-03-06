let BaseMiddleware = require('../BaseMiddleware.js');

class RouteVariableParserMiddleware extends BaseMiddleware {
	static run(request, response) {
		let RouteService = require('../../services/RouteService.js');
		let urlParts = RouteService.trimURL(request.url).split('/'),
			routeVariables = {},
			routeVariableNames = request.route.getRouteVariableNames();
		for (let i in routeVariableNames) {
			routeVariables[routeVariableNames[i]] = urlParts[i];
		}
		request.routeVariables = routeVariables;
	}
}

module.exports = RouteVariableParserMiddleware;
