'use strict';

module.exports = function(Conversation) {
	
	var bluemix = require('../config/bluemix'),
	CONFIG = require('../config/config').get(),
	watson = require('watson-developer-cloud'),
	fs = require('fs');
	
	/*
	
	ttsCredentials = CONFIG.SERVICES_CONFIG.stt;
	ttsCredentials.version = 'v1';
	var textToSpeech = watson.text_to_speech(ttsCredentials);
	var speakInVoice = "en-US_AllisonVoice";
	
	var speech = gcloud.speech({
		  projectId: 'granslive',
		  keyFilename: '../config/granslive-cd7fa4ae7894.json'
		});
	*/
	
//	var formidable = require('formidable');

	Conversation.remoteMethod('doconversation', {
		    	accepts: [
		            { arg: 'req', type: 'object', http: function(ctx) {
		              return ctx.req;
		            } 
		          }],	
		         http: {path: '/', verb: 'post'},
		         returns: {arg: 'conversation', type: 'object'}
	});
	
	Conversation.doconversation = function(req, cb) {
		console.log("In Conversation.doconversation : >>>> ");
		
		
	  };

};
