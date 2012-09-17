var sys = require("sys"),
    express = require('express'),
    app = express(),
    ws = require("ws");

app.configure(function()
{
    app.set('views',__dirname);
    app.set('view engine', 'jade');
    app.use(express.static(__dirname));
    app.engine('html', require('jade').renderFile);
});

app.get('/', function(request, response)
{
    response.sendfile('recorder.html');
});

app.get('/show',function(request,response)
{
    response.sendfile('display.html');
});

app.listen(8000, '192.168.0.101');

var senders=[];
var receiverServer = new ws.Server({host:"192.168.0.101",port:8080});
var senderServer= new ws.Server({host:"192.168.0.101",port:8008});

receiverServer.on('error',function(error){ console.log("receiver error "+error)} );
senderServer.on('error',function(error){ console.log("sender error "+error)} );

var handleSenderConnection = function(sender)
{
    senders.push(sender);
    console.log("Sender "+senders.length+" has been added to senders list");
}

var handleReceiverConnection = function(receiver)
{
    receiver.on('message', handleReceiverMessage);
    receiver.on('close', handleReceiverClose);
}

var handleReceiverMessage = function(data)
{
    senders.forEach(function(sender)
    {
        if(sender.readyState===1)
        {
            sender.send(data);
        };
    });
}

var handleReceiverClose=function()
{
    //todo: implement
}

receiverServer.on('connection', handleReceiverConnection);
senderServer.on('connection', handleSenderConnection);

console.log("Listening on port 8080");
