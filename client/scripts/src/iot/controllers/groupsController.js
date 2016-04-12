define(function () {
    'use strict';

  function ctrl($rootScope, $scope, Group, Member){
	  
	  $scope.display = 'groups';
	  $scope.groups = [];
	  $scope.selectedGroup = {};
	  $scope.member = {};
	  $scope.showAddMember = '';
	  
	  $scope.initGroups = function(){
		  $scope.fetchAndShowGroups();
	  }
	  
	  $scope.fetchAndShowGroups = function(){
		  console.log('IN fetchAndShowGroups: ', $scope.groups.length);
		  $scope.selectedGroup = {};
		  if($scope.groups.length == 0){
			  $scope.fetchGroups();
		  }else{
			  $scope.display = "groups";
		  }
	  };
	  
	  $scope.showAddNewGroupPanel = function(){
		  console.log('IN showAddNewGroupPanel: ');
		  $scope.selectedGroup = {};
		  $scope.display = "saveGroupPanel";
	  };
	  
	  $scope.showUpdateGroupPanel = function(group){
		  console.log('IN showUpdateGroupPanel for Group: ', group);
		  $scope.selectedGroup = group;
		  $scope.display = "saveGroupPanel";
	  };
	  
	  
    $scope.fetchGroups = function(){
    	console.log('IN fetchGroups for Place >>>>>>>>>> ', $scope.selectedPlace);
    	$scope.showAddMember = '';
    	var findReq = {filter: {where: {"placeId": $scope.selectedPlace.id}}};
    	console.log(findReq);
    	$rootScope.loadingScreen.show();
    	$scope.groups = Group.find(findReq,
    			  function(list) { 
    				  $rootScope.loadingScreen.hide();
    				  $scope.groups = list;
    				  $scope.display = 'groups';
    				  if($scope.groups && $scope.groups.length == 1){
						  $scope.selectedGroup = $scope.groups[0];
					  } 
    				  
    				  angular.forEach($scope.groups, function(group) {
    						  $scope.fetchMembers(group);
    					});    				  
    			  },
	    		  function(errorResponse) { 
    				  console.log(errorResponse);
    				  $scope.display = 'groups';
    				  $rootScope.loadingScreen.hide();
    			  });
    };
    
    $scope.fetchMembers = function(group){
    	console.log('IN fetchMembers for Group >>>>>>>>>> ', group);
    	$scope.showAddMember = '';
    	var findReq = {filter: {where: {"placeId": $scope.selectedPlace.id, "groupId":group.id}}};
    	console.log(findReq);
    	$rootScope.loadingScreen.show();
    	group.members = [];
    	group.members = Member.find(findReq,
    			  function(list) { 
    				  $rootScope.loadingScreen.hide();
    				  group.members = list;
    				  $scope.display = 'groups';
    				  console.log("Group With Members: >>>> ", group);
    			  },
	    		  function(errorResponse) { 
    				  console.log(errorResponse);
    				  $scope.display = 'groups';
    				  $rootScope.loadingScreen.hide();
    			  });
    };
    
    $scope.saveGroup = function(){
    	console.log('$rootScope.currentUser: >> ', $rootScope.currentUser);
    	console.log('$scope.selectedPlace: >> ', $scope.selectedPlace);
    	$scope.selectedGroup.ownerId = $scope.ownerId;
    	$scope.selectedGroup.placeId = $scope.selectedPlace.id;
    	console.log('IN saveGroup: >>>>>', $scope.selectedGroup);
    	$rootScope.loadingScreen.show();
    	$scope.selectedGroup = Group.create($scope.selectedGroup,
		  function(group) { 
    		$rootScope.loadingScreen.hide();
			$scope.selectedGroup = group;
			console.log('GROUP SAVED: >>>> ', group);
			$scope.showGroups();
		  },
		  function(errorResponse) {
			  $rootScope.loadingScreen.hide();
			  console.log(errorResponse);
			  $scope.showGroups();
		  });
    };
    
    $scope.showAddMemberPanel = function(group){
    	$scope.selectedGroup = group;
    	$scope.showAddMember = group.id;
    	$scope.member = {groupId: group.id, placeId: $scope.selectedPlace.id, status: 'invited'};
    	console.log('IN showAddMemberPanel: ', $scope.showAddMember);
    };
    
    $scope.inviteNewMember = function(){
    	console.log('Member to invite: >>>', $scope.member);
    	
    	$scope.selectedGroup = Member.create($scope.member,
    			  function(member) { 
    	    		$rootScope.loadingScreen.hide();
    	    		$scope.member = member;
    				console.log('MEMBER INVITED: >>>> ', member);
    				$scope.showGroups();
    			  },
    			  function(errorResponse) {
    				  $rootScope.loadingScreen.hide();
    				  console.log(errorResponse);
    				  $scope.showGroups();
    			  });
    };
    
    $scope.cancelAddMember = function(){
    	console.log('In cancelAddMember: >>>');
    	$scope.selectedGroup = {};
    	$scope.showAddMember = '';
    };
    
  }
  
  ctrl.$inject = ['$rootScope', '$scope', 'Group', 'Member'];
  return ctrl;

});

