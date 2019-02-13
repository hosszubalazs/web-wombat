# web-wombat
Framework for web services with NodeJS.

With web-wombat, you can easily set up a simple webserver in 1-2 minutes.

# Create new project with web-wombat
```
mkdir wombat-project
cd wombat-project
npm init
npm install web-wombat
mkdir routes
cp node_modules/web-wombat/src/routes/example-routes.js routes/routes.js
```

# Starting a web server with WebWombat
After you successfully installed `WebWombat`, you can easily start a web server.
```
let { WombatServer } = require('web-wombat');

WombatServer.setRoutes(require('./routes/routes.js')).init();
```

Basically `WebWombat` try to load database config and connect to the database, but you can turn this behavior off with calling the `static` `withoutDatabase` method on the `WombatServer` class.

Here is an example:
```
let { WombatServer } = require('web-wombat');

WombatServer.withoutDatabase().setRoutes(require('./routes/routes.js')).init();
```

Basically `WebWombat` listening on `port 8888`, but you can override this with the `static` `setPort` method.

Example to set port for listening:
```
let { WombatServer } = require('web-wombat');

WombatServer.setPort(1222).setRoutes(require('./routes/routes.js')).init();
```

# Connect to database
You can easily connect to a MongoDB database (In the future there will be other database connectors.), but it's not mandatory.
```
mkdir config
cp node_modules/web-wombat/src/config/example-db.js config/db.js
mkdir collections
```
After this, you just need to fill in the parameters in the `config/db.js` file and WebWombat will automatically connect to the database.
When connecting to the database, WebWombat will try to create collections which you created in the `collections` folder. A collection must extends the `BaseCollection` class and must implement the `name` method. The `name` method returns a `string` which will be the collection's name in the database.

# Create routes
If you runned all the commands listed at the Installation section, you have a file at `routes/routes.js` path. In that file, there is the requires required to create routes.
The file contents is the following:
```
let { Route, MiddlewareProvider } = require('web-wombat');

module.exports=[
];
```

You can create routes for specific request methods, like `GET`, `POST`, `PUT`, `UPDATE` and `DELETE`.

Here are some example for the different methods.
GET:
```
Route.get('/', require('../controllers/HomeController/HomeController.js'))
```
POST:
```
Route.post('/', require('../controllers/HomeController/HomeController.js'))
```
PUT:
```
Route.put('/', require('../controllers/HomeController/HomeController.js'))
```
UPDATE:
```
Route.update('/', require('../controllers/HomeController/HomeController.js'))
```
DELETE:
```
Route.delete('/', require('../controllers/HomeController/HomeController.js'))
```

In one controller, you can specifiy any method to serve a request and multiple routes can point to the same controller and to the same method, or to the same controller, but different methods. As the third parameter of the above methods, you can specify a method name, which will be serve the requests. If this parameter isn't specified, then the controller's `serve` method will handle the request to the route.

Here is an example:
```
Route.get('/profile', require('../controllers/UserController/UserController.js'), 'showSelf')
```

You can add middlewares to be runned specific for each route, by specifing an `array` as the fourth parameter, for the methods above. The specified middlewares run synchronously after each other, like they are ordered in the array.

Route with middlewares:
```
Route.get('/profile', require('../controllers/UserController/UserController.js'), 'showSelf', [
	MiddlewareProvider.getMiddleware('AuthenticationMiddleware')
])
```

# Available classes
*These are just those classes and their methods which is accessible from outside of the class and you can do something with them, without the deeper knowledge of the classes.*
## WombatServer
### init([function callback])
Initialize the `WombatServer` to listen on a port for requests.
**callback**
It's a function which will be called after the `WombatServer` started listening.
### withDatabase()
Configure `WombatServer` to load the database configuration and connect to the database on startup.
### withoutDatabase()
Configure `WombatServer` to not try to load the database configuration and don't try to connect to database on startup.
### setPort(mixed port)
Set the port where the WombatServer will listen for requests.
**port**
The port where the `WombatServer` will listen for requests.
### setRoutes(Route[] routes)
Set the routes, which will be redirected to Controllers.
**routes**
An array of `Route` instances.
### setSubfolder(string subfolder)
You can set a path where the `WombatServer` and the dependant classes find the resources relatively to the file, which have been started by `node`.
**subfolder**
A relative path where the required resources can be found relatively to the running script file.

## BaseController
This is the which must be the parent class of each controller.
### view(string filePath, object options, [boolean writeToResponse = true, boolean endResponse = true])
**filePath**
Route to the view, in the `resources/views` folder.
**options**
An object with the variables which will be accessible in the view file.
**writeToResponse**
If this parameter is `true`, the controller will write the builded template to the ServerResponse, else the controller will return a promise which's then branch will receive the builded output as first parameter.
**endResponse**
If this parameter is `true`, the controller will end the response after it's writed the builded template to it. If the `writeToResponse` parameter is `false`, then this parameter will be ignored.
### getMiddleware(string name)
This method will return the request middleware class, not an instance of the class. First this will find the middleware in the `web-wombat` module folder, after that in the projects `middlewares` folder.
**name**
The name of the required `middleware` class.

## ViewProvider
This is the class through which you can build views.
### setSubfolder(string subfolder)
You can set a path where the `ViewProvider` can find the resources relatively to the file, which have been started by `node`.
**subfolder**
A relative path where the required resources can be found relatively to the running script file.