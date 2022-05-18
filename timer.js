document.getElementById("button").addEventListener("click", pause);
document.getElementById("saveButton").addEventListener("click", changeLengths);
document.getElementById("enableAlerts").addEventListener("change", updateAlerts);
document.getElementById("enableSounds").addEventListener("change", updateSounds);

var working = true;
var workMinutes = 25;
var breakMinutes = 5;
var distance = workMinutes * 60000;
var completed = 0;
var alarm = new Audio('/sounds/alarm.wav');
var areAlertsEnabled = true;
var areSoundsEnabled = true;
var currentNotificationID = 0;

// SETTINGS
const settingsToggle = document.querySelector('.settings-toggle');
const saveButton = document.querySelector('.save-button');

settingsToggle.addEventListener('click', () => {
    document.body.classList.toggle('settings-open')
})

saveButton.addEventListener('click', () => {
    document.body.classList.remove('settings-open');
})


function notify(message) {

    clearAndNotify = async () => {
        await chrome.notifications.create(
            'notificationID', {
                type: 'basic',
                iconUrl: '../img/tomato.png',
                title: 'Lofidoro',
                message: message,
                priority: 2
            },
            function () {}
        )

        setTimeout(()=>{
            chrome.notifications.clear('notificationID',function () {})
        }, 12000)
    }

    if (areAlertsEnabled) {
        clearAndNotify();
    }
}

// PAUSE
var paused = false;
function pause() {
    if (paused === false) {
        paused = true;
        document.getElementById("lofiVid").src = "";
        document.getElementById("buttonContent").src = "./../img/playButton.png"
    } else {
        paused = false;
        document.getElementById("lofiVid").src = "https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1";
        document.getElementById("buttonContent").src = "./../img/pauseButton.png"
    }
}

// Change durations of periods
function changeLengths() {
    workMinutes = (document.getElementById("userWorkTime").value);
    document.getElementById("lofiVid").src = "https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1";
    breakMinutes = (document.getElementById("userBreakTime").value);
    distance = workMinutes * 60000;
    working = true;
    paused = false;
    document.getElementById("buttonContent").src = "./../img/pauseButton.png"
}

// Change durations of periods
function updateAlerts() {
    areAlertsEnabled = document.getElementById("enableAlerts").checked;
}

// Change durations of periods
function updateSounds() {
    areSoundsEnabled = document.getElementById("enableSounds").checked;
}

// TIMER

// Update the count down every 1 second
var x = setInterval(function () {
    // Decrease time
    if (!paused) {
        distance -= 100;
    }

    // Time calculations for days, hours, minutes and seconds
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var minutes = Math.floor((distance - seconds) / (1000 * 60));


    // Output the result in an element with id="timeDisplay"
    if (working) {
        document.getElementById("timeDisplay").innerHTML = "Work: " + minutes + "m " + seconds + "s ";
    } else {
        document.getElementById("timeDisplay").innerHTML = "Break: " + minutes + "m " + seconds + "s ";
    }

    if (distance <= 100) {
        areSoundsEnabled && alarm.play();
    }

    // If the count down is over, write some text 
    if (distance <= 100) {
        document.getElementById("lofiVid").src = "";
    }

    if (distance < 0) {
        if (!working) {
            notify("Time's up, start working for " + workMinutes + " minutes!", "_blank");
            document.getElementById("lofiVid").src = "https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1";
            distance = workMinutes * 60000;
            completed++;
        } else {
            notify("Time's up, take a " + breakMinutes + " minute break!", "_blank");
            distance = breakMinutes * 60000;
        }
        working = !working;
    }

    //Progress bar
    if (working) {
        document.getElementById("progressbar").style.width = ((workMinutes - distance / 60000) / workMinutes) * 249 + "px";
    } else {
        document.getElementById("progressbar").style.width = ((breakMinutes - distance / 60000) / breakMinutes) * 249 + "px";
    }

    // Number of pomodoros completed
    document.getElementById("pomodorosCompleted").innerHTML = "Pomodoros Completed: " + completed;
}, 100);