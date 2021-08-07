document.getElementById("button").addEventListener("click", pause);

var paused = false;
function pause() {
    if (paused===false){
        paused = true;
        document.getElementById("button").innerHTML = "Resume";
    } else {
        paused = false;
        document.getElementById("button").innerHTML = "Pause";
    }
}

var work = true;
const workMinutes=25;
const breakMinutes=5;
var distance = workMinutes * 60000;

// Update the count down every 1 second
var x = setInterval(function() {
    // Decrease time
    if (!paused){
    distance -=1000;
    }

    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Output the result in an element with id="demo"
    document.getElementById("demo").innerHTML = minutes + "m " + seconds + "s ";
    
    // If the count down is over, write some text 
    if (distance < 0) {   
        work = !work;     
        document.getElementById("demo").innerHTML = "Time's up!";
        
        if (!work) { // Break is starting
            distance = breakMinutes * 60000;
            window.alert("Time's up, Take a "+breakMinutes+" minute break!", "_blank");
        } else { // Work is starting
            distance = workMinutes * 60000;
            window.alert("Time's up, get to work for "+workMinutes+" minutes!", "_blank");
        }
    }

    if (work) {
        document.getElementById("workornot").innerHTML = "Get to work!"
    
    } else {
        document.getElementById("workornot").innerHTML = "Take a break!"
    }
}, 1000);