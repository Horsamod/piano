document.documentElement.ondragstart = function () {
  return false;
};
document.documentElement.ontouchmove = function () {
  return true;
};
var mouse_IsDown = false;
document.documentElement.addEventListener("mousedown", function () {
  mouse_IsDown = true;
});
document.documentElement.addEventListener("mouseup", function () {
  mouse_IsDown = false;
});


document.addEventListener("DOMContentLoaded", () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const keys = document.querySelectorAll(".key");
  const waveSineButton = document.getElementById("waveSine");
  const waveSquareButton = document.getElementById("waveSquare");
  const waveTriangleButton = document.getElementById("waveTriangle");
  const waveSawtoothButton = document.getElementById("waveSawtooth");
  const waveOrganButton = document.getElementById("waveOrgan");
  const waveStringButton = document.getElementById("waveString");
  const waveFluteButton = document.getElementById("waveFlute");
  const waveDrumButton = document.getElementById("waveDrum");

  const touchEffectCheckbox = document.getElementById("touchEffect");
  const reverbEffectCheckbox = document.getElementById("reverbEffect");
  const chorusEffectCheckbox = document.getElementById("chorusEffect");


/* -------------------------------------------------------------------------- */
/*                                  Key Event                                 */
/* -------------------------------------------------------------------------- */

  const touchedKeys = [];

  keys.forEach((key) => {
    key.addEventListener("mousedown", () => {
      playNote(key);
      if (isRecording) {
        playNoteOnKeydown(key);
      }
      updateBlocksContainer(key.dataset.note, true);
    });
    key.addEventListener("touchstart", () => {
      playNote(key);
      if (isRecording) {
        playNoteOnKeydown(key);
      }
      updateBlocksContainer(key.dataset.note, true);
    });

    key.addEventListener("mouseover", () => {
      if (mouse_IsDown) playNote(key);
    });
    key.addEventListener("mouseleave", () => {
      releaseNote(key);
      key.classList.remove("active");
    });
    key.addEventListener("mouseup", () => {
      releaseNote(key);
      key.classList.remove("active");
      updateBlocksContainer(key.dataset.note, false);
    });

    key.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (!touchedKeys.includes(key)) {
          touchedKeys.push(key);
          playNote(key);
          if (isRecording) {
              playNoteOnKeydown(key);
          }
          updateBlocksContainer(key.dataset.note, true);
      }
  });

  key.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const touchedKey = document.elementFromPoint(touch.clientX, touch.clientY);
      if (touchedKey && touchedKey.classList.contains("key")) {
          if (!touchedKeys.includes(touchedKey)) {
              touchedKeys.forEach((key) => {
                  releaseNote(key);
                  key.classList.remove("active");
                  updateBlocksContainer(key.dataset.note, false);
              });
              touchedKeys.length = 0;
              
              touchedKeys.push(touchedKey);
              playNote(touchedKey);
              if (isRecording) {
                  playNoteOnKeydown(touchedKey);
              }
              updateBlocksContainer(touchedKey.dataset.note, true);
          }
      }
  });
  key.addEventListener("touchend", () => {
      touchedKeys.forEach((key) => {
          releaseNote(key);
          key.classList.remove("active");
          updateBlocksContainer(key.dataset.note, false);
      });
      touchedKeys.length = 0;
  });

  });


/* -------------------------------------------------------------------------- */
/*                           Wave Or Tone Instrument                          */
/* -------------------------------------------------------------------------- */
  waveSineButton.addEventListener("click", () => setWaveStyle("sine"));
  waveSquareButton.addEventListener("click", () => setWaveStyle("square"));
  waveTriangleButton.addEventListener("click", () => setWaveStyle("triangle"));
  waveSawtoothButton.addEventListener("click", () => setWaveStyle("sawtooth"));
  waveOrganButton.addEventListener("click", () => setWaveStyle("organ"));
  waveStringButton.addEventListener("click", () => setWaveStyle("string"));
  waveFluteButton.addEventListener("click", () => setWaveStyle("flute"));
  waveDrumButton.addEventListener("click", () => setWaveStyle("drum"));

/* --------------------------------- Default -------------------------------- */
 
const referenceFrequency = 440.0; // Reference frequency for A4

let currentWaveStyle = localStorage.getItem("waveStyle") || "sine";
  let currentSampleRate = 16000;
  let currentBaseFrequency = 440;
  let currentSoundDuration = 0.9;
  let currentFrequencies = {
    "C": referenceFrequency * Math.pow(2, -9/12),
    "C#": referenceFrequency * Math.pow(2, -8/12),
    "D": referenceFrequency * Math.pow(2, -7/12),
    "D#": referenceFrequency * Math.pow(2, -6/12),
    "E": referenceFrequency * Math.pow(2, -5/12),
    "F": referenceFrequency * Math.pow(2, -4/12),
    "F#": referenceFrequency * Math.pow(2, -3/12),
    "G": referenceFrequency * Math.pow(2, -2/12),
    "G#": referenceFrequency * Math.pow(2, -1/12),
    "A": referenceFrequency,
    "A#": referenceFrequency * Math.pow(2, 1/12),
    "B": referenceFrequency * Math.pow(2, 2/12),
    "C2": referenceFrequency * Math.pow(2, 3/12),
    "C#2": referenceFrequency * Math.pow(2, 4/12),
    "D2": referenceFrequency * Math.pow(2, 5/12),
    "D#2": referenceFrequency * Math.pow(2, 6/12),
    "E2": referenceFrequency * Math.pow(2, 7/12),
    "F2": referenceFrequency * Math.pow(2, 8/12),
    "F#2": referenceFrequency * Math.pow(2, 9/12),
    "G2": referenceFrequency * Math.pow(2, 10/12),
    "G#2": referenceFrequency * Math.pow(2, 11/12),
    "A2": referenceFrequency * Math.pow(2, 12/12),
    "A#2": referenceFrequency * Math.pow(2, 13/12),
    "B2": referenceFrequency * Math.pow(2, 14/12),
    "C3": referenceFrequency * Math.pow(2, 15/12),
    "C#3": referenceFrequency * Math.pow(2, 16/12),
    "D3": referenceFrequency * Math.pow(2, 17/12),
    "D#3": referenceFrequency * Math.pow(2, 18/12),
    "E3": referenceFrequency * Math.pow(2, 19/12),
    "F3": referenceFrequency * Math.pow(2, 20/12),
    "F#3": referenceFrequency * Math.pow(2, 21/12),
    "G3": referenceFrequency * Math.pow(2, 22/12),
    "G#3": referenceFrequency * Math.pow(2, 23/12),
    "A3": referenceFrequency * Math.pow(2, 24/12),
    "A#3": referenceFrequency * Math.pow(2, 25/12),
    "B3": referenceFrequency * Math.pow(2, 26/12),
  };
  let currentHarmonicAmplitudes = [0.125, 0.25, 0.1];


  function updateWaveStyleButtons() {
    const buttons = [
      waveSineButton,
      waveSquareButton,
      waveTriangleButton,
      waveSawtoothButton,
      waveOrganButton,
      waveStringButton,
      waveFluteButton,
      waveDrumButton,
    ];
    buttons.forEach((button) => {
      button.disabled = button.id === "wave" + currentWaveStyle.charAt(0).toUpperCase() + currentWaveStyle.slice(1);
    });
  }
  updateWaveStyleButtons();

  function setWaveStyle(style) {
    currentWaveStyle = style;
    updateWaveStyleButtons();

    switch (style) {
      case "organ":
        currentSampleRate = 22050;
        currentBaseFrequency = 220;
        currentSoundDuration = 0.8;
        currentFrequencies = {
          "C": referenceFrequency * Math.pow(2, -9/12),
    "C#": referenceFrequency * Math.pow(2, -8/12),
    "D": referenceFrequency * Math.pow(2, -7/12),
    "D#": referenceFrequency * Math.pow(2, -6/12),
    "E": referenceFrequency * Math.pow(2, -5/12),
    "F": referenceFrequency * Math.pow(2, -4/12),
    "F#": referenceFrequency * Math.pow(2, -3/12),
    "G": referenceFrequency * Math.pow(2, -2/12),
    "G#": referenceFrequency * Math.pow(2, -1/12),
    "A": referenceFrequency,
    "A#": referenceFrequency * Math.pow(2, 1/12),
    "B": referenceFrequency * Math.pow(2, 2/12),
    "C2": referenceFrequency * Math.pow(2, 3/12),
    "C#2": referenceFrequency * Math.pow(2, 4/12),
    "D2": referenceFrequency * Math.pow(2, 5/12),
    "D#2": referenceFrequency * Math.pow(2, 6/12),
    "E2": referenceFrequency * Math.pow(2, 7/12),
    "F2": referenceFrequency * Math.pow(2, 8/12),
    "F#2": referenceFrequency * Math.pow(2, 9/12),
    "G2": referenceFrequency * Math.pow(2, -10/12),
    "G#2": referenceFrequency * Math.pow(2, -11/12),
    "A2": referenceFrequency * Math.pow(2, -12/12),
    "A#2": referenceFrequency * Math.pow(2, -13/12),
    "B2": referenceFrequency * Math.pow(2, -14/12),
    "C3": referenceFrequency * Math.pow(2, -15/12),
    "C#3": referenceFrequency * Math.pow(2, -16/12),
    "D3": referenceFrequency * Math.pow(2, -17/12),
    "D#3": referenceFrequency * Math.pow(2, -18/12),
    "E3": referenceFrequency * Math.pow(2, -19/12),
    "F3": referenceFrequency * Math.pow(2, -20/12),
    "F#3": referenceFrequency * Math.pow(2, -21/12),
    "G3": referenceFrequency * Math.pow(2, -22/12),
    "G#3": referenceFrequency * Math.pow(2, -23/12),
    "A3": referenceFrequency * Math.pow(2, -24/12),
    "A#3": referenceFrequency * Math.pow(2, -25/12),
    "B3": referenceFrequency * Math.pow(2, -26/12),
        };
        currentHarmonicAmplitudes = [0.125, 0.25, 0.1];
        break;
      case "string":
        currentSampleRate = 32000;
        currentBaseFrequency = 440;
        currentSoundDuration = 1.0;
        currentFrequencies = {
          "C": referenceFrequency * Math.pow(2, -9/12),
    "C#": referenceFrequency * Math.pow(2, -8/12),
    "D": referenceFrequency * Math.pow(2, -7/12),
    "D#": referenceFrequency * Math.pow(2, -6/12),
    "E": referenceFrequency * Math.pow(2, -5/12),
    "F": referenceFrequency * Math.pow(2, -4/12),
    "F#": referenceFrequency * Math.pow(2, -3/12),
    "G": referenceFrequency * Math.pow(2, -2/12),
    "G#": referenceFrequency * Math.pow(2, -1/12),
    "A": referenceFrequency,
    "A#": referenceFrequency * Math.pow(2, 1/12),
    "B": referenceFrequency * Math.pow(2, 2/12),
    "C2": referenceFrequency * Math.pow(2, 3/12),
    "C#2": referenceFrequency * Math.pow(2, 4/12),
    "D2": referenceFrequency * Math.pow(2, 5/12),
    "D#2": referenceFrequency * Math.pow(2, 6/12),
    "E2": referenceFrequency * Math.pow(2, 7/12),
    "F2": referenceFrequency * Math.pow(2, 8/12),
    "F#2": referenceFrequency * Math.pow(2, 9/12),
    "G2": referenceFrequency * Math.pow(2, 10/12),
    "G#2": referenceFrequency * Math.pow(2, 11/12),
    "A2": referenceFrequency * Math.pow(2, 12/12),
    "A#2": referenceFrequency * Math.pow(2, 13/12),
    "B2": referenceFrequency * Math.pow(2, 14/12),
    "C3": referenceFrequency * Math.pow(2, 15/12),
    "C#3": referenceFrequency * Math.pow(2, 16/12),
    "D3": referenceFrequency * Math.pow(2, 17/12),
    "D#3": referenceFrequency * Math.pow(2, 18/12),
    "E3": referenceFrequency * Math.pow(2, 19/12),
    "F3": referenceFrequency * Math.pow(2, 20/12),
    "F#3": referenceFrequency * Math.pow(2, 21/12),
    "G3": referenceFrequency * Math.pow(2, 22/12),
    "G#3": referenceFrequency * Math.pow(2, 23/12),
    "A3": referenceFrequency * Math.pow(2, 24/12),
    "A#3": referenceFrequency * Math.pow(2, 25/12),
    "B3": referenceFrequency * Math.pow(2, 26/12),
        };
        currentHarmonicAmplitudes = [0.125, 0.25, 0.1];
        break;
      case "flute":
        currentSampleRate = 24000;
        currentBaseFrequency = 440;
        currentSoundDuration = 0.6;
        currentFrequencies = {
          "C": referenceFrequency * Math.pow(2, -9/12),
    "C#": referenceFrequency * Math.pow(2, -8/12),
    "D": referenceFrequency * Math.pow(2, -7/12),
    "D#": referenceFrequency * Math.pow(2, -6/12),
    "E": referenceFrequency * Math.pow(2, -5/12),
    "F": referenceFrequency * Math.pow(2, -4/12),
    "F#": referenceFrequency * Math.pow(2, -3/12),
    "G": referenceFrequency * Math.pow(2, -2/12),
    "G#": referenceFrequency * Math.pow(2, -1/12),
    "A": referenceFrequency,
    "A#": referenceFrequency * Math.pow(2, 1/12),
    "B": referenceFrequency * Math.pow(2, 2/12),
    "C2": referenceFrequency * Math.pow(2, 3/12),
    "C#2": referenceFrequency * Math.pow(2, 4/12),
    "D2": referenceFrequency * Math.pow(2, 5/12),
    "D#2": referenceFrequency * Math.pow(2, 6/12),
    "E2": referenceFrequency * Math.pow(2, 7/12),
    "F2": referenceFrequency * Math.pow(2, 8/12),
    "F#2": referenceFrequency * Math.pow(2, 9/12),
    "G2": referenceFrequency * Math.pow(2, 10/12),
    "G#2": referenceFrequency * Math.pow(2, 11/12),
    "A2": referenceFrequency * Math.pow(2, 12/12),
    "A#2": referenceFrequency * Math.pow(2, 13/12),
    "B2": referenceFrequency * Math.pow(2, 14/12),
    "C3": referenceFrequency * Math.pow(2, 15/12),
    "C#3": referenceFrequency * Math.pow(2, 16/12),
    "D3": referenceFrequency * Math.pow(2, 17/12),
    "D#3": referenceFrequency * Math.pow(2, 18/12),
    "E3": referenceFrequency * Math.pow(2, 19/12),
    "F3": referenceFrequency * Math.pow(2, 20/12),
    "F#3": referenceFrequency * Math.pow(2, 21/12),
    "G3": referenceFrequency * Math.pow(2, 22/12),
    "G#3": referenceFrequency * Math.pow(2, 23/12),
    "A3": referenceFrequency * Math.pow(2, 24/12),
    "A#3": referenceFrequency * Math.pow(2, 25/12),
    "B3": referenceFrequency * Math.pow(2, 26/12),
        };
        currentHarmonicAmplitudes = [0.25, 0.1, 0.05];
        break;
      case "drum":
        currentSampleRate = 16000;
        currentBaseFrequency = 940;
        currentSoundDuration = 0.5;
        currentFrequencies = {
          C: 261.63,
          "C#": 277.18,
          D: 293.66,
          "D#": 311.13,
          E: 329.63,
          F: 349.23,
          "F#": 369.99,
          G: 392.0,
          "G#": 415.3,
          A: 440.0,
          "A#": 466.16,
          B: 493.88,
          C2: 523.25,
          "C#2": 554.37,
          D2: 587.33,
          "D#2": 622.25,
          E2: 659.26,
          F2: 698.46,
          "F#2": 739.99,
          G2: 783.99,
          "G#2": 830.61,
          A2: 880.0,
          "A#2": 932.33,
          B2: 987.77,
        };
        currentHarmonicAmplitudes = [0.125, 0.25, 0.1];
        break;
      default:
        currentSampleRate = 16000;
        currentBaseFrequency = 440;
        currentSoundDuration = 0.6;
        currentFrequencies = {
          "C": referenceFrequency * Math.pow(2, -9/12),
    "C#": referenceFrequency * Math.pow(2, -8/12),
    "D": referenceFrequency * Math.pow(2, -7/12),
    "D#": referenceFrequency * Math.pow(2, -6/12),
    "E": referenceFrequency * Math.pow(2, -5/12),
    "F": referenceFrequency * Math.pow(2, -4/12),
    "F#": referenceFrequency * Math.pow(2, -3/12),
    "G": referenceFrequency * Math.pow(2, -2/12),
    "G#": referenceFrequency * Math.pow(2, -1/12),
    "A": referenceFrequency,
    "A#": referenceFrequency * Math.pow(2, 1/12),
    "B": referenceFrequency * Math.pow(2, 2/12),
    "C2": referenceFrequency * Math.pow(2, 3/12),
    "C#2": referenceFrequency * Math.pow(2, 4/12),
    "D2": referenceFrequency * Math.pow(2, 5/12),
    "D#2": referenceFrequency * Math.pow(2, 6/12),
    "E2": referenceFrequency * Math.pow(2, 7/12),
    "F2": referenceFrequency * Math.pow(2, 8/12),
    "F#2": referenceFrequency * Math.pow(2, 9/12),
    "G2": referenceFrequency * Math.pow(2, 10/12),
    "G#2": referenceFrequency * Math.pow(2, 11/12),
    "A2": referenceFrequency * Math.pow(2, 12/12),
    "A#2": referenceFrequency * Math.pow(2, 13/12),
    "B2": referenceFrequency * Math.pow(2, 14/12),
    "C3": referenceFrequency * Math.pow(2, 15/12),
    "C#3": referenceFrequency * Math.pow(2, 16/12),
    "D3": referenceFrequency * Math.pow(2, 17/12),
    "D#3": referenceFrequency * Math.pow(2, 18/12),
    "E3": referenceFrequency * Math.pow(2, 19/12),
    "F3": referenceFrequency * Math.pow(2, 20/12),
    "F#3": referenceFrequency * Math.pow(2, 21/12),
    "G3": referenceFrequency * Math.pow(2, 22/12),
    "G#3": referenceFrequency * Math.pow(2, 23/12),
    "A3": referenceFrequency * Math.pow(2, 24/12),
    "A#3": referenceFrequency * Math.pow(2, 25/12),
    "B3": referenceFrequency * Math.pow(2, 26/12),
        };
        currentHarmonicAmplitudes = [0.125, 0.25, 0.1];
        break;
    }

    localStorage.setItem("waveStyle", style);
  }


/* -------------------------------------------------------------------------- */
/*                                Effect Event                                */
/* -------------------------------------------------------------------------- */
  touchEffectCheckbox.addEventListener("change", () => {
    touchEffectEnabled = touchEffectCheckbox.checked;
    localStorage.setItem("touchEffectEnabled", touchEffectEnabled);
    if (touchEffectEnabled) {
      equalizer.style.display = "flex";
      eqEnabledCheckbox.checked = true;
    }else{
      equalizer.style.display = "none";
      eqEnabledCheckbox.checked = false;
    }
  });
  reverbEffectCheckbox.addEventListener("change", () => {
    reverbEffectEnabled = reverbEffectCheckbox.checked;
    localStorage.setItem("reverbEffectEnabled", reverbEffectEnabled);
  });
  chorusEffectCheckbox.addEventListener("change", () => {
    chorusEffectEnabled = chorusEffectCheckbox.checked;
    localStorage.setItem("chorusEffectEnabled", chorusEffectEnabled);
  });

  touchEffectEnabled = JSON.parse(localStorage.getItem("touchEffectEnabled"));
  reverbEffectEnabled = JSON.parse(localStorage.getItem("reverbEffectEnabled"));
  chorusEffectEnabled = JSON.parse(localStorage.getItem("chorusEffectEnabled"));

  touchEffectCheckbox.checked = touchEffectEnabled;
  reverbEffectCheckbox.checked = reverbEffectEnabled;
  chorusEffectCheckbox.checked = chorusEffectEnabled;

/* -------------------------------------------------------------------------- */
/*                              PlayNot Function                              */
/* -------------------------------------------------------------------------- */
  function playNote(key) {
    if (key.source) {
      key.source.stop();
      key.source = null;
    }

    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    const waveform = generateWaveform(
      getFrequency(key.dataset.note),
      currentSampleRate,
      currentBaseFrequency,
      currentWaveStyle,
      currentSoundDuration,
      currentHarmonicAmplitudes
    );

    if (currentWaveStyle === "string") {
      const oscillator = audioContext.createOscillator();
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(
        getFrequency(key.dataset.note),
        audioContext.currentTime
      );
      oscillator.connect(gainNode);
      oscillator.start();
      // key.oscillator = oscillator;

      oscillator.onended = () => {
        if (key.oscillator === oscillator) {
          const now = audioContext.currentTime;
          gainNode.gain.setValueAtTime(gainNode.gain.value, now);
          gainNode.gain.linearRampToValueAtTime(0, now + 2); // 2-second fade-out
          key.oscillator = null;
        }
      };
    }

    if (currentWaveStyle === "flute") {
      gainNode.gain.setValueAtTime(5, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(25, audioContext.currentTime + currentSoundDuration);
    }

/* ---------------------------- For Effect Apply ---------------------------- */
    if (touchEffectEnabled) {
      gainNode.connect(delayNode);
      delayNode.connect(feedbackGain);
      feedbackGain.connect(delayNode);

      eqEnabledCheckbox.checked = true;
    }

    if (reverbEffectEnabled) {  
      applyReverbEffect(waveform);
      
      delayNode.connect(feedbackGain); 
      feedbackGain.connect(delayNode)
      attackGain.connect(delayNode);
      delayNode.connect(audioContext.destination);
    }
    if (chorusEffectEnabled) {
      applyChorusEffect(waveform);
    }

/* --------------------------------- default -------------------------------- */
    const buffer = audioContext.createBuffer(
      1,
      waveform.length,
      currentSampleRate
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < waveform.length; i++) {
      data[i] = waveform[i];
    }
    

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNode);
    source.start();

    key.source = source;
    key.gainNode = gainNode;
    key.classList.add("active");

    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0,
      audioContext.currentTime + currentSoundDuration
    );

    source.onended = () => {
      key.isPressed = false;
      key.source = null;
      key.gainNode = null;
    };

    /* ------------------------------ Volome Update ----------------------------- */
    const volumeSlider = document.getElementById("volumeSlider");
    const volume = parseFloat(volumeSlider.value);

for (const key in audioElements) {
  audioElements[key].volume = volumeSlider.value;
}

volumeSlider.addEventListener("input", () => {
  const volume = volumeSlider.value;
  for (const key in audioElements) {
    audioElements[key].volume = volume;
  }
});

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0,
      audioContext.currentTime + currentSoundDuration
    );

    if (currentWaveStyle === "drum") {
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0,
        audioContext.currentTime + currentSoundDuration
      );
    }

  }

/* -------------------------------------------------------------------------- */
/*                            ReleaseNote Function                            */
/* -------------------------------------------------------------------------- */

  function releaseNote(key) {
    if (key.isPressed) {
      key.isPressed = false;

      if (key.gainNode) {
        const now = audioContext.currentTime;
        key.gainNode.gain.setValueAtTime(key.gainNode.gain.value, now);
        key.gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        key.gainNode.disconnect();
        key.gainNode = null;
      }

      if (key.source) {
        const now = audioContext.currentTime;
        key.source.stop(now + 0.1);
        key.source.disconnect();
        key.source = null;
      }
    }

    if (key.oscillator) {
      key.oscillator.stop();
      key.oscillator = null;
    }

  }


/* -------------------------------------------------------------------------- */
/*                        Frequency And Wave Generating                       */
/* -------------------------------------------------------------------------- */

  function getFrequency(note) {
    return currentFrequencies[note];
  }

  function generateWaveform(
    frequency,
    sampleRate,
    baseFrequency,
    waveStyle,
    duration,
    harmonicAmplitudes
  ) {
    const numSamples = Math.ceil(sampleRate * duration);
    const waveform = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
      let sample = 0;

      if (waveStyle === "sine") {

        for (let h = 0; h < harmonicAmplitudes.length; h++) {
          const harmonicFreq = frequency * (h + 1);
          sample += harmonicAmplitudes[h] * Math.sin(3 * Math.PI * harmonicFreq * i / sampleRate);
        }
        
      } else if (waveStyle === "square") {
        for (let h = 1; h <= 10; h += 2) {
          sample +=
            Math.sin((2 * Math.PI * frequency * h * i) / sampleRate) / h;
        }
        sample *= 4 / Math.PI;
      } else if (waveStyle === "triangle") {
        for (let h = 1; h <= 20; h += 2) {
          sample +=
            Math.sin((2 * Math.PI * frequency * h * i) / sampleRate) / (h * h);
        }
        sample *= 8 / (Math.PI * Math.PI);
      } else if (waveStyle === "sawtooth") {
        for (let h = 1; h <= 20; h++) {
          sample +=
            Math.sin((2 * Math.PI * frequency * h * i) / sampleRate) / h;
        }
        sample *= 2 / Math.PI;
      } 

      //////////////////////////////////////////
      else if (waveStyle === "drum") {
        for (let h = 0; h < harmonicAmplitudes.length; h++) {
          const harmonicFreq = frequency * (h + 1);
          sample += harmonicAmplitudes[h] * Math.sin(2 * Math.PI * harmonicFreq * i / sampleRate);
        }
      }else if (waveStyle === "organ"){
        for (let h = 0; h < harmonicAmplitudes.length; h++) {
          const harmonicFreq = frequency * (h + 85);  //95/125
            sample +=
            harmonicAmplitudes[h] *
            Math.sin((0.1 * Math.PI * harmonicFreq * i) / sampleRate);
        }
      }else if (waveStyle === "string"){
        for (let h = 0; h < harmonicAmplitudes.length; h++) {
          const harmonicFreq = frequency * (h + 5);
            sample +=
            harmonicAmplitudes[h] *
            Math.sin((25 * Math.PI * harmonicFreq * i) / sampleRate);
        }
      }else if (waveStyle === "flute"){
        for (let h = 0; h < harmonicAmplitudes.length; h++) {
          const harmonicFreq = frequency * (h + 4);
            sample +=
            harmonicAmplitudes[h] *
            Math.sin((0.5 * Math.PI * harmonicFreq * i) / sampleRate);
        }
      }else {
        for (let h = 0; h < harmonicAmplitudes.length; h++) {
          const harmonicFreq = frequency * (h + 5);
            sample +=
            harmonicAmplitudes[h] *
            Math.sin((25 * Math.PI * harmonicFreq * i) / sampleRate);
        }
      }

      waveform[i] = sample;
    }

    return waveform;
  }

/* -------------------------------------------------------------------------- */
/*                                 Note Labels                                */
/* -------------------------------------------------------------------------- */

  const showDataNoteCheckbox = document.getElementById("showDataNoteCheckbox");
  const showKeymapCheckbox = document.getElementById("showKeymapCheckbox");
  const storedShowNoteLabels = localStorage.getItem("showNoteLabels");
  const storedShowKeymap = localStorage.getItem("showKeymap");
  
  showDataNoteCheckbox.checked = false;
  showKeymapCheckbox.checked = false;

  if (storedShowNoteLabels === null || storedShowNoteLabels === "true") {
    showDataNoteCheckbox.checked = true;
    toggleShowDataNote();
  }
  if (storedShowKeymap === null || storedShowKeymap === "false") {
    showKeymapCheckbox.checked = false;
    toggleShowDataNote();
  }
  showDataNoteCheckbox.addEventListener("change", () => {
    toggleShowDataNote();
    localStorage.setItem("showNoteLabels", showDataNoteCheckbox.checked);
    showKeymapCheckbox.checked = false;
    toggleShowKeymap();
  });
  showKeymapCheckbox.addEventListener("change", () => {
    toggleShowKeymap();
    localStorage.setItem("showKeymap", showKeymapCheckbox.checked);
    showDataNoteCheckbox.checked = false;
    toggleShowDataNote();
  });
  
  function toggleShowDataNote() {
    const whiteKeys = document.querySelectorAll(".key");
  
    if (showDataNoteCheckbox.checked) {
      whiteKeys.forEach((whiteKey) => {
        const dataNote = whiteKey.dataset.note;
        const noteLabel = document.createElement("div");
        noteLabel.className = "note-label";
        noteLabel.textContent = dataNote;
        whiteKey.appendChild(noteLabel);
      });
    } else {
      const noteLabels = document.querySelectorAll(".note-label");
      noteLabels.forEach((noteLabel) => {
        noteLabel.parentNode.removeChild(noteLabel);
      });
    }
  }

  /* -------------------------- show keymapeNote ------------------------- */

  function toggleShowKeymap() {
    const keyMapping = {
      'C'  : 'A',
      'C#' : 'Q',
      'D'  : 'S',
      'D#' : 'W',
      'E'  : 'D',
      'F'  : 'F',
      'F#' : 'E',
      'G'  : 'G',
      'G#' : 'R',
      'A'  : 'H',
      'A#' : 'T',
      'B'  : 'J',
      'C2' : 'K',
      'C#2': 'Y',
      'D2' : 'L',
      'D#2': 'U',
      'E2' : ';',
      'F2' : '/',
      'F#2': 'I',
      'G2' : '.',
      'G#2': 'O',
      'A2' : ',',
      'A#2': 'P',
      'B2' : 'M',
      'C3' : 'N',
      'C#3': '[',
      'D3' : 'B',
      'D#3': ']',
      'E3' : 'V',
      'F3' : 'C',
      'F#3': '7',
      'G3' : 'X',
      'G#3': '8',
      'A3' : 'Z',
      'A#3': '9',
      'B3' : '0',
    };
  
    const whiteKeys = document.querySelectorAll(".key");
  
    if (showKeymapCheckbox.checked) {
      whiteKeys.forEach((whiteKey) => {
        const dataNote = whiteKey.dataset.note;
        const keymapLabel = document.createElement("div");
        keymapLabel.className = "keymap-label";
        keymapLabel.textContent = keyMapping[dataNote] || '';
        whiteKey.appendChild(keymapLabel);
      });
    } else {
      const keymapLabels = document.querySelectorAll(".keymap-label");
      keymapLabels.forEach((keymapLabel) => {
        keymapLabel.remove();
      });
    }
  }


/* -------------------------------------------------------------------------- */
/*                                   KeyMap                                   */
/* -------------------------------------------------------------------------- */

const keyToNoteMap = {
  a: "C",
  q: "C#",
  s: "D",
  w: "D#",
  d: "E",
  f: "F",
  e: "F#",
  g: "G",
  r: "G#",
  h: "A",
  t: "A#",
  j: "B",
  k: "C2",
  y: "C#2",
  l: "D2",
  u: "D#2",
  ";": "E2",
  "/": "F2",
  i: "F#2",
  ".": "G2",
  o: "G#2",
  ",": "A2",
  p: "A#2",
  m: "B2",
  n: "C3",
  "[": "C#3",
  b: "D3",
  "]": "D#3",
  v: "E3",
  c: "F3",
  7: "F#3",
  x: "G3",
  8: "G#3",
  z: "A3",
  9: "A#3",
  0: "B3",
};

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (keyToNoteMap.hasOwnProperty(key)) {
      const note = keyToNoteMap[key];
      const keyElement = document.querySelector(`[data-note="${note}"]`);
      if (keyElement) {
        playNote(keyElement);
        if (isRecording) {
          recordedNotes.push({ note, timestamp: audioContext.currentTime });
        }
        updateBlocksContainer(keyElement.dataset.note, true);
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    if (keyToNoteMap.hasOwnProperty(key)) {
      const note = keyToNoteMap[key];
      const keyElement = document.querySelector(`[data-note="${note}"]`);
      if (keyElement) {
        keyElement.classList.remove("active");
        releaseNote(keyElement);
        updateBlocksContainer(keyElement.dataset.note, false);
      }
    }
  });


/* -------------------------------------------------------------------------- */
/*                               Record And Play                              */
/* -------------------------------------------------------------------------- */

  const clearRecordButton = document.getElementById("clearRecordButton");
  const recordButton = document.getElementById("recordButton");
  const playButton = document.getElementById("playButton");

  let isRecording = false;
  let recordedNotes = [];
  let startTime = 0;

  recordButton.addEventListener("click", () => {
    if (isRecording) {
      isRecording = false;
      recordButton.textContent = "⬤";
      recordButton.classList.remove("recording");
      startTime = 0;
    } else {
      isRecording = true;
      recordButton.classList.add("recording");
      recordButton.textContent = "■";
      recordedNotes = [];
      startTime = audioContext.currentTime;
    }
  });

/* ---------------------------------- Play Function ---------------------------------- */
  playButton.addEventListener("click", () => {
    if (recordedNotes.length > 0) {
      playButton.classList.add("playing");
      playRecordedNotes();
    }
  });

  function playRecordedNotes() {
    let currentTime = audioContext.currentTime;
    const playButton = document.getElementById("playButton");
    updateBlocksContainer(playButton, true);

    recordedNotes.forEach((recordedNote, index) => {
      const delay = recordedNote.timestamp - startTime + currentTime;
      setTimeout(() => {
        const keyElement = document.querySelector(
          `[data-note="${recordedNote.note}"]`
        );
        if (keyElement) {
          playNoteOnKeydown(keyElement);

          if (index === recordedNotes.length - 1) {
            setTimeout(() => {
              playButton.classList.remove("playing");
              updateBlocksContainer(playButton, false);
            }, (delay + recordedNote.duration) * 500);
          }
        }
      }, delay * 500);
      currentTime = recordedNote.timestamp;
    });
  }

/* ------------------------------- ClearRecord ------------------------------ */
  clearRecordButton.addEventListener("click", clearRecordedNotes);

  function clearRecordedNotes() {
    recordedNotes = [];
  }

  function playNoteOnKeydown(key) {
    if (!key.isPressed) {
      const now = audioContext.currentTime;
      playNote(key);
      key.isPressed = true;
      key.classList.add("active");
      key.source.onended = () => {
        key.classList.remove("active");
        key.isPressed = false;
      };

      if (isRecording) {
        recordedNotes.push({ note: key.dataset.note, timestamp: now });
      }
    }
  }


/* -------------------------------------------------------------------------- */
/*                                   Effect                                   */
/* -------------------------------------------------------------------------- */

function applyReverbEffect(waveform, decayFactor = 0.5) {
  const reverbLength = Math.floor(currentSampleRate * 2.0);
  const reverberatedWaveform = new Float32Array(waveform.length + reverbLength);
  for (let i = 0; i < waveform.length; i++) {
      reverberatedWaveform[i] = waveform[i];
  }
  for (let i = 0; i < reverbLength; i++) {
      reverberatedWaveform[waveform.length + i] = waveform[i] * decayFactor;
  }
  return reverberatedWaveform;
}
function applyChorusEffect(waveform, delayAmount = 1.05, depth = 2.222) {
  const chorusedWaveform = new Float32Array(waveform.length);
  for (let i = 0; i < waveform.length; i++) {
      const delaySampleIndex = i - Math.floor(delayAmount * (0.5 + Math.sin(20 * Math.PI * i * depth)));
      if (delaySampleIndex >= 0 && delaySampleIndex < waveform.length) {
          chorusedWaveform[i] = (waveform[i] + waveform[delaySampleIndex]) / 3;
      } else {
          chorusedWaveform[i] = waveform[i];
      }
  }
  return chorusedWaveform;
}


    const delayNode = audioContext.createDelay();
    delayNode.connect(audioContext.destination);
    const echoDelayTime = 0.05;
    delayNode.delayTime.setValueAtTime(echoDelayTime, audioContext.currentTime);
    const reverbation = audioContext.createConvolver();
    reverbation.connect(audioContext.destination);

    const feedbackGain = audioContext.createGain();
    feedbackGain.gain.value = 0.8;
    feedbackGain.connect(delayNode);



    const echoDelaySlider = document.getElementById("echoDelaySlider");
const feedbackGainSlider = document.getElementById("feedbackGainSlider");

echoDelaySlider.addEventListener("input", () => {
  const newEchoDelayTime = parseFloat(echoDelaySlider.value);
  delayNode.delayTime.setValueAtTime(newEchoDelayTime, audioContext.currentTime);
});

feedbackGainSlider.addEventListener("input", () => {
  const newFeedbackGain = parseFloat(feedbackGainSlider.value);
  feedbackGain.gain.setValueAtTime(newFeedbackGain, audioContext.currentTime);
});


    const attackGain = audioContext.createGain();
    attackGain.gain.setValueAtTime(0, audioContext.currentTime);
    attackGain.gain.linearRampToValueAtTime(12, audioContext.currentTime + 5);
/* -------------------------------------------------------------------------- */
/*                                 Visualizer                                 */
/* -------------------------------------------------------------------------- */
  
  const shadowColors = [
    '#72ff9c', '#ff73a9', '#ffdf75', '#9e7bff', '#ffffff', '#ff4a4a', '#0026ff', '#00f7ff',
  ];

  const visualizerWrapper = document.createElement("div");
  visualizerWrapper.className = "visualizer-wrapper";

  for (let i = 0; i < 10; i++) {
    const blocksContainer = document.createElement("div");
    blocksContainer.className = "blocks-container";
    blocksContainer.dataset.active = false;

    for (let j = 0; j < 6; j++) {
      const block = document.createElement("div");
      block.className = "block";
      const randomColor =
        shadowColors[Math.floor(Math.random() * shadowColors.length)];
      block.style.boxShadow = `inset 0 0 0 10px ${randomColor}`;
      blocksContainer.appendChild(block);
    }
    visualizerWrapper.appendChild(blocksContainer);
  }
  visualizer.appendChild(visualizerWrapper);

  function updateBlocksContainer(note, isActive) {
    const blocksContainers =
      visualizerWrapper.querySelectorAll(".blocks-container");
    blocksContainers.forEach((blocksContainer) => {
      const activeClass = "active";
      blocksContainer.dataset.active = isActive;

      if (isActive) {
        blocksContainer.classList.add(activeClass);
      } else {
        setTimeout(() => {
          if (blocksContainer.dataset.active === "false") {
            blocksContainer.classList.remove(activeClass);
          }
        }, 1200);
      }
    });
  }

/* -------------------------------------------------------------------------- */
/*                                  Equalizer                                 */
/* -------------------------------------------------------------------------- */
 
const equalizer = document.querySelector(".equalizer");
  const eqEnabledCheckbox = document.getElementById("eqEnabled");
  // let equalizerEnabled = localStorage.getItem("equalizerEnabled") === "true";
  eqEnabledCheckbox.addEventListener("change", () => {
    // localStorage.setItem("equalizerEnabled", equalizerEnabled);
    if (eqEnabledCheckbox.checked) {
      equalizer.style.display = "flex";
    } else {
      equalizer.style.display = "none";
    }
  });

/* ************************************************************************** */
/*                                 BEAT LOOPS                                 */
/* ************************************************************************** */

const buttons = document.querySelectorAll(".loop");
const audioElements = {
  a: new Audio('tomba-009.wav'),
  b: new Audio('turkish-003.ogg'),
  c: new Audio('loop2.wav'),
  d: new Audio('loop3.wav'),
  e: new Audio('loop4.wav'),
};

let selectedButton = null;

for (const key in audioElements) {
  audioElements[key].volume = volumeSlider.value;
}

volumeSlider.addEventListener("input", () => {
  const volume = volumeSlider.value;
  for (const key in audioElements) {
    audioElements[key].volume = volume;
  }
});

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonClass = button.classList[1];

      if (selectedButton === buttonClass) {
        selectedButton = null;
        audioElements[buttonClass].pause();
        audioElements[buttonClass].currentTime = 0;
        button.classList.remove("selected");
        updateBlocksContainer(buttonClass, false);
      } else {
        if (selectedButton) {
          audioElements[selectedButton].pause();
          audioElements[selectedButton].currentTime = 0;
          document.querySelector(`.loop.${selectedButton}`).classList.remove("selected");
          updateBlocksContainer(buttonClass, false);
        }
        selectedButton = buttonClass;
        audioElements[buttonClass].loop = true;
        audioElements[buttonClass].play();
        button.classList.add("selected");
        updateBlocksContainer(buttonClass, true);
      }
    });
  });

/* ************************************************************************** */
/*                                DEMO SEQUENCE                               */
/* ************************************************************************** */
const playNoteButton1 = document.getElementById("playNoteButton1");
const playNoteButton2 = document.getElementById("playNoteButton2");
const playNoteButton3 = document.getElementById("playNoteButton3");
const playNoteButton4 = document.getElementById("playNoteButton4");
const tumHiHoButton = document.getElementById("tumHiHoButton");
const stopNoteButton = document.getElementById("stopNoteButton");
const musicNotesContainer = document.getElementById("musicNotes");
const demoList = document.getElementById("demoList");

const defaultNoteInterval = 300;

const kalHoNaaHoNotes = [
  'E', 'F#', 'G#', 'A', 'B', 'C#2', 'D2', 'E2', 'D2',
  'C#2', 'B', 'A', 'G#', 'F#', 'E', 'D2', 'C#2', 'B',
  'A', 'G#', 'F#', 'E', 'D2', 'C#2', 'B', 'C#2', 'E',
  'G#', 'C3', 'B', 'A', 'G#', 'F#', 'E', 'D2', 'C#2',
  'B', 'C#2', 'E', 'G#', 'C3', 'B', 'A', 'G#', 'F#',
  'E', 'D2', 'C#2', 'B', 'C#2', 'E', 'G#', 'C3', 'B',
  'A', 'G#', 'F#', 'E', 'D2', 'C#2', 'B', 'C#2', 'E',
  'G#', 'C3', 'B', 'A', 'G#', 'F#', 'E', 'D2', 'C#2',
  'B', 'C#2', 'E', 'G#', 'C3', 'B', 'A', 'G#', 'F#',
  'E', 'D2', 'C#2', 'B', 'C#2', 'E', 'G#', 'C3', 'B',
  'A', 'G#', 'F#', 'E', 'D2', 'C#2', 'B', 'C#2', 'E',
  'G#', 'C3', 'B', 'A', 'G#', 'F#', 'E', 'D2', 'C#2',
  'B', 'C#2', 'E', 'G#', 'C3', 'B', 'A', 'G#', 'F#',
  'E', 'D2', 'C#2', 'B', 'C#2', 'E', 'G#', 'C3', 'B',
  'A', 'G#', 'F#', 'E', 'D2', 'C#2', 'B', 'C#2', 'E',
  'G#', 'C3', 'B', 'A', 'G#', 'F#', 'E', 'D2', 'C#2',
  'B', 'C#2', 'E', 'G#', 'C3', 'B', 'A', 'G#', 'F#',
  'F#', 'G#', 'A', 'B', 'C#2', 'D2', 'E2', 'D2', 'C#2',
  'B', 'A', 'G#', 'F#', 'E', 'D2', 'C#2', 'B', 'A',
  'G#', 'F#', 'E', 'D2', 'C#2', 'B', 'C#2', 'E', 'G#',
  'C3', 'B', 'A', 'G#', 'F#', 'E', 'D2', 'C#2', 'B',
  'A', 'G#', 'F#', 'E', 'D2', 'C#2', 'B', 'C#2', 'E',
  'G#', 'C3', 'B', 'A', 'G#', 'F#', 'E', 'D2', 'C#2',
  'B', 'C#2', 'E', 'G#', 'C3', 'B', 'A', 'G#', 'F#',
];

const kaviKhusiKaviGamNotes = [
  'E',  'F#', 'G#', 'B', 'A', 'G#', 'F#', 'E',
    'E', 'F#', 'G#', 'B', 'A', 'G#', 'F#', 'E',
    'E', 'F#', 'G#', 'B', 'C#2', 'A', 'G#', 'E2',
    'E', 'F#', 'G#', 'B', 'A', 'G#', 'F#', 'E',

    'D#', 'F#', 'A', 'G#', 'F#', 'E', 'F#', 'E',
    'D#', 'F#', 'A', 'G#', 'F#', 'E', 'F#', 'E',
    'D#', 'F#', 'A', 'B', 'C#2', 'B', 'A', 'G#',
    'G#2', 'F#2', 'E2', 'F#2', 'E2',

    'E', 'F#', 'G#', 'B', 'A', 'G#', 'F#', 'E',
    'E', 'F#', 'G#', 'B', 'A', 'G#', 'F#', 'E',
    'E', 'F#', 'G#', 'B', 'C#2', 'A', 'G#', 'E2',
    'E', 'F#', 'G#', 'B', 'A', 'G#', 'F#', 'E',

    'D#', 'F#', 'A', 'G#', 'F#', 'E', 'F#', 'E',
    'D#', 'F#', 'A', 'G#', 'F#', 'E', 'F#', 'E',
    'D#', 'F#', 'A', 'B', 'C#2', 'B', 'A', 'G#',
    'G#2', 'F#2', 'E2', 'F#2', 'E2'
];

const twinkleTwinkleNotes = [
  'G', 'A', 'B', 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C2', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C#2', 'B', 'A', 'G', 'F', 'E', 'D', 'C',
  'B', 'A', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'G', 'F', 'E', 'D', 'C',
  'G', 'A', 'B', 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C#2', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2', 'B', 'A', 'G', 'F', 'E', 'D', 'C',
  'B', 'A', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'G', 'F', 'E', 'D', 'C',
  'D2', 'C2', 'B', 'A', 'G', 'F', 'E', 'D', 'C',
  'D', 'C', 'B', 'A', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'G', 'F', 'E', 'D', 'C',
];
const janaGanaManaNotes = [
  'D', 'F#', 'A', 'F#', 'D', 'A', 'B', 'G', 'F#',
  'D', 'F#', 'A', 'F#', 'D', 'A', 'B', 'G', 'F#',
  'D', 'F#', 'A', 'F#', 'D', 'A', 'B', 'G', 'F#',
  'D', 'F#', 'A', 'F#', 'D', 'A', 'B', 'G', 'F#',
  
  'D', 'F#', 'A', 'F#', 'D', 'A', 'B', 'G', 'F#',
  'D', 'F#', 'A', 'F#', 'D', 'A', 'B', 'G', 'F#',
  'D', 'F#', 'A', 'F#', 'D', 'A', 'B', 'G', 'F#',
  'D', 'F#', 'A', 'F#', 'D', 'A', 'B', 'G', 'F#',

  'A', 'B', 'D', 'F#', 'G', 'F#', 'D', 'A', 'B',
  'A', 'B', 'D', 'F#', 'G', 'F#', 'D', 'A', 'B',
  'A', 'B', 'D', 'F#', 'G', 'F#', 'D', 'A', 'B',
  'A', 'B', 'D', 'F#', 'G', 'F#', 'D', 'A', 'B',

  'G', 'A', 'B', 'G', 'F#', 'A', 'G', 'F#', 'E',
  'G', 'A', 'B', 'G', 'F#', 'A', 'G', 'F#', 'E',
  'G', 'A', 'B', 'G', 'F#', 'A', 'G', 'F#', 'E',
  'G', 'A', 'B', 'G', 'F#', 'A', 'G', 'F#', 'E'
];

const tumHiHoHindiNotes = [
  'C#', 'B', 'A', 'G#', 'A', 'B', 'C#', 'C#', 'C#', 'C#',
  'B', 'A', 'G#', 'A', 'B', 'A', 'G#', 'F#', 'E', 'E',
  'F#', 'G#', 'A', 'B', 'C#', 'B', 'A', 'G#', 'A', 'B',
  'C#', 'C#', 'C#', 'C#', 'B', 'A', 'G#', 'A', 'B', 'A',
  'G#', 'F#', 'E', 'E', 'F#', 'G#', 'A', 'B', 'C#', 'B',
  'A', 'G#', 'A', 'B', 'C#', 'B', 'A', 'G#', 'A', 'B',
  'C#', 'C#', 'C#', 'C#', 'B', 'A', 'G#', 'A', 'B', 'A',
  'G#', 'F#', 'E', 'E', 'F#', 'G#', 'A', 'B', 'C#', 'B',
  'A', 'G#', 'A', 'B', 'C#', 'B', 'A', 'G#', 'A', 'B',
  'A', 'B', 'C#', 'B', 'A', 'G#', 'A', 'B', 'C#', 'C#',
  'C#', 'C#', 'B', 'A', 'G#', 'A', 'B', 'A', 'G#', 'F#',
  'E', 'E', 'F#', 'G#', 'A', 'B', 'C#', 'B', 'A', 'G#',
  'A', 'B', 'C#', 'C#', 'C#', 'C#', 'B', 'A', 'G#', 'A',
  'B', 'A', 'G#', 'F#', 'E', 'E', 'F#', 'G#', 'A', 'B',
  'C#', 'B', 'A', 'G#', 'A', 'B', 'C#', 'C#', 'C#', 'C#',
  'B', 'A', 'G#', 'A', 'B', 'A', 'G#', 'F#', 'E', 'E',
  'F#', 'G#', 'A', 'B', 'C#', 'B', 'A', 'G#', 'A', 'B',
  'C#', 'C#', 'C#', 'C#', 'B', 'A', 'G#', 'A', 'B', 'A',
  'G#', 'F#', 'E', 'E', 'F#', 'G#', 'A', 'B', 'C#', 'B',
  'A', 'G#', 'A', 'B', 'C#', 'B', 'A', 'G#', 'A', 'B',
];

let currentNotesArray = [];
let noteIndex = 0;
let noteInterval;

function playNotes(notes) {
  if (noteIndex < notes.length) {
    const currentNote = notes[noteIndex];
    const interval = typeof currentNote === 'object' && currentNote.interval !== undefined
      ? currentNote.interval
      : defaultNoteInterval;
      updateBlocksContainer(currentNote, true);
    if (typeof currentNote === 'object') {
      if (noteInterval) clearTimeout(noteInterval);
      const keyElement = document.querySelector(`[data-note="${currentNote.note}"]`);
      if (keyElement) {
        playNoteOnKeydown(keyElement);
        updateBlocksContainer(keyElement, true);
      }
      noteIndex++;
      noteInterval = setTimeout(() => playNotes(notes), interval);
    } else {
      const keyElement = document.querySelector(`[data-note="${currentNote}"]`);
      if (keyElement) {
        playNoteOnKeydown(keyElement);
        noteIndex++;
        noteInterval = setTimeout(() => playNotes(notes), interval);
        
      }
  }
  } else {
    clearTimeout(noteInterval);
    noteIndex = 0;
    playNoteButton1.disabled = false;
    playNoteButton2.disabled = false;
    playNoteButton3.disabled = false;
    playNoteButton4.disabled = false;
    tumHiHoButton.disabled = false;
    stopNoteButton.classList.remove("stop_active");
    updateBlocksContainer(playNoteButton1, false);
    updateBlocksContainer(playNoteButton2, false);
    updateBlocksContainer(playNoteButton3, false);
    updateBlocksContainer(playNoteButton4, false);
    updateBlocksContainer(tumHiHoButton, false);
  }
}

function stopPlayback() {
  clearTimeout(noteInterval);
  playNoteButton1.disabled = false;
  playNoteButton2.disabled = false;
  playNoteButton3.disabled = false;
  playNoteButton4.disabled = false;
  tumHiHoButton.disabled = false;
  stopNoteButton.classList.remove("stop_active");
  updateBlocksContainer(playNoteButton1, false);
  updateBlocksContainer(playNoteButton2, false);
  updateBlocksContainer(playNoteButton3, false);
  updateBlocksContainer(playNoteButton4, false);
  updateBlocksContainer(tumHiHoButton, false);
}

playNoteButton1.addEventListener("click", () => {
  stopPlayback();
  demoListHide();
  playNoteButton1.disabled = true;
  demoList.classList.toggle("on");
  currentNotesArray = kalHoNaaHoNotes;
  playNotes(currentNotesArray);
  stopNoteButton.classList.add("stop_active");
});

playNoteButton2.addEventListener("click", () => {
  stopPlayback();
  demoListHide();
  playNoteButton2.disabled = true;
  demoList.classList.toggle("on");
  currentNotesArray = kaviKhusiKaviGamNotes;
  playNotes(currentNotesArray);
  stopNoteButton.classList.add("stop_active");
});

playNoteButton3.addEventListener("click", () => {
  stopPlayback();
  demoListHide();
  playNoteButton3.disabled = true;
  demoList.classList.toggle("on");
  currentNotesArray = twinkleTwinkleNotes;
  playNotes(currentNotesArray);
  stopNoteButton.classList.add("stop_active");
});

playNoteButton4.addEventListener("click", () => {
  stopPlayback();
  demoListHide();
  playNoteButton4.disabled = true;
  demoList.classList.toggle("on");
  currentNotesArray = janaGanaManaNotes;
  playNotes(currentNotesArray);
  stopNoteButton.classList.add("stop_active");
});

tumHiHoButton.addEventListener("click", () => {
  stopPlayback();
  demoListHide();
  tumHiHoButton.disabled = true;
  demoList.classList.toggle("on");
  currentNotesArray = tumHiHoHindiNotes;
  playNotes(currentNotesArray);
  stopNoteButton.classList.add("stop_active");
});


stopNoteButton.addEventListener("click", () => {
  stopPlayback();
  stopNoteButton.classList.remove("stop_active");
});

demoList.addEventListener("click", () => {
  musicNotesContainer.classList.toggle("listShow");
  demoList.classList.toggle("on");
});

function demoListHide() {
  musicNotesContainer.classList.remove("listShow");
}

 /* ************************************************************************** */
 /*                                RANGE SLIDER                                */
 /* ************************************************************************** */

var sliderEl0 = document.querySelector('#slider0 [data-rangeslider]')
var sliderEl1 = document.querySelector('#slider1 [data-rangeslider]')
var sliderEl2 = document.querySelector('#slider2 [data-rangeslider]')
var sliderEl3 = document.querySelector('#slider3 [data-rangeslider]')

rangesliderJs.create(sliderEl0);
rangesliderJs.create(sliderEl1);
rangesliderJs.create(sliderEl2);
rangesliderJs.create(sliderEl3);

  


  let hideOutputTimer;
  
  sliderEl2.addEventListener('input', (ev) => {
    document.querySelector('#volumeDisplay').innerHTML = ev.target.value
    clearTimeout(hideOutputTimer);
    hideOutputTimer = setTimeout(function() {
      document.querySelector('#volumeDisplay').style.display = 'none';
    }, 1000);
    document.querySelector('#volumeDisplay').style.display = 'flex';
  })


  const pianoScroll = document.querySelector('.overflow');
  const scrollStep = 40.8;
  sliderEl3.addEventListener('input', () => {
    const scrollPosition = sliderEl3.value * scrollStep;
    pianoScroll.scrollLeft = scrollPosition;
  });
  pianoScroll.addEventListener('scroll', () => {
    const stepsScrolled = pianoScroll.scrollLeft / scrollStep;

    sliderEl3.value = stepsScrolled;
  });


});
