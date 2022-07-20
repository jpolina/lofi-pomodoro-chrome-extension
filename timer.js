document.querySelector(".pause-button").addEventListener("click", pause);
document.getElementById("save-button").addEventListener("click", changeLengths);
document.querySelector(".enable-notifs").addEventListener("change", updateAlerts);
document.getElementById("enable-alarms").addEventListener("change", updateSounds);


var working = true;
var workMinutes = 25;
var breakMinutes = 5;
var distance = workMinutes * 60000;
var completed = 0;
var alarm = new Audio('/sounds/alarm.wav');
var areAlertsEnabled = true;
var areSoundsEnabled = true;
let currentNotificationID = 0;


// SETTINGS
const settingsToggle = document.querySelector('.settings-toggle');
const saveButton = document.querySelector('.save-button');
const gear = document.querySelector('.gear');

gear.addEventListener('click', () => {
    document.body.classList.toggle('settings-open')
})

saveButton.addEventListener('click', () => {
    document.body.classList.remove('settings-open');
})

document.querySelector(".rotate").onclick =function () {
    document.querySelector(".rotate").classList.toggle("down");
}


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
        document.querySelector(".lofi-vid").src = "";
        document.querySelector(".button-content").src = "./../img/playButton.png"
    } else {
        paused = false;
        if (working) document.querySelector(".lofi-vid").src = "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1";
        document.querySelector(".button-content").src = "./../img/pauseButton.png"
    }
}

// Change durations of periods
function changeLengths() {
    workMinutes = (document.getElementById("work-length").value);
    document.querySelector(".lofi-vid").src = "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1";
    breakMinutes = (document.getElementById("break-length").value);
    distance = workMinutes * 60000;
    working = true;
    paused = false;
    document.querySelector(".button-content").src = "./../img/pauseButton.png"
}

// Change durations of periods
function updateAlerts() {
    areAlertsEnabled = document.getElementById("enable-notifs").checked;
}

// Change durations of periods
function updateSounds() {
    areSoundsEnabled = document.getElementById("enable-alarms").checked;
}

// TIMER

// Update the count down every 1 second
let x = setInterval(function () {
    // Decrease time
    if (!paused) {
        distance -= 100;
    }

    // Time calculations for days, hours, minutes and seconds
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    let minutes = Math.floor((distance - seconds) / (1000 * 60));


    // Output the result in an element with id="time-display"
    if (working) {
        document.querySelector(".time-display").innerHTML = "Work: " + minutes + "m " + seconds + "s ";
    } else {
        document.querySelector(".time-display").innerHTML = "Break: " + minutes + "m " + seconds + "s ";
    }

    if (distance <= 100) {
        areSoundsEnabled && alarm.play();
    }

    // If the count down is over, write some text 
    if (distance <= 100) {
        document.querySelector(".lofi-vid").src = "";
    }

    if (distance < 0) {
        if (!working) {
            notify("Time's up, start working for " + workMinutes + " minutes!", "_blank");
            document.querySelector(".lofi-vid").src = "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1";
            distance = workMinutes * 60000;
            completed++;
        } else {
            notify("Time's up, take a " + breakMinutes + " minute break!", "_blank");
            distance = breakMinutes * 60000;
        }
        working = !working;
    }

    //Progress bar
    let totalLength = document.querySelector(".time-rect").offsetWidth;
    console.log(totalLength)
    if (working) {
        document.querySelector(".progress-bar").style.width = ((workMinutes - distance / 60000) / workMinutes) * totalLength + "px";
    } else {
        document.querySelector(".progress-bar").style.width = ((breakMinutes - distance / 60000) / breakMinutes) * totalLength + "px";
    }

    // Number of pomodoros completed
    document.querySelector(".pomodoros-completed").innerHTML = "Pomodoros Completed: " + completed;
}, 100);