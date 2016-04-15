
define(['angular'], function (angular) {
    "use strict";

  var factory = function (CONFIG) {
	  
	 var client = new Paho.MQTT.Client(CONFIG.MQTT.broker, Number(CONFIG.MQTT.port), '/ws', 'gl_' + parseInt(Math.random() * 100, 10));

	// set callback handlers
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;

	// connect the client
	client.connect({onSuccess:onConnect});

	  var mqttCliet = {};
	  
	  mqttCliet.connectToMqtt = function(onMqttMessageArrived, onMqttConnectionLost, mqttConnectSuccess){
          try{
              if(!mqttClient.host){
                  mqttClient = new Paho.MQTT.Client(MQTT_BROKER, Number(9001), '/ws', 'gl_' + parseInt(Math.random() * 100, 10));
                  mqttClient.onConnectionLost = onMqttConnectionLost;
                  mqttClient.onMessageArrived = function (message){
                  	console.log(message);
                  	onMqttMessageArrived(message);
                  };

                  var options = {
                      //timeout: 3,
                      onSuccess: mqttConnectSuccess,
                      onFailure: function (message) {
                          console.log("Connection failed: " + message.errorMessage);
                          mqttClient = {};
                      }
                  }

                  mqttClient.connect(options);
              }else{
              	console.log('MQTT ALREADY CONNECTED >>>>>>>>> ');
              	mqttConnectSuccess();
              	mqttClient.onMessageArrived = function (message){
                  	onMqttMessageArrived(message);
                  };
              }
          }catch(err){
              console.log('Error while connecting MQTT: >>> ' +JSON.stringify(err));
              mqttClient = {};
          }
      };

      mqttCliet.disConnectFromMqtt = function(){
          try{
              if(mqttClient.host){
                 mqttClient.disconnect();
              }
          }catch(err){
              console.log('Error: >>> ' +JSON.stringify(err));
          }
      };

      mqttCliet.publishToMqtt =  function(publishToTopic, msgToPublish, onMqttMessageArrived){
          var message = new Paho.MQTT.Message(msgToPublish);
          message.destinationName = publishToTopic;
          if(!mqttClient.host){
              try{
                  mqttClient = new Paho.MQTT.Client(MQTT_BROKER, Number(80), '/ws', 'gl_' + parseInt(Math.random() * 100, 10));
                  mqttClient.onConnectionLost = this.onConnectionLost;
                  mqttClient.onMessageArrived = onMqttMessageArrived;

                  var options = {
                      //timeout: 3,
                      onSuccess: function(){
                          mqttClient.send(message);
                          subscribeToMqtt('granslive/iot/+/board');
                      },
                      onFailure: function (message) {
                          alert("Connection failed: " + message.errorMessage);
                      }
                  }

                  mqttClient.connect(options);
              }catch(err){
                  console.log('Error: >>> ' +JSON.stringify(err));
              }
          }else{
              try{
                  console.log('Going to publish message 2: >>> ' +message);
                  mqttClient.send(message);
              }catch(err){
                  console.log('Error: >>> ' +JSON.stringify(err));
              }

          }
      };

      mqttCliet.subscribeAfterConnect =  function() {
          // Once a connection has been made, make a subscription and send a message.
          console.log("Connected to MQTT server ");
          mqttClient.subscribe("granslive/iot/+/board");
      };

      mqttCliet.publishAfterConnect =  function(message) {
          // Once a connection has been made, make a subscription and send a message.
          console.log('Going to publish message 2: >>> ' +message);
          mqttClient.send(message);
      };

      mqttCliet.subscribeToMqtt =  function(subscribeToTopic){
          if(!mqttClient.host){
              throw "No Connection with MQTT";
          }else{
              try{
                  console.log('Going to subscribe topic: >>> ' +subscribeToTopic);
                  mqttClient.subscribe(subscribeToTopic);
              }catch(err){
                  console.log('Error: >>> ' +JSON.stringify(err));
              }
          }
      };
      
      mqttCliet.unsubscribeToMqtt =  function(subscribeToTopic){
          if(!mqttClient.host){
              throw "No Connection with MQTT";
          }else{
              try{
                  console.log('Going to unsubscribe topic: >>> ' +subscribeToTopic);
                  mqttClient.unsubscribe(subscribeToTopic);
              }catch(err){
                  console.log('Error: >>> ' +JSON.stringify(err));
              }
          }
      };
	  

	  return mqttClient;
	
  }

	factory.$inject = ['CONFIG', '$http'];
	return factory;
});

