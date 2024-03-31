

// Variables
const video = document.querySelector('.my-video');

const playIcon = document.querySelector('.ri-play-large-fill')

const totalDuration = document.querySelector('.total-duration');

const currentDuration = document.querySelector('.current-duration');

const timeLineProgress = document.querySelector('.time-line-progress');

const progressBar = document.querySelector('.progress-bar');

const timeLineBase = document.querySelector('.time-line');

const volumeSlider = document.querySelector('input');

const audioIcon = document.querySelector('.button-icon');

const backwardBtn = document.querySelector('.ri-rewind-fill');

const forwardBtn = document.querySelector('.ri-speed-fill');

const speedIcon = document.querySelector('.speed-icon');

const speedOptionsContainer = document.querySelector('.speed-options-container');

const fullscreenIcon = document.querySelector('.ri-fullscreen-fill');

const videoContainer = document.querySelector('.video-and-controls-container')

const smallerScreen = document.querySelector('.smaller-screen');

const videoTimeLine = document.querySelector('.time-line');

const controlBarWrapper = document.querySelector('.controls-bar-wrapper');




// ----------------------------------------------------




// Control Bar Behaviour When Mouse mouve and stops

let timer;

function hideControlBar() {

    if(video.paused) {
        return;
    }
    timer = setTimeout(() => {
        videoContainer.classList.remove('show-control-bar');
    }, 2000);

};
hideControlBar()

videoContainer.addEventListener('mousemove', () => {

    videoContainer.classList.add('show-control-bar');

    clearTimeout(timer); 

    hideControlBar()
});





// -------------------------------------------------




// Play and Pause Functionality


// Play Pause video function, it handles the icon change as well
function playPauseVideo() {

    if(video.paused) {

        video.play();
        playIcon.classList.remove('ri-play-large-fill');
        playIcon.classList.add('ri-pause-large-fill');

    } else {

        video.pause();
        playIcon.classList.remove('ri-pause-large-fill');
        playIcon.classList.add('ri-play-large-fill');
    };
};


video.addEventListener('click', playPauseVideo);



// --------------------------------------------------------



// Total Video Duration Section


// get the video total duration and displaying it on the screen
function displayDuration() {
    const rawDuration = video.duration;

    const refinedDuration = formatDuration(rawDuration);

    totalDuration.textContent = refinedDuration;
};

// format total duration for a better read and to display the values on screen
function formatDuration(seconds) {

    const minutes = Math.floor(seconds / 60); 

    const remainingSecondsToMakeMinute = Math.floor(seconds % 60);

    return minutes + '0:' + (remainingSecondsToMakeMinute < 10 ? '0' : '') + remainingSecondsToMakeMinute;
};



// --------------------------------------------------------




// Current Progress Section


// format the video current time and display it on the screen
function formatCurrentDuration(currentProgress) {

    const minutes = Math.floor(currentProgress / 60); // getting the minutes

    const seconds = Math.floor(currentProgress % 60); // getting the seconds

    const formattedCurrentTime = minutes + '0:' + (seconds < 10 ? '0' : '') + seconds; // putting minutes and seconds in a string that can change and be displayed on the screen

    // showing current time on the screen
    currentDuration.textContent = formattedCurrentTime;
};


function makeProgressBarMove(event) {

    // updating the progrees bar
    let {currentTime, duration} = event.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
};


// the 'timeupdate' event fires as the video plays and its currentTime property changes.
video.addEventListener('timeupdate', (e) => {

    makeProgressBarMove(e);

    // get the info about the current time and sending it to a function to be formatted
    const current = video.currentTime;
    formatCurrentDuration(current)
    
});




// -------------------------------------------------------





// Video Time Line Interactivity


// click interactivity
function timeLineClick(e) {

    // timeLineWidth in total
    const timeLineWidth = videoTimeLine.clientWidth;

    // 
    progressBar.style.width = `${e.offsetX}px`;

    // updating video currentProgress
    video.currentTime = (e.offsetX / timeLineWidth) * video.duration;

};


// drag bar functionality
function dragProgressBar(e) {

    // Prevent default behavior to avoid text selection while dragging
    e.preventDefault();

    // Add a class to indicate dragging
    videoTimeLine.classList.add('dragging');

    // time line total width
    const timeLineWidth = videoTimeLine.clientWidth;

    // relative position of the mouse pointer within the videoTimeLine element
    const relativePosition = e.clientX - videoTimeLine.getBoundingClientRect().left;

    // Ensure the position stays within the timeline boundaries
    const positionLimit = Math.max(0, Math.min(timeLineWidth, relativePosition));

    // Set the progress bar width and position
    progressBar.style.width = `${positionLimit}px`;

    // Update the video's currentTime based on the progress bar position
    video.currentTime = (positionLimit / timeLineWidth) * video.duration;

    // updating the time when i drag the progress bar
    const minutes = Math.floor(video.currentTime / 60);

    const seconds = Math.floor(video.currentTime % 60);

    const formatTime = minutes + '0:' + (seconds < 10 ? '0' : '') + seconds

    currentDuration.innerText = formatTime;

}



// events for drag bar functionality
function stopDrag() {
    videoTimeLine.classList.remove('dragging');

    document.removeEventListener('mousemove', dragProgressBar);

    document.removeEventListener('mouseup', stopDrag);
}

videoTimeLine.addEventListener('mousedown', (e) => {

    // Start dragging only if the left mouse button is pressed
    if (e.button === 0) {

        document.addEventListener('mousemove', dragProgressBar);

        document.addEventListener('mouseup', stopDrag);
    }
});



// show me time info when i hover over time line
function timeInfoHover (e) {
    // getting the html element
    const timeInfo = document.querySelector('span');

    const mousePosition = (e.clientX - videoTimeLine.getBoundingClientRect().left) - 22; // minus 22 for better positioning of the html element

    // time line total width
    const timeLineWidth = videoTimeLine.clientWidth;

    // video time info according to where the mouse is on the time line width
    const percent = (mousePosition / timeLineWidth) * video.duration;

    // making the html element follow the mouse
    timeInfo.style.left = `${mousePosition}px`;

    // formating the numbers
    const minutes = Math.floor(percent / 60) % 60;

    const seconds = Math.floor(percent % 60);

    // if the numbers are negative they are not showed
    if (minutes < 0 || seconds < 0) {

        return

    } else {

        const formatTime = minutes + '0:' + (seconds < 10 ? '0' : '') + seconds

        // applying the formatted numbers
        timeInfo.innerText = formatTime;
    };
};






// -------------------------------------------------------




// start the video over when it ends

video.addEventListener('ended', () => {

    video.currentTime = 0;

    video.play();
});





// -------------------------------------------------------




// Backward, Forward, Functionality

backwardBtn.addEventListener('click', () => {
    video.currentTime -= 4;
});

forwardBtn.addEventListener('click', () => {
    video.currentTime += 4;
});





//---------------------------------------------------------




// Audio Config

// tying the video volume to the slider input, so i can use slider to turn the volume down
volumeSlider.addEventListener('input', (e) => {

    video.volume = e.target.value;

    // changing audio icon according to the volume
    if (video.volume <= 0.2){
        audioIcon.classList.replace('ri-volume-up-fill', 'ri-volume-down-fill');
    } else if (video.volume >= 0.3) {
        audioIcon.classList.replace('ri-volume-down-fill', 'ri-volume-up-fill');
    }

    if (video.volume === 0) {
        audioIcon.classList.replace('ri-volume-down-fill', 'ri-volume-mute-fill');
    } else {
        audioIcon.classList.replace('ri-volume-mute-fill', 'ri-volume-down-fill');
    };

});

// making the video audio start at a certain volume
window.onload = () => {

    // when the page loads it starts at 0.3
    video.volume = 0.3;

    // if i adjust the volume before i start the video i will get the adjusted audio.
    volumeSlider.addEventListener('input', (e) => {
        video.volume = e.target.value;
    });
};


// click event on audio icon, replace audio icon when click
audioIcon.addEventListener('click', () => {

    // statement to handle icon and audio change
    if(!audioIcon.classList.contains('ri-volume-mute-fill')) {

        audioIcon.classList.replace('ri-volume-up-fill','ri-volume-mute-fill');
        audioIcon.classList.replace('ri-volume-down-fill','ri-volume-mute-fill');

        // change volume
        video.volume = 0;

        // set volume slider to the new audio volume
        volumeSlider.value = video.volume;

    } else {
        audioIcon.classList.replace('ri-volume-mute-fill', 'ri-volume-up-fill');
        audioIcon.classList.replace('ri-volume-mute-fill','ri-volume-down-fill',);

        video.volume = 0.3;

        volumeSlider.value = video.volume;
    };

});

// this is to prevent the audio icon change when adjusting the volume slider
volumeSlider.addEventListener('click', (e) => {

    e.stopPropagation();

    e.preventDefault();

})





// -------------------------------------------------






// Video Speed Control Functionality

// toggle speed menu
let toggleSpeedMenu = false;

speedIcon.addEventListener('click', (e) => {

    e.stopPropagation();

    toggleSpeedMenu = !toggleSpeedMenu;


    if(toggleSpeedMenu){

        speedOptionsContainer.style.display = 'block';

    } else {
        speedOptionsContainer.style.display = 'none';
    };

});

// get out of speed menu when click outside of the container
document.addEventListener('click', (e) => {

    e.stopPropagation();

    if(toggleSpeedMenu){

        speedOptionsContainer.style.display = 'none';
        toggleSpeedMenu = !toggleSpeedMenu;

    } else {
        return;
    }

});

// control video speed
function speedControl(e) {

    e.stopPropagation();

    const target = e.target.innerText;

    switch(true) {
        case target === '2x':

            video.playbackRate = 2;
        break;
        case target === '1.5x':

            video.playbackRate = 1.5;
        break;
        case target === 'Normal':

            video.playbackRate = 1;
        break;
        case target === '0.75x':
            
            video.playbackRate = 0.75
        break;
        case target === '0.5x':

            video.playbackRate = 0.5;
        break;
        default: console.log('tops')
    };

};





// -------------------------------------------------





// Select Small Screen
smallerScreen.addEventListener('click', () => {
    video.requestPictureInPicture();
});





// -------------------------------------------------





// Fullscreen Functionality

function toggleFullScreen() {

    videoContainer.classList.toggle('fullscreen-on');

    if(document.fullscreenElement){ // if the videos is already on full screen

        // change icon when in fullscreen
        fullscreenIcon.classList.replace( 'ri-fullscreen-exit-fill', 'ri-fullscreen-fill');

        // exiting fullscreen and catching any errors if i have any
        return document.exitFullscreen().catch(err => {
            console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
        });

    }

    // change icon when enter in full screen
    fullscreenIcon.classList.replace('ri-fullscreen-fill', 'ri-fullscreen-exit-fill');

    // entering fullscreen and catching any errors if i have any
    videoContainer.requestFullscreen().catch(err => {
        console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`)
    });

}




// -------------------------------------------------




// event listeners

// Add event listener to get duration when metadata is loaded, this is part of the 'get the total duration' code
video.addEventListener('loadedmetadata', displayDuration);

// display duration when resize page
document.addEventListener('resize', displayDuration);

// making video total duration appear when the page loads
window.addEventListener('load', displayDuration);

// event lister for playIcon
playIcon.addEventListener('click', playPauseVideo);

// full screen mode
fullscreenIcon.addEventListener('click', toggleFullScreen);

// change video speed
speedOptionsContainer.addEventListener('click', speedControl);

// click on time line
videoTimeLine.addEventListener('click', timeLineClick);

// time info when hover over time line
videoTimeLine.addEventListener('mousemove', timeInfoHover);

