class AudioPlayer {
  constructor(playlist) {
    this.playlist = playlist;
    this.currentIndex = 0;
    this.audio = new Audio();
    this.audio.addEventListener('ended', () => this.next());
    this.isPlaying = false;
  }

  play() {
    if (this.playlist.length === 0) return;
    this.audio.src = this.playlist[this.currentIndex].src;
    this.audio.play();
    this.isPlaying = true;
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    if (this.isPlaying) {
      this.play();
    }
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    if (this.isPlaying) {
      this.play();
    }
  }

  getCurrentSong() {
    return this.playlist[this.currentIndex];
  }

  setVolume(volume) {
    this.audio.volume = volume;
  }
}

const playlist = [];

const audioPlayer = new AudioPlayer(playlist);

function initAudioPlayer(containerId, playlist) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const player = new AudioPlayer(playlist);

  // Main container
  const mainDiv = document.createElement('div');
  mainDiv.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  `;

  // Toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '🎵';
  toggleBtn.style.cssText = `
    background: rgba(229, 221, 221, 0.59);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  // Controls container
  const controls = document.createElement('div');
  controls.style.cssText = `
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    margin-top: 10px;
    display: none;
  `;

  const title = document.createElement('div');
  title.textContent = player.getCurrentSong().title;
  title.style.marginBottom = '10px';

  const playBtn = document.createElement('button');
  playBtn.textContent = 'Play';
  playBtn.style.cssText = `
    background: #4caf4fa5;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    margin: 0 5px;
    cursor: pointer;
    font-size: 14px;
  `;
  playBtn.onmouseover = () => playBtn.style.background = '#45a049';
  playBtn.onmouseout = () => playBtn.style.background = '#4CAF50';
  playBtn.onclick = () => {
    if (player.isPlaying) {
      player.pause();
      playBtn.textContent = 'Play';
    } else {
      player.play();
      playBtn.textContent = 'Pause';
    }
  };

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.style.cssText = `
    background: #2195f39e;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    margin: 0 5px;
    cursor: pointer;
    font-size: 14px;
  `;
  nextBtn.onmouseover = () => nextBtn.style.background = '#0b7dda';
  nextBtn.onmouseout = () => nextBtn.style.background = '#2196F3';
  nextBtn.onclick = () => {
    player.next();
    title.textContent = player.getCurrentSong().title;
  };

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Prev';
  prevBtn.style.cssText = `
    background: #2195f39e;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    margin: 0 5px;
    cursor: pointer;
    font-size: 14px;
  `;
  prevBtn.onmouseover = () => prevBtn.style.background = '#0b7dda';
  prevBtn.onmouseout = () => prevBtn.style.background = '#2196F3';
  prevBtn.onclick = () => {
    player.previous();
    title.textContent = player.getCurrentSong().title;
  };

  const volumeLabel = document.createElement('div');
  volumeLabel.textContent = 'Volum';
  volumeLabel.style.marginTop = '10px';
  volumeLabel.style.fontSize = '12px';

  const volumeSlider = document.createElement('input');
  volumeSlider.type = 'range';
  volumeSlider.min = '0';
  volumeSlider.max = '1';
  volumeSlider.step = '0.1';
  volumeSlider.value = '0.5';
  volumeSlider.style.width = '100%';
  volumeSlider.oninput = () => player.setVolume(volumeSlider.value);

  controls.appendChild(title);
  controls.appendChild(prevBtn);
  controls.appendChild(playBtn);
  controls.appendChild(nextBtn);
  controls.appendChild(volumeLabel);
  controls.appendChild(volumeSlider);

  // Toggle functionality
  toggleBtn.onclick = () => {
    controls.style.display = controls.style.display === 'none' ? 'block' : 'none';
  };

  mainDiv.appendChild(toggleBtn);
  mainDiv.appendChild(controls);

  container.appendChild(mainDiv);

  return player;
}

function toggleAudio() {
  const btn = document.getElementById('audio-toggle');
  if (audioPlayer.isPlaying) {
    audioPlayer.pause();
    if (btn) btn.textContent = 'Audio: OFF';
  } else {
    audioPlayer.play();
    if (btn) btn.textContent = 'Audio: ON';
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AudioPlayer, audioPlayer, initAudioPlayer, toggleAudio };
} else if (typeof window !== 'undefined') {
  window.AudioPlayer = AudioPlayer;
  window.audioPlayer = audioPlayer;
  window.initAudioPlayer = initAudioPlayer;
  window.toggleAudio = toggleAudio;
}

// ES module exports
export { AudioPlayer, audioPlayer, initAudioPlayer, toggleAudio };