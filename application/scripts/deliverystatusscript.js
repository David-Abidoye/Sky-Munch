let timerElement = document.getElementById("timer");

// Set initial time for the countdown in seconds (5 minutes)
let timeRemaining = 5 * 60; // 5 minutes converted to seconds

// Function to update the timer every second
function updateTimer() {
    // Calculate minutes and seconds from total time remaining
    let minutes = Math.floor(timeRemaining / 60); // Get the minutes part
    let seconds = timeRemaining % 60; // Get the seconds part

    // Format the minutes and seconds to always show two digits
    minutes = minutes < 10 ? '0' + minutes : minutes; // Prefix a 0 if less than 10
    seconds = seconds < 10 ? '0' + seconds : seconds; // Prefix a 0 if less than 10

    // Update the timer element on the page with the new time
    timerElement.textContent = `${minutes}:${seconds}`;

    // Check if the countdown has reached 0
    if (timeRemaining > 0) {
        timeRemaining--; // Decrement time remaining by 1 second
    } else {
        clearInterval(countdown); // Stop the countdown when time is up
        timerElement.textContent = "00:00"; // Set the timer to 00:00 when it ends
    }
}

// Start the countdown timer, calling the updateTimer function every second (1000 milliseconds)
let countdown = setInterval(updateTimer, 1000);
