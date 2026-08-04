/* ==================================================
   MUSIC AND SOUND EFFECTS
================================================== */

let audioContext;
let musicTimer = null;
let musicPosition = 0;
let soundEnabled = true;

const melody = [
  523.25, 659.25, 783.99, 659.25,
  587.33, 698.46, 880.00, 698.46,
  659.25, 783.99, 987.77, 783.99,
  587.33, 698.46, 783.99, 523.25
];

function prepareAudio() {
  if (!audioContext) {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    audioContext = new AudioContext();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playTone(
  frequency,
  duration = 0.2,
  type = "triangle",
  volume = 0.15,
  delay = 0
) {
  if (!soundEnabled) return;

  prepareAudio();

  const startTime = audioContext.currentTime + delay;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(
    frequency,
    startTime
  );

  gain.gain.setValueAtTime(
    0.001,
    startTime
  );

  gain.gain.exponentialRampToValueAtTime(
    volume,
    startTime + 0.03
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    startTime + duration
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.1);
}

function playMusicNote() {
  if (!soundEnabled) return;

  const note =
    melody[musicPosition % melody.length];

  // Main melody
  playTone(
    note,
    0.28,
    "triangle",
    0.11
  );

  // Soft accompanying note
  if (musicPosition % 2 === 0) {
    playTone(
      note / 2,
      0.35,
      "sine",
      0.055
    );
  }

  musicPosition++;
}

function startBackgroundMusic() {
  if (!soundEnabled) return;

  prepareAudio();
  stopBackgroundMusic();

  musicPosition = 0;

  // Play immediately
  playMusicNote();

  musicTimer = setInterval(
    playMusicNote,
    380
  );
}

function stopBackgroundMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

function playButtonSound() {
  playTone(
    440,
    0.08,
    "sine",
    0.15
  );

  playTone(
    554.37,
    0.12,
    "sine",
    0.15,
    0.07
  );
}

function playCorrectSound() {
  playTone(
    523.25,
    0.16,
    "triangle",
    0.22
  );

  playTone(
    659.25,
    0.16,
    "triangle",
    0.22,
    0.12
  );

  playTone(
    783.99,
    0.3,
    "triangle",
    0.25,
    0.24
  );
}

function playWrongSound() {
  playTone(
    220,
    0.18,
    "sawtooth",
    0.12
  );

  playTone(
    174.61,
    0.25,
    "sawtooth",
    0.1,
    0.15
  );
}

function playFinishSound() {
  const finishNotes = [
    523.25,
    659.25,
    783.99,
    1046.5
  ];

  finishNotes.forEach(
    (note, index) => {
      playTone(
        note,
        index === 3 ? 0.6 : 0.2,
        "triangle",
        0.22,
        index * 0.15
      );
    }
  );
}

function updateSoundButton() {
  soundButton.textContent =
    soundEnabled
      ? "🔊 Music On"
      : "🔇 Music Off";

  soundButton.classList.toggle(
    "muted",
    !soundEnabled
  );
}

soundButton.addEventListener(
  "click",
  async () => {
    prepareAudio();

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      playButtonSound();
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }

    updateSoundButton();
  }
);
