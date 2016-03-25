module.exports = function(app, ensureLoggedIn, loginEndpoint) {

//    app.get('/auth/login', showClientRequest, loginEndpoint.loginToApp);
    app.get('/auth/account', ensureLoggedIn('/login'), loginEndpoint.authAccount);
//    app.get('/api/Users/logout', ensureLoggedIn('/login'), loginEndpoint.logout);
    
    function showClientRequest(req, res, next) {
        var request = {
            REQUEST : {
                HEADERS: req.headers,
                BODY : req.body
            }
        }
        console.log(request);
        return next();
    }
    
}
