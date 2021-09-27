document.getElementById("button").addEventListener("click", pause);
document.getElementById("saveButton").addEventListener("click", changeLengths);

var working = true;
var workMinutes=25;
var breakMinutes=5;
var distance = workMinutes * 60000;
var completed=0;
var alarm = new Audio('/sounds/alarm.wav');

// SETTINGS
const settingsToggle = document.querySelector('.settings-toggle');
const saveButton = document.querySelector('.save-button');

settingsToggle.addEventListener('click',()=>{
    document.body.classList.toggle('settings-open')
})

saveButton.addEventListener('click', () => {
    document.body.classList.remove('settings-open');
})


// PAUSE
var paused = false;
function pause() {
    if (paused===false){
        paused = true;
        document.getElementById("lofiVid").src="";
        document.getElementById("buttonContent").src="./../img/playButton.png"
    } else {
        paused = false;
        document.getElementById("lofiVid").src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1";
        document.getElementById("buttonContent").src="./../img/pauseButton.png"
    }
}

// Change durations of periods
function changeLengths() {
    workMinutes = (document.getElementById("userWorkTime").value);
    document.getElementById("lofiVid").src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1";
    breakMinutes = (document.getElementById("userBreakTime").value);
    distance = workMinutes * 60000;
    working = true;
    paused = false;
    document.getElementById("buttonContent").src="./../img/pauseButton.png"
}

// TIMER

// Update the count down every 1 second
var x = setInterval(function() {
    // Decrease time
    if (!paused){
    distance -=100;
    }

    // Time calculations for days, hours, minutes and seconds
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var minutes = Math.floor((distance-seconds)/ (1000 * 60));
    
    
    // Output the result in an element with id="timeDisplay"
    if (working) {
        document.getElementById("timeDisplay").innerHTML = "Work: " + minutes + "m " + seconds + "s ";
    } else {
        document.getElementById("timeDisplay").innerHTML = "Break: " + minutes + "m " + seconds + "s ";
    }
    
    if (distance<=100) {
        alarm.play();
    }

    // If the count down is over, write some text 
    if (distance < 0) {
        
        document.getElementById("lofiVid").src="";
        working = !working;
        document.getElementById("timeDisplay").innerHTML = "Time's up!";
        if (!working) { // Break is starting
            window.alert("Time's up, Take a "+ breakMinutes+" minute break!", "_blank");
            distance = breakMinutes * 60000;
        } else { // working is starting
            window.alert("Time's up, get to working for "+workMinutes+" minutes!", "_blank");
            document.getElementById("lofiVid").src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1";
            distance = workMinutes * 60000;
            completed++;
        }
    }

    //Progress bar
    if (working) {
        document.getElementById("progressbar").style.width=((workMinutes-distance/60000)/workMinutes)*249 + "px";
    } else {
        document.getElementById("progressbar").style.width=((breakMinutes-distance/60000)/breakMinutes)*249+ "px";
    }
    
    // Number of pomodoros completed
    document.getElementById("pomodorosCompleted").innerHTML = "Pomodoros Completed: " + completed;
}, 100);