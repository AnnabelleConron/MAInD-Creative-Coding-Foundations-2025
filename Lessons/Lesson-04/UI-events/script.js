song1 = "https://cdn.pixabay.com/download/audio/2025/10/28/audio_4285598df8.mp3?filename=groovy-vibe-427121.mp3";
song2 = "https://cdn.pixabay.com/download/audio/2022/05/17/audio_407815a564.mp3?filename=stomping-rock-four-shots-111444.mp3";

const player = document.getElementById('player');
const currentSong = document.getElementById('current-song');

document.addEventListener('keydown', (keyEvent) => {
  const key = keyEvent.key;

  if(key == "1" || key == "2") {
    changeSong(key);
  }
  else if(key == " ") {
    togglePlayback();
  }
})

function togglePlayback() {
  if(player.paused) {
    player.play();
  } else {
    player.pause();
  }
}

function changeSong(track) {
  switch(track) {
    case "1":
      player.src = song1;
      currentSong.innerHTML = "1";
      break;
    case "2":
      player.src = song2;
      currentSong.innerHTML = "2";
      break;
  }
}

window.addEventListener("load", () => {
  changeSong("1");
})