var ws = require("ws");
var app = require("./http_server");
var local_ip='192.168.0.100';

app.listen(8000, local_ip);

// accept next client 
// add it lo clients pool 
// start broadcasting 
// app get 

var senders=[];
var receiverServer = new ws.Server({host:local_ip, port:8080});
var senderServer= new ws.Server({host:local_ip, port:8008});

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
    message = JSON.parse(data)
    switch(message.command)
    {
        case "INIT": break;
        case "DATA":
            senders.forEach(function(sender)
            {
                if(sender.readyState===1)
                {
                    sender.send(message.data);
                };
            });
            break;
    }
}

var handleReceiverClose=function()
{
    //todo: implement
}

receiverServer.on('connection', handleReceiverConnection);
senderServer.on('connection', handleSenderConnection);

console.log("Listening on port 8080");
