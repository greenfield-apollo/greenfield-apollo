var app = require('./server/server.js');

// start app ===============================================
app.listen(app.port);
console.log('Habit Trainer listening on port ' + app.port);
