var Netlayer = require('./netlayer');
var timer = require('timers');

function Robot(playerid){
  this.playerid = playerid;
  this.netlayer = new Netlayer();
  var robot = this;
  this.netlayer.on('scmsg', function handleSCMsg(scmsg_){
    switch(scmsg_.id){
      case 'ID_SCCreatePlayer':
        robot.createPlayer();
        break;
    }
    console.log('player'+robot.playerid + ' ' + scmsg_.id);
  });
}

Robot.prototype.nextAction = function nextAction(){
  if(Math.random()<0.1){
    this.changeScene();
    return;
  }
  if(Math.random()<0.5){
    this.move();
    return;
  }
  if(Math.random()<0.5){
    this.chat();
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

    timer.setInterval(function(){
      robot.nextAction();
    }, 1000);
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
      dstSceneid: Math.floor(Math.random()*17)
    }
  });
}

Robot.prototype.chat = function chat(){
  this.netlayer.sendMsg({
    id: "ID_CSChat",
    chat: {
      channel: "EChatChannelT_World",
      content: "hello from " + this.playerid 
    }
  });
}

Robot.prototype.move = function move(){
  this.netlayer.sendMsg({
    id: "ID_CSMove",
    move: {
      playerMove: {
	dstX: Math.random()*2440 + 30,
	dstY: Math.random()*286 + 325
      }
    }
  });
}

module.exports = Robot;

// var robot = new Robot(1);
// robot.logon();
