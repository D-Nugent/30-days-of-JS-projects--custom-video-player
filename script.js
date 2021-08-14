// Element Selectors

const player = document.querySelector('.video-wrapper');
const playBtn = player.querySelector('.video-controls__btn.--play');
const video = player.querySelector('.video-player');
const progress = player.querySelector('.scrubber');
const progressBar = progress.querySelector('.scrubber__bar');
const skipControls = player.querySelectorAll('[data-skip]');
const speedControls = player.querySelectorAll('[data-speed');
const volumeControl = player.querySelector('.video-controls__volume');
const muteToggle = player.querySelector('.video-controls__btn.--mute');
const fullScreenBtn = player.querySelector('.video-controls__btn.--fullscreen');

// Event Listeners

playBtn.addEventListener('click',togglePlay);
video.addEventListener('timeupdate',handleProgress);
progress.addEventListener('click',scrub);
progress.addEventListener('mousemove',(e) => mouseDown && scrub(e));
progress.addEventListener('mousedown',function() {
  this.style.cursor = 'grabbing';
  mouseDown = true;
  console.log('I ran');
});
progress.addEventListener('mouseup',function() {
  mouseDown = false;
  this.style.cursor = 'pointer'
} );
skipControls.forEach(button => button.addEventListener('click',skipVideo));
speedControls.forEach(button => button.addEventListener('click',updatePlaybackSpeed));
volumeControl.addEventListener('change',updateVolume);
muteToggle.addEventListener('click',toggleMute);
fullScreenBtn.addEventListener('click',toggleFullscreen)
// Control Variables

let volume;
let mouseDown = false;

// Functions

function togglePlay(){
  video.paused?video.play():video.pause();
}

function handleProgress(){
  const perc = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${perc}%`
}

function scrub(e){
  const newTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = newTime;
}

function skipVideo(){
  video.currentTime += parseFloat(this.dataset.skip);
}

function updatePlaybackSpeed(){
  video.playbackRate = parseFloat(this.dataset.speed);
}

function updateVolume(){
  // Note: the '1 -' is required as for aesthetics the video range has been flipped upside down.
  video[this.name] = 1 - this.value;
}

function toggleMute(){
  if(video.muted) {
    video.muted = false;
    volumeControl.value = 1-volume;
  } else {
    volume = video.volume;
    video.muted = true;
    volumeControl.value = 1;
  }
}

function toggleFullscreen(){
  document.fullscreenElement? document.exitFullscreen():player.requestFullscreen();
}