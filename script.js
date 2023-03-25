// Custom Video Player

// Variables
const container = document.querySelector(".container"), 
video = document.getElementById('myVideo'),
fileInput = document.getElementById('fileInput'),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeTitle = container.querySelector(".volume"),
volumeBtn = container.querySelector(".volume span"),
volumeSlider = container.querySelector(".left input"),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward span"),
skipForward = container.querySelector(".skip-forward span"),
playPauseTitle = container.querySelector(".play-pause"),
playPauseBtn = container.querySelector(".play-pause span"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
pipBtn = container.querySelector(".pic-in-pic span"),
fullScreenTitle = container.querySelector(".fullscreen"),
fullScreenBtn = container.querySelector(".fullscreen span");
let timer;

// New File
fileInput.addEventListener('change', function() {
    const file = this.files[0];
    const objectURL = URL.createObjectURL(file);
    video.src = objectURL;
    mainVideo.play();
});

// Display Volume Range
volumeBtn.addEventListener("mousemove", () => {
    volumeSlider.style.display = "block";
    volumeSlider.style.marginLeft = "3px";  
});

// Hide Controls
const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
        volumeSlider.style.display = "none";
    }, 4000);
}
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();   
});

// Time Format
const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

// Video Timeline
videoTimeline.addEventListener("mousemove", e => {
    let timelineWidth = videoTimeline.clientWidth;
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
    const progressTime = videoTimeline.querySelector("span");
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
    progressTime.style.left = `${offsetX}px`;
    progressTime.innerText = formatTime(percent);
});

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", () => {
    videoDuration.innerText = formatTime(mainVideo.duration);
});

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

// Volume 
volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value;
    if(e.target.value == 0) {
        volumeTitle.title = "Unmute";
        return volumeBtn.textContent = 'volume_off';
    }
    volumeBtn.textContent = 'volume_up';
    volumeTitle.title = "Mute";
});

// Mute & Unmute
const tempVolume = volumeSlider.value;

volumeBtn.addEventListener("click", () => {
    if(volumeSlider.value == 0) {
        mainVideo.volume = tempVolume;
        volumeBtn.textContent = 'volume_up';
        volumeTitle.title = "Mute";
        volumeSlider.value = mainVideo.volume;
    }else if(volumeBtn.innerHTML == 'volume_off') {
        mainVideo.volume = tempVolume;
        volumeBtn.textContent = 'volume_up';
        volumeTitle.title = "Mute";
    }else{
        mainVideo.volume = 0.0;
        volumeBtn.textContent = 'volume_off';
        volumeTitle.title = "Unmute";
    }
});

// Video Speed 
speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

document.addEventListener("click", e => {
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
        speedOptions.classList.remove("show");
    }
});

// Full Screen
fullScreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen");
    if(document.fullscreenElement) {
        fullScreenBtn.textContent = 'fullscreen';
        fullScreenTitle.title = "Full screen";
        return document.exitFullscreen();
    }
    fullScreenBtn.textContent = 'fullscreen_exit';
    fullScreenTitle.title = "Exit Full screen";
    container.requestFullscreen();
});

// Buttons Functions
speedBtn.addEventListener("click", () => speedOptions.classList.toggle("show"));
pipBtn.addEventListener("click", () => mainVideo.requestPictureInPicture());
skipBackward.addEventListener("click", () => mainVideo.currentTime -= 10);
skipForward.addEventListener("click", () => mainVideo.currentTime += 10);
mainVideo.addEventListener("play", () => { playPauseBtn.textContent = 'pause'; playPauseTitle.title = 'Pause';});
mainVideo.addEventListener("pause", () => { playPauseBtn.textContent = 'play_arrow'; playPauseTitle.title = 'Play';});
playPauseBtn.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause());
videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar));
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar));