document.getElementById("button").addEventListener("click", pause);
document.getElementById("submitUserWorkTime").addEventListener("click", changeWorkLength);
document.getElementById("submitUserBreakTime").addEventListener("click", changeBreakLength);

var working = true;
var workMinutes=25;
var breakMinutes=5;
var distance = workMinutes * 60000;
var completed=0;
var alarm = new Audio('/sounds/alarm.wav');

// PAUSE
var paused = false;
function pause() {
    if (paused===false){
        paused = true;
        document.getElementById("lofiVid").src="";
        document.getElementById("button").innerHTML = "Resume";
    } else {
        paused = false;
        document.getElementById("lofiVid").src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1";
        document.getElementById("button").innerHTML = "Pause";
    }
}

// Change times
function changeWorkLength() {
    workMinutes = (document.getElementById("userWorkTime").value);
    distance = workMinutes * 60000;
    working = true;
    document.getElementById("lofiVid").src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1";
}
function changeBreakLength() {
    breakMinutes = (document.getElementById("userBreakTime").value);
    distance = breakMinutes * 60000;
    working = false;
    document.getElementById("lofiVid").src="";
}

// TIMER

// Update the count down every 1 second
var x = setInterval(function() {
    // Decrease time
    if (!paused){
    distance -=1000;
    }

    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Output the result in an element with id="timeDisplay"
    document.getElementById("timeDisplay").innerHTML = minutes + "m " + seconds + "s ";
    
    if (distance<=1000) {
        alarm.play();
    }

    // If the count down is over, write some text 
    if (distance < 0) {
        document.getElementById("lofiVid").src="";
        working = !working;
        document.getElementById("timeDisplay").innerHTML = "Time's up!";
        if (!working) { // Break is starting
            distance = breakMinutes * 60000;
            window.alert("Time's up, Take a "+ breakMinutes+" minute break!", "_blank");
        } else { // working is starting
            document.getElementById("lofiVid").src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1";
            distance = workMinutes * 60000;
            window.alert("Time's up, get to working for "+workMinutes+" minutes!", "_blank");
            completed++;
        }
    }

    if (working) {
        document.getElementById("sentence").innerHTML = "Get to working!"
    } else {
        document.getElementById("sentence").innerHTML = "Take a break!"
    }

    // Number of pomodoros completed
    document.getElementById("pomodorosCompleted").innerHTML = "Pomodoros Completed: " + completed;
}, 1000);

