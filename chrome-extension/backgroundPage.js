//To test this extension. Navigate to chrome://extensions/ 
//Enable developer mode
//load unpacked extension
//select the chrome-extension folder


var DASHBOARD_URL = "http://localhost:8080"

//main extension icon links directly to dashboard
chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.create({
    'url': DASHBOARD_URL
  })
});



var data = {};
var habitsHash = {};


var serverUpdate = function(callback){

  //hardcoded to use publicuser for now
  var api_extension = "/public/users/habits";
  var req = new XMLHttpRequest();

  req.onreadystatechange = function(){
    if(req.readyState === 4 && req.status === 200){
      data = JSON.parse(req.responseText);
      callback();
    }
    if(req.readyState === 4 && req.status === 401){
      console.log("Not authenticated");
    }
  }

  req.open("GET", DASHBOARD_URL + api_extension, true)
  req.send();
}

//public/records/<habit id>
var post = function(habitID) {
  var api_extension = "/public/records/" + habitID;
  var req = new XMLHttpRequest();

  req.onreadystatechange = function(){
    if(req.readyState === 4 && req.status === 200){
      console.log(req);
    }
    if(req.readyState === 4 && req.status === 401){
      console.log("Not authenticated");
    }
  }

  req.open("POST", DASHBOARD_URL + api_extension, true);
  req.send();
  console.log("Hello")
}



//Formats time for use in chrome alarms
var adjustTime = function(timeString){

  var time = Date.parse(timeString);
  var today = new Date();
  today = today.setHours(0,-today.getTimezoneOffset() - 60,0,0);

  alarmTime = today + time;
  //if the alarm time is in the past - add 1 day in ms so it is set for tomorrow 
  if(alarmTime < Date.now()){
    alarmTime = alarmTime + 86400000;
  }
  return alarmTime;
}

var setUpHabits = function(){

  for(var i = 0, len = data.habits.length; i < len; i++){

    var habit = data.habits[i];
    console.log(habit);
    habitsHash[habit._id] = habit;

    if(habit.active){
      var remindTime = adjustTime(habit.reminderTime);
      //alarms with "|" are for habit reminders
      chrome.alarms.create('|' + habit._id, { when: remindTime, periodInMinutes: 5 });
      console.log("alarm created")
      } else {
      chrome.alarms.clear('|' + habit._id);
    }

  }

}

chrome.alarms.onAlarm.addListener(function(alarm) {
  if(alarm.name === "ServerUpdate"){
    console.log("ServerUpdate alarm triggered")
    serverUpdate(setUpHabits);
  }

  // habit reminder
  if(alarm.name.charAt(0) === "|"){
    console.log("reminder alarm triggered");
    var name = alarm.name.slice(1);
    var habit = habitsHash[name];
    console.log(habit);
    chrome.notifications.create(name, {
      type: "basic",
      iconUrl: "./LetterH.png",
      title: habit.habitName,
      message: "Have you completed this?",
      buttons: [{title: "Yes"}, {title: "No"}]
    });
  }
});


chrome.alarms.create("ServerUpdate", {when: Date.now(), periodInMinutes: 10});





//If someone clicks "Yes" on their notification this checks in with the server and adds to their streak.


chrome.notifications.onButtonClicked.addListener(function(id, buttonIndex) {
  if(buttonIndex === 0){
    post(id);
    serverUpdate(setUpHabits);
  }
});
