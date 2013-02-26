var express = require('express'), app = express();

app.configure(function()
        {
            app.set('views',__dirname);
            app.set('view engine', 'jade');
            app.use(express.static(__dirname));
            app.engine('html', require('jade').renderFile);
        });

app.get('/', function(request, response)
        {
                response.sendfile('views/recorder.html');
        });

module.exports = app;
