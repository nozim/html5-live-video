var ws = require("ws");
var app = require("./http_server");
var local_ip='192.168.0.100';

app.listen(8000, local_ip);

var senders={}
var receivers={}
var receiverServer = new ws.Server({host:local_ip, port:8080});
var senderServer= new ws.Server({host:local_ip, port:8008});

receiverServer.on('error',function(error){ console.log("receiver error "+error)} );
senderServer.on('error',function(error){ console.log("sender error "+error)} );

var handleSenderConnection = function(sender)
{
    sender.on('message', function(data)
    {
        message = JSON.parse(data);  
        if(message.command=="INIT")
        {
            senders[message.token] = sender;
            console.log("Sender "+message.token+" has been added to senders list");
        }
    });
}

var handleReceiverConnection = function(receiver)
{
    receiver.on('message', function(data)
    {
        message = JSON.parse(data)
        switch(message.command)
        {
            case "INIT": 
                receivers[message.token] = receiver;
                break;
            case "DATA":
                console.log(message.command);
                for(var key in senders)
                {
                    senders[key].send(data)      
                }
            break;
        }
    });
    receiver.on('close', handleReceiverClose);
}

var handleReceiverClose=function()
{
    //todo: implement
}

receiverServer.on('connection', handleReceiverConnection);
senderServer.on('connection', handleSenderConnection);

console.log("Listening on port 8080");
