define(function () {
    'use strict';

  function ctrl($rootScope, $scope, Board){
	  
	  $scope.display = 'boards';
	  $scope.selectedBoard = {};
	  $scope.boards = [];
	  $scope.boardTypes = [{label:"2 Digital Switches", type:"SB_D2"}, 
	                       {label:"6 Digital Switches", type:"SB_D6"},
	                       {label:"4 Analog Switches", type:"SB_A4"},
	                       {label:"6 Digital 4 Analog Switches", type:"SB_D6_A4"}];
	  
	  $scope.initProducts = function(){
		  $scope.fetchAndShowBoards();
	  }
	  
	  $scope.fetchAndShowBoards = function(){
		  console.log('IN fetchAndShowBoards: ');
		  $scope.selectedBoard = {};
			  $scope.fetchBoards();
			  $scope.display = "boards";
	  };
	  
	  $scope.showAddNewBoardPanel = function(){
		  console.log('IN showAddNewBoardPanel: ');
		  $scope.selectedBoard = {};
		  $scope.display = "saveBoardPanel";
	  };
	  
	  $scope.showUpdateBoardPanel = function(group){
		  console.log('IN showUpdateBoardPanel for Board: ', board);
		  $scope.selectedBoard = board;
		  $scope.display = "saveBoardPanel";
	  };
	  
	  
    $scope.fetchBoards = function(){
    	console.log('IN fetchBoards >>>>>>>>>> ');
    	$scope.showAddMember = '';
    	var findReq = {filter: {where: {"status": "inactive"}}};
//    	var findReq = {};
    	$rootScope.loadingScreen.show();
    	var ownerId = $rootScope.currentUser.id;
    	if($rootScope.currentUser.userId){
    		ownerId = $rootScope.currentUser.userId;
    	}
    	
    	var email = $rootScope.currentUser.profile && $rootScope.currentUser.profile.email;
    	if(!email){
    		email = $rootScope.currentUser.email;
    	}
    	console.log("findReq to fetchBoards: >>>", findReq);
    	Board.find(findReq,
    			  function(list) { 
    				  $rootScope.loadingScreen.hide();
    				  $scope.boards = list;
    				  console.log("BOARDS FETCHED: >>> ", $scope.boards);
    				  $scope.display = 'boards';
    			  },
	    		  function(errorResponse) { 
    				  console.log(errorResponse);
    				  $scope.display = 'boards';
    				  $rootScope.loadingScreen.hide();
    			  });
    };
    
    $scope.saveBoard = function(){
    	console.log('$rootScope.currentUser: >> ', $rootScope.currentUser);
    	var ownerId = $rootScope.currentUser.id;
    	if($rootScope.currentUser.userId){
    		ownerId = $rootScope.currentUser.userId;
    	}
    	$scope.selectedBoard.owner = {};
    	$scope.selectedBoard.owner.ownerId = ownerId;
    	
    	var email = $rootScope.currentUser.profile && $rootScope.currentUser.profile.email;
    	if(!email){
    		email = $rootScope.currentUser.email;
    	}
    	
    	$scope.selectedBoard.owner.username = email;
    	console.log('IN saveGroup: >>>>>', $scope.selectedGroup);
    	$rootScope.loadingScreen.show();
    	if(!$scope.selectedBoard.uniqueIdentifier){
    		$scope.selectedBoard.uniqueIdentifier = $scope.generateUUID();
    	}
    	
    	if(!$scope.selectedBoard.type){
    		$scope.selectedBoard.type = 'SB_D6_A4';
    	}
    	
    	$scope.addDevicesBasedOnType($scope.selectedBoard);
    	
    	console.log("$scope.selectedBoard: >>> ", $scope.selectedBoard);
    	
    	$scope.selectedBoard = Board.upsert($scope.selectedBoard,
		  function(board) { 
    		$rootScope.loadingScreen.hide();
			$scope.selectedBoard = board;
			console.log('BOARD SAVED: >>>> ', board);
			$scope.fetchAndShowBoards();
		  },
		  function(errorResponse) {
			  $rootScope.loadingScreen.hide();
			  console.log(errorResponse);
			  $scope.fetchAndShowBoards();
		  });
		  
    };
    
    $scope.generateUUID = function() {
	    var d = new Date().getTime();
	    var uuid = 'yxxx-yxxx-yxxx'.replace(/[xy]/g,function(c) {
	        var r = (d + Math.random()*8)%8 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	    });
	    return uuid.toUpperCase();
	};
    
    $scope.addDevicesBasedOnType = function(board){
    	if(board.type == 'SB_D6_A4'){
    		$scope.addDigitalDevices(board, 6);
    		$scope.addAnalogDevices(board, 4);
    	}
    	if(board.type == 'SB_D6'){
    		$scope.addDigitalDevices(board, 6);
    	}
    	if(board.type == 'SB_A4'){
    		$scope.addAnalogDevices(board, 4);
    	}
    };
    
    $scope.addDigitalDevices = function(board, count){
    	if(!board.devices){
    		board.devices = [];
    	}
    	for(var i = 1; i <= count; i++){
    		board.devices.push({
    			"parentId": board.uniqueIdentifier,
    			"title": "DS"+i,
    			"description": "Digital Switch",
    			"status": "inactive",
    			"value": 0,
    			"type": "bulb",
    			"analog": false
    		});
    	}
    };
    
    $scope.addAnalogDevices = function(board, count){
    	if(!board.devices){
    		board.devices = [];
    	}
    	for(var i = 1; i <= count; i++){
    		board.devices.push({
    			"parentId": board.uniqueIdentifier,
    			"title": "AS"+i,
    			"description": "Analog Switch",
    			"status": "inactive",
    			"value": 0,
    			"type": "bulb",
    			"analog": true
    		});
    	}
    };
    
  }
  
  ctrl.$inject = ['$rootScope', '$scope', 'Board'];
  return ctrl;

});

