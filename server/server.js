var loopback = require('loopback');
var boot = require('loopback-boot');
var serveStatic = require('serve-static');

/*
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var store = new RedisStore({ host: '127.0.0.1' });
if (require.main === module) {
   store.client.unref();
}
*/

var app = module.exports = loopback();

//Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

app.use(serveStatic(__dirname + '/client'));

var bodyParser = require('body-parser');

app.middleware('parse', bodyParser.json({limit: '100mb', type:'application/json'}));
app.middleware('parse', bodyParser.urlencoded({
	limit: '100mb',
	extended: true,
	parameterLimit:50000,
	type:'application/x-www-form-urlencoding'
}));

//Bootstrap the application, configure models, datasources and middleware.
//Sub-apps like REST API are mounted via boot scripts.
bootOptions = { "appRootDir": __dirname, 
        "bootScripts" : [ "../server/boot/endpoints/authEndpoint.js"]};
boot(app, bootOptions, function(err) {
	if (err) throw err;

	try{
		//start the server if `$ node server.js`
		if (require.main === module)
		app.start();
	}catch(err){
		console.log("ERROR: >>> ", err);
	}
});

var flash      = require('express-flash');

//attempt to build the providers/passport config
var config = {};
try {
  config = require('../server/providers.json');
} catch (err) {
  console.log(err);
  process.exit(1); // fatal
}

//The access token is only available after boot
app.middleware('auth', loopback.token({
  model: app.models.accessToken
}));


app.middleware('session:before', loopback.cookieParser(app.get('cookieSecret')));
app.middleware('session', loopback.session({
  secret: 'kitty',
  saveUninitialized: true,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  resave: true,
  httpOnly: true,
  ephemeral: true
}));

passportConfigurator.init();

app.use(loopback.context());
//The access token is only available after boot
app.use(loopback.token({
  model: app.models.accessToken
}));

app.use(function setCurrentUser(req, res, next) {
	
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
    if (!req.accessToken || loopback.getCurrentContext().get('currentUser')) {
        return next();
    }
    app.models.MyUser.findById(req.accessToken.userId, function(err, user) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(new Error('No user with this access token was found.'));
        }

        var loopbackContext = loopback.getCurrentContext();
        if (loopbackContext) {
              loopbackContext.set('currentUser', user);
              console.log('CurrentUser set in loopbackContext successfully >>>>>> ', user);
        }
        next();
     });
});

//We need flash messages to see passport errors
app.use(flash());

passportConfigurator.setupModels({
	  userModel: app.models.user,
	  userIdentityModel: app.models.userIdentity,
	  userCredentialModel: app.models.userCredential,
	  applicationCredentialModel: app.models.applicationCredential
	});

for (var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

//Requests that get this far won't be handled
//by any middleware. Convert them into a 404 error
//that will be handled later down the chain.
//app.use(loopback.urlNotFound());

//The ultimate error handler.
app.use(loopback.errorHandler());

app.start = function() {
  // start the web server
  return app.listen(process.env.VCAP_APP_PORT || 3000, function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};


