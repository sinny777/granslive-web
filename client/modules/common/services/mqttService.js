
define(['angular'], function (angular) {
    "use strict";

  var factory = function ($http, $q, CONFIG) {
    	
	var subscribeTopic = "";
	var mqttClient;
	var mqttOptions = {};
	
	var mqttService = {};
	
		mqttService.connectMQTT = function(options){
			mqttOptions = options;
			mqttClient = new Paho.MQTT.Client(options.hostname, 8883, options.clientId);
			
			mqttClient.onMessageArrived = options.onMqttMessageArrived;
			mqttClient.onConnectionLost = function(e){
				console.log("Connection Lost at " + Date.now() + " : " + e.errorCode + " : " + e.errorMessage);
				this.connect(connectOptions);
			}
			
			var connectOptions = new Object();
			connectOptions.keepAliveInterval = 3600;
			connectOptions.useSSL=true;
			connectOptions.userName=options.api_key;
			connectOptions.password=options.auth_token;

			connectOptions.onSuccess = function() {
				console.log("MQTT connected to host: "+mqttClient.host+" port : "+mqttClient.port+" at " + Date.now());
				options.mqttConnectSuccess();
			}

			connectOptions.onFailure = function(e) {
				console.log("MQTT connection failed at " + Date.now() + "\nerror: " + e.errorCode + " : " + e.errorMessage);
			}

			console.log("about to connect to " + mqttClient.host);
			mqttClient.connect(connectOptions);
			
	    };
	    
	    mqttService.subscribe = function(subscribeTopic, subscribeOptions){
	    	console.log("IN mqttService.subscribe " + subscribeTopic);
	    	mqttClient.subscribe(subscribeTopic, subscribeOptions);
	    };
	    
	    mqttService.publishToMqtt = function(publishToTopic, msgToPublish){
	    	console.log('IN mqttClient.publishToMqtt, publishToTopic: ', publishToTopic, ', msgToPublish: ', msgToPublish);
	          var message = new Paho.MQTT.Message(JSON.stringify(msgToPublish));
	          message.destinationName = publishToTopic;
	          if(!mqttClient.host){
	              try{
	            	  mqttOptions.mqttConnectSuccess = function(){
	            		  mqttClient.send(msgToPublish);
	            	  };
	            	  mqttService.connectMQTT(mqttOptions);
	              }catch(err){
	                  console.log('Error: >>> ' +JSON.stringify(err));
	              }
	          }else{
	              try{
	                  console.log('Going to publish message: >>> ' +message);
	                  mqttClient.send(message);
	              }catch(err){
	                  console.log('Error: >>> ', err);
	              }

	          }
	    };
		
		return mqttService;
  }
  

	factory.$inject = ['$http', '$q', 'CONFIG'];
	return factory;
});

