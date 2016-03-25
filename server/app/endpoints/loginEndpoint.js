
module.exports = function(app) {
	
	var User = app.models.user;
	
    return{
          
       // ****** BELOW METHODS FOR WATSON DIALOG AND LANGUAGE CLASSIFIER SERVICES *******
          
    	  loginToApp: function(req,res) {
            console.log('\nIN LoginEndpoint to loginToApp >>>>>>>>>>');
          },
          authAccount(req, res, next) {
        	  console.log('\nIN LoginEndpoint to authAccount >>>>>>>>>>');
        	  console.log(req.user);
        	  console.log(req.accessToken);
        	  console.log(req.body);
          },
          
          logout(req, res, next) {
        	  console.log('\nIN LoginEndpoint to logout >>>>>>>>>>');
        	  req.logout();
        	  res.redirect('/#!/home');
          }
          
        }

}
