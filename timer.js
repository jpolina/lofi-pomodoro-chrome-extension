document.getElementById("button").addEventListener("click", pause);

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

var working = true;
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
        document.getElementById("lofiVid").src="";
        working = !working;
        document.getElementById("demo").innerHTML = "Time's up!";
        
        if (!working) { // Break is starting
            distance = breakMinutes * 60000;
            window.alert("Time's up, Take a "+breakMinutes+" minute break!", "_blank");
        } else { // working is starting
            document.getElementById("lofiVid").src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1";
            distance = workMinutes * 60000;
            window.alert("Time's up, get to working for "+workMinutes+" minutes!", "_blank");
        }
    }

    if (working) {
        document.getElementById("sentence").innerHTML = "Get to working!"
    } else {
        document.getElementById("sentence").innerHTML = "Take a break!"
    }
}, 1000);

