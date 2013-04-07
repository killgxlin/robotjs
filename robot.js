var Netlayer = require('./netlayer');

function Robot(){
  this.netlayer = new Netlayer();
  var robot = this;
  this.netlayer.on('scmsg', function handleSCMsg(scmsg_){
    function actionFinished(){
      timer.delay(1000, function(){
        robot.nextAction(actionFinished);
      });
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
  this.netlayer.connect(9876, 'localhost');
}

Robot.prototype.logoff = function logoff(){
  this.netlayer.disconnect();
}

Robot.prototype.createPlayer = function createPlayer(){
}

Robot.prototype.changeScene = function changeScene(){
}

Robot.prototype.chat = function chat(){
}

Robot.prototype.move = function move(){
}
