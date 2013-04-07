var net = require('net');
var protobuf = require('protobuf_for_node.node');
var fs = require('fs');
var util = require('util');
var events = require('events');

var schema = new protobuf.Schema(fs.readFileSync('msg.desc'));
var CSMsg = schema['pb.CSMsg'];
var SCMsg = schema['pb.SCMsg'];

function Netlayer() {
  this.socket = new net.Socket();
  this.buffer = new Buffer(8 * 1024 * 1024);
  this.actLen = 0;
  this.needLen = 0;

  var obj = this;
  obj.socket.on('data', function onData(data){
    data.copy(obj.buffer, obj.actLen);
    obj.actLen += data.length;

    if(obj.actLen < 4)
      return;
    
    obj.needLen = obj.buffer.readUInt32LE(0) + 4;
    if(obj.actLen < obj.needLen)
      return;
    
    var scmsg = SCMsg.parse(obj.buffer.slice(4, obj.needLen));
    obj.emit('scmsg', scmsg);
    
    obj.buffer.copy(obj.buffer, 0, obj.needLen, obj.actLen);
    obj.actLen = obj.actLen - obj.needLen;
  });
}

util.inherits(Netlayer, events.EventEmitter);

Netlayer.prototype.connect = function connect(port, host, callback){
  this.socket.connect(port, host, callback);
}
  
Netlayer.prototype.disconnect = function disconnect(){
  this.socket.end();
}

Netlayer.prototype.sendMsg = function sendMsg(csmsg){
  var data = CSMsg.serialize(csmsg);
  var len = new Buffer(4);
  len.writeUInt32LE(data.length, 0);

  this.socket.write(len);
  this.socket.write(data);
}

module.exports = Netlayer;

//var netlayer = new Netlayer();
//
//netlayer.on('scmsg', function(scmsg){
//  console.log(scmsg);
//});
//
//netlayer.connect(9876, 'localhost', function(){
//  netlayer.sendMsg({
//    id: "ID_CSLogin",
//    login: {
//      playerId: 1
//    }
//  });
//});
