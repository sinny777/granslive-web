var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

//Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

//Bootstrap the application, configure models, datasources and middleware.
//Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
if (err) throw err;

//start the server if `$ node server.js`
if (require.main === module)
app.start();
});

/*
 * body-parser is a piece of express middleware that
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body`
 *
 */
var bodyParser = require('body-parser');

/**
 * Flash messages for passport
 *
 * Setting the failureFlash option to true instructs Passport to flash an
 * error message using the message given by the strategy's verify callback,
 * if any. This is often the best approach, because the verify callback
 * can make the most accurate determination of why authentication failed.
 */
var flash      = require('express-flash');

//attempt to build the providers/passport config
var config = {};
try {
  config = require('../server/providers.json');
} catch (err) {
  console.trace(err);
  process.exit(1); // fatal
}

//to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());
// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
  extended: true
}));

//The access token is only available after boot
app.middleware('auth', loopback.token({
  model: app.models.accessToken
}));

app.middleware('session:before', loopback.cookieParser(app.get('cookieSecret')));
app.middleware('session', loopback.session({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true
}));

passportConfigurator.init();

//The access token is only available after boot
app.use(loopback.token({
  model: app.models.accessToken
}));

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

//var loginEndpoint = require('../server/app/endpoints/loginEndpoint.js')(app);
//require('../server/app/routes.js')(app, ensureLoggedIn, loginEndpoint); 

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};


