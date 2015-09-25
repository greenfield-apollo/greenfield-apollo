var app = require('./server/server');

// start app ===============================================
app.listen(app.get('port'));
console.log('Habit Trainer listening on port ' + app.get('port'));
