var Robot = require('./robot');

function Manager(total){
  this.offlineRobots = new Array();
  this.logingRobots = new Array();
  this.onlineRobots = new Array();

  for(var i=0; i<total; ++i) {
    var robot = new Robot(i);
    this.offlineRobots.push(robot);
  }
}

function find(array, obj){
  for(var i=0; i<array.length; ++i){
    if(array[i] === obj){
      return i;
    }
  }
  return -1;
}

Manager.prototype.turnon = function turnon(num){
  for(var i=0; i<num && this.offlineRobots.length>0; ++i){
    var robot = this.offlineRobots.pop();
    (function loging(robot_){
      robot_.logon(function(){
        var index = find(logingRobots, robot_);
	if(index != -1){
	  this.logingRobots.splice(index, 1);
	  this.onlineRobots.push(robot_);
	}
      });
    })(robot);
    this.logingRobots.push(robot);
  }
  console.log(this.offlineRobots);
}

Manager.prototype.turnoff = function(num){
  for(var i=0; i<num && this.onlineRobots.length>0; ++i){
    var robot = this.onlineRobots.shift();
    robot.logoff();
    offlineRobots.push(robot);
  }
}

var manager = new Manager(10);
manager.turnon(10);
