let BaseMiddleware=require('../BaseMiddleware.js');

class BodyParserMiddleware extends BaseMiddleware{
	static run(request, response){
		if (['POST', 'PUT', 'UPDATE'].indexOf(request.method)!==-1){
			request.body=require('querystring').parse(request.rawBody);
		}
	}
}

module.exports=BodyParserMiddleware;