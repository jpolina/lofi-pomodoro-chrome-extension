const YT_EMBED_PREFIX = "https://www.youtube-nocookie.com/embed/";
const DARK_MODE_STORAGE_KEY = "lofidoroDarkMode";
const ZEN_MODE_STORAGE_KEY = "lofidoroZenMode";
const COMPLETED_POMODOROS_STORAGE_KEY = "lofidoroCompletedPomodoros";
let currentMusicVideoId = "jfKfPfyJRdk";

document.querySelector(".pause-button").addEventListener("click", pause);
document.getElementById("save-button").addEventListener("click", changeLengths);
document.getElementById("reset-session-button").addEventListener("click", resetSession);
document.getElementById("music-source").addEventListener("change", updateMusicSource);
document.querySelector("#enable-notifs").addEventListener("change", updateAlerts);
document.querySelector("#enable-alarms").addEventListener("change", updateSounds);
document.querySelector("#dark-mode").addEventListener("change", updateDarkMode);
document.querySelector("#zen-mode").addEventListener("change", updateZenMode);
currentMusicVideoId = document.getElementById("music-source").value;


let working = true;
let workMinutes = 25;
let breakMinutes = 5;
let distance = workMinutes * 60000;
let timerEndTime = Date.now() + distance;
let completed = 0;
let alarm = new Audio('/sounds/alarm.wav');
let areAlertsEnabled = true;
let areSoundsEnabled = true;
const currentNotificationID = 'lofidoro';
const pauseButton = document.querySelector(".pause-button");

function renderCompletedCount() {
    document.querySelector(".pomodoros-completed").innerHTML = "Pomodoros Completed: " + completed;
}

function loadCompletedCount() {
    const saved = parseInt(localStorage.getItem(COMPLETED_POMODOROS_STORAGE_KEY), 10);
    completed = Number.isFinite(saved) && saved >= 0 ? saved : 0;
}

function saveCompletedCount() {
    localStorage.setItem(COMPLETED_POMODOROS_STORAGE_KEY, String(completed));
}

function renderPauseButton() {
    pauseButton.classList.toggle("is-paused", paused);
    pauseButton.setAttribute("aria-label", paused ? "Play" : "Pause");
}

function getYouTubeSrc(autoplay = false) {
    return `${YT_EMBED_PREFIX}${currentMusicVideoId}?rel=0${autoplay ? "&autoplay=1" : ""}`;
}

function updateMusicSource() {
    currentMusicVideoId = document.getElementById("music-source").value;

    if (working && !paused) {
        document.querySelector(".lofi-vid").src = getYouTubeSrc(true);
    } else if (!working) {
        document.querySelector(".lofi-vid").src = "";
    } else {
        document.querySelector(".lofi-vid").src = getYouTubeSrc(false);
    }
}


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

    clearAndNotify = () => {
        chrome.notifications.create(
            currentNotificationID, {
                type: 'basic',
                iconUrl: '../img/tomato.png',
                title: 'Lofidoro',
                message: message,
                priority: 2
            },
            function () {}
        )
    }

    if (areAlertsEnabled) {
        clearAndNotify();
    }
}

// PAUSE
let paused = false;
function pause() {
    if (paused === false) {
        paused = true;
        document.querySelector(".lofi-vid").src = "";
    } else {
        paused = false;
        timerEndTime = Date.now() + distance;
        if (working) document.querySelector(".lofi-vid").src = getYouTubeSrc(true);
    }
    renderPauseButton();
}

// Change durations of periods
function changeLengths() {
    workMinutes = (document.getElementById("work-length").value);
    document.querySelector(".lofi-vid").src = getYouTubeSrc(true);
    breakMinutes = (document.getElementById("break-length").value);
    distance = workMinutes * 60000;
    timerEndTime = Date.now() + distance;
    working = true;
    paused = false;
    renderPauseButton();
}

// Change durations of periods
function updateAlerts() {
    areAlertsEnabled = document.getElementById("enable-notifs").checked;
}

// Change durations of periods
function updateSounds() {
    areSoundsEnabled = document.getElementById("enable-alarms").checked;
}

function resetSession() {
    completed = 0;
    saveCompletedCount();
    workMinutes = document.getElementById("work-length").value;
    breakMinutes = document.getElementById("break-length").value;
    working = true;
    paused = false;
    distance = workMinutes * 60000;
    timerEndTime = Date.now() + distance;
    chrome.notifications.clear(currentNotificationID, function () {});
    document.querySelector(".lofi-vid").src = getYouTubeSrc(true);
    renderPauseButton();
    renderCompletedCount();
    document.body.classList.remove('settings-open');
}

function setModeState(className, storageKey, enabled) {
    document.body.classList.toggle(className, enabled);
    localStorage.setItem(storageKey, enabled ? "1" : "0");
}

function updateDarkMode() {
    setModeState("dark-mode", DARK_MODE_STORAGE_KEY, document.getElementById("dark-mode").checked);
}

function updateZenMode() {
    setModeState("zen-mode", ZEN_MODE_STORAGE_KEY, document.getElementById("zen-mode").checked);
}

function restoreModes() {
    const isDarkMode = localStorage.getItem(DARK_MODE_STORAGE_KEY) === "1";
    const isZenMode = localStorage.getItem(ZEN_MODE_STORAGE_KEY) === "1";

    document.getElementById("dark-mode").checked = isDarkMode;
    document.getElementById("zen-mode").checked = isZenMode;

    document.body.classList.toggle("dark-mode", isDarkMode);
    document.body.classList.toggle("zen-mode", isZenMode);
}

// TIMER

// Update the count down every 1 second
let x = setInterval(function () {
    // Decrease time
    if (!paused) {
        distance = timerEndTime - Date.now();
    }

    // Time calculations for days, hours, minutes and seconds
    const remaining = Math.max(distance, 0);
    let seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    let minutes = Math.floor((remaining - seconds) / (1000 * 60));


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
    if (distance <= 300) {
        chrome.notifications.clear(currentNotificationID,function () {})

        document.querySelector(".lofi-vid").src = "";
    }

    if (distance < 0) {
        if (!working) {
            notify("Time's up, start working for " + workMinutes + " minutes!", "_blank");
            document.querySelector(".lofi-vid").src = getYouTubeSrc(true);
            distance = workMinutes * 60000;
            timerEndTime = Date.now() + distance;
            completed++;
            saveCompletedCount();
        } else {
            notify("Time's up, take a " + breakMinutes + " minute break!", "_blank");
            distance = breakMinutes * 60000;
            timerEndTime = Date.now() + distance;
        }
        working = !working;
    }

    //Progress bar
    let totalLength = document.querySelector(".time-rect").offsetWidth;
    if (working) {
        document.querySelector(".progress-bar").style.width = ((workMinutes - distance / 60000) / workMinutes) * totalLength + "px";
    } else {
        document.querySelector(".progress-bar").style.width = ((breakMinutes - distance / 60000) / breakMinutes) * totalLength + "px";
    }

    // Number of pomodoros completed
    renderCompletedCount();
}, 100);

renderPauseButton();
restoreModes();
loadCompletedCount();
renderCompletedCount();
