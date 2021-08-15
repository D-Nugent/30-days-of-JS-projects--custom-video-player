// Element Selectors

const compareWindow = document.querySelector('.video__comparison');
const compareBtn = document.querySelector('.comparison');
const player = document.querySelector('.video-wrapper');
const playBtn = player.querySelector('.video-controls__btn.--play');
const playSVG = {
  wrapper: playBtn.querySelector('.playSVG'),
  outer: playBtn.querySelector('.playSVG__outer'),
  play: playBtn.querySelector('.playSVG__play'),
  pause: playBtn.querySelector('.playSVG__pause'),
}
const video = player.querySelector('.video-player');
const progress = player.querySelector('.scrubber');
const progressBar = progress.querySelector('.scrubber__bar');
const skipControls = player.querySelectorAll('[data-skip]');
const speedControls = player.querySelectorAll('[data-speed');
const volumeControl = player.querySelector('.video-controls__volume');
const muteToggle = player.querySelector('.video-controls__btn.--mute');
const volumeSVG = {
  wrapper: document.querySelector('.volume-svg'),
  outer: document.querySelector('.volume-svg__outer'),
  inner: document.querySelector('.volume-svg__inner'),
  speaker: document.querySelector('.volume-svg__speaker'),
  mute: document.querySelector('.volume-svg__mute'),
}
const fullScreenBtn = player.querySelector('.video-controls__btn.--fullscreen');

// Event Listeners

compareBtn.addEventListener('click',toggleComparison)
playBtn.addEventListener('click',togglePlay);
video.addEventListener('play',togglePlayBtn)
video.addEventListener('pause',togglePlayBtn)
video.addEventListener('timeupdate',handleProgress);
progress.addEventListener('click',scrub);
progress.addEventListener('mousemove',(e) => mouseDown && scrub(e));
progress.addEventListener('mousedown',function() {
  this.style.cursor = 'grabbing';
  mouseDown = true;
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

let after = false;
let volume;
let mouseDown = false;
let playing = false;

// Functions

function toggleComparison(){
  after?compareWindow.classList.remove('--after'):compareWindow.classList.add('--after');
  after?this.textContent = 'Before':this.textContent = 'After';
  after = !after;
}

function togglePlay(){
  video.paused?video.play():video.pause();
  playing = !playing;
}

function togglePlayBtn(){
  playing? playSVG.wrapper.classList.add('--pause'):playSVG.wrapper.classList.remove('--pause')
  playing? playSVG.wrapper.classList.remove('--playing'):playSVG.wrapper.classList.add('--playing')
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
  let volume = 1 - this.value;
  video[this.name] = volume;
  updateVolumeSVG(volume)
}

function toggleMute(){
  if(video.muted) {
    video.muted = false;
    volumeControl.value = 1-volume;
    updateVolumeSVG(video.volume)
  } else {
    volume = video.volume;
    video.muted = true;
    volumeControl.value = 1;
    volumeSVG.outer.classList.add('--inactive');
    volumeSVG.inner.classList.add('--inactive');
    volumeSVG.speaker.classList.add('--inactive');
    volumeSVG.mute.classList.remove('--inactive');
  }
}

function updateVolumeSVG(vol){
  if (vol>=.7) {
    volumeSVG.outer.classList.remove('--inactive');
    volumeSVG.inner.classList.remove('--inactive');
    volumeSVG.speaker.classList.remove('--inactive');
    volumeSVG.mute.classList.add('--inactive')
  } else if (vol>=.3 && vol<=.7) {
    volumeSVG.outer.classList.add('--inactive');
    volumeSVG.inner.classList.remove('--inactive');
    volumeSVG.speaker.classList.remove('--inactive');
    volumeSVG.mute.classList.add('--inactive')
  } else if (vol>0 && vol<=.3) {
    volumeSVG.outer.classList.add('--inactive');
    volumeSVG.inner.classList.add('--inactive');
    volumeSVG.speaker.classList.remove('--inactive');
    volumeSVG.mute.classList.add('--inactive');
  } else if (vol==0) {
    volumeSVG.outer.classList.add('--inactive');
    volumeSVG.inner.classList.add('--inactive');
    volumeSVG.speaker.classList.add('--inactive');
    volumeSVG.mute.classList.remove('--inactive');
  }
}

function toggleFullscreen(){
  document.fullscreenElement? document.exitFullscreen():player.requestFullscreen();
}