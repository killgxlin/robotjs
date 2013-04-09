var Netlayer = require('./netlayer');
var timer = require('timers');

function Robot(playerid){
  this.playerid = playerid;
  this.netlayer = new Netlayer();
  var robot = this;
  this.netlayer.on('scmsg', function handleSCMsg(scmsg_){
    function actionFinished(){
      timer.setTimeout(function(){
        robot.nextAction(actionFinished);
      }, 1000);
    }
    switch(scmsg_.id){
      case 'ID_SCCreatePlayer':
        robot.createPlayer();
        break;
      default:
        robot.nextAction(actionFinished);
        break;
    }
  });
}

Robot.prototype.nextAction = function nextAction(callback){
  if(Math.random()<0.2){
    this.changeScene();
    callback();
    return;
  }
  if(Math.random()<0.5){
    this.move();
    callback();
    return;
  }
  if(Math.random()<0.5){
    this.chat();
    callback();
    return;
  }
}

Robot.prototype.logon = function logon(){
  var robot = this;
  robot.netlayer.connect(9876, 'localhost', function(){
    robot.netlayer.sendMsg({
      id: "ID_CSLogin",
      login: {
        playerId: robot.playerid
      }
    });
  });
}

Robot.prototype.logoff = function logoff(){
  this.netlayer.disconnect();
}

Robot.prototype.createPlayer = function createPlayer(){
  this.netlayer.sendMsg({
    id: "ID_CSCreatePlayer",
    createPlayer: {
      name: "player"+this.playerid,
      protoId: 1
    }
  });
}

Robot.prototype.changeScene = function changeScene(){
  this.netlayer.sendMsg({
    id: "ID_CSChangeScene",
    changeScene: {
      dstSceneid: 2
    }
  });
}

Robot.prototype.chat = function chat(){
  this.netlayer.sendMsg({
    id: "ID_CSChat",
    chat: {
      channel: "EChatChannelT_World",
      content: "hello"
    }
  });
}

Robot.prototype.move = function move(){
  this.netlayer.sendMsg({
    id: "ID_CSMove",
    move: {
      playerMove: {
	dstX: 200,
	dstY: 200
      }
    }
  });
}

module.exports = Robot;

var robot = new Robot(1);
robot.logon();
