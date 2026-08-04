/* ==================================================
   ORACLE WORD QUEST
   Complete script.js
================================================== */

const questions = [
  {
    image: "388.png",
    english: "Knife",
    chinese: "刀"
  },
  {
    image: "389.png",
    english: "Moon",
    chinese: "月"
  },
  {
    image: "390.png",
    english: "Insect",
    chinese: "虫"
  },
  {
    image: "391.png",
    english: "Bamboo",
    chinese: "竹"
  },
  {
    image: "392.png",
    english: "Mouth",
    chinese: "口"
  },
  {
    image: "393.png",
    english: "Fish",
    chinese: "鱼"
  },
  {
    image: "394.png",
    english: "Field",
    chinese: "田"
  },
  {
    image: "395.png",
    english: "Vehicle",
    chinese: "车"
  },
  {
    image: "396.png",
    english: "Dragon",
    chinese: "龙"
  },
  {
    image: "397.png",
    english: "Eye",
    chinese: "目"
  }
];

/* ==================================================
   GAME VARIABLES
================================================== */

const app = document.getElementById("app");
const soundButton = document.getElementById("soundButton");

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

/* ==================================================
   MUSIC AND SOUND EFFECTS
================================================== */

let audioContext = null;
let musicTimer = null;
let musicPosition = 0;
let soundEnabled = true;

const melody = [
  523.25,
  659.25,
  783.99,
  659.25,

  587.33,
  698.46,
  880.00,
  698.46,

  659.25,
  783.99,
  987.77,
  783.99,

  587.33,
  698.46,
  783.99,
  523.25
];

function prepareAudio() {
  if (!audioContext) {
    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContext) {
      console.log(
        "This browser does not support Web Audio."
      );

      return false;
    }

    audioContext = new AudioContext();
  }

  return true;
}

async function unlockAudio() {
  const audioAvailable = prepareAudio();

  if (!audioAvailable) {
    return false;
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  return true;
}

function playTone(
  frequency,
  duration = 0.2,
  type = "triangle",
  volume = 0.15,
  delay = 0
) {
  if (!soundEnabled) {
    return;
  }

  if (!prepareAudio()) {
    return;
  }

  const startTime =
    audioContext.currentTime + delay;

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

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

  oscillator.stop(
    startTime + duration + 0.1
  );
}

/* Background melody */

function playMusicNote() {
  if (!soundEnabled || !audioContext) {
    return;
  }

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
  if (!soundEnabled) {
    return;
  }

  stopBackgroundMusic();

  musicPosition = 0;

  // Play the first note immediately
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

/* Button sound */

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

/* Correct-answer sound */

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

/* Incorrect-answer sound */

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

/* Final celebration sound */

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

/* Sound button */

function updateSoundButton() {
  if (!soundButton) {
    return;
  }

  soundButton.textContent =
    soundEnabled
      ? "🔊 Music On"
      : "🔇 Music Off";

  soundButton.classList.toggle(
    "muted",
    !soundEnabled
  );

  soundButton.setAttribute(
    "aria-label",
    soundEnabled
      ? "Turn music off"
      : "Turn music on"
  );
}

if (soundButton) {
  soundButton.addEventListener(
    "click",
    async function () {
      await unlockAudio();

      soundEnabled = !soundEnabled;

      updateSoundButton();

      if (soundEnabled) {
        playButtonSound();
        startBackgroundMusic();
      } else {
        stopBackgroundMusic();
      }
    }
  );
}

/* ==================================================
   PAGE TEMPLATE
================================================== */

function page(content) {
  return `
    <section class="shell">
      <div class="card">
        <div class="colour-stripe"></div>
        ${content}
      </div>
    </section>
  `;
}

/* ==================================================
   WELCOME SCREEN
================================================== */

function showWelcomeScreen() {
  app.innerHTML = page(`
    <section class="welcome">

      <div
        class="mascot"
        aria-hidden="true"
      >
        🐉
      </div>

      <p class="eyebrow">
        ✨ P6 Social Studies ✨
      </p>

      <h1>
        Oracle Word Quest
      </h1>

      <p class="chinese-title">
        甲骨文猜字游戏
      </p>

      <p class="intro">
        Travel back in time, study each mystery
        symbol, and discover its modern Chinese
        character!
      </p>

      <div class="rules">

        <span>
          🔎 10 mysteries
        </span>

        <span>
          🎯 3 choices
        </span>

        <span>
          ⭐ Earn stars
        </span>

      </div>

      <button
        class="primary-button"
        type="button"
        onclick="startGame()"
      >
        Let's Play! 开始游戏 →
      </button>

    </section>
  `);
}

/* ==================================================
   START GAME
================================================== */

/* Randomise the question order each time a new game begins. */
function shuffleQuestions() {
  for (let index = questions.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1)
    );

    [questions[index], questions[randomIndex]] =
      [questions[randomIndex], questions[index]];
  }
}

async function startGame() {
  soundEnabled = true;

  updateSoundButton();

  await unlockAudio();

  playButtonSound();
  startBackgroundMusic();

  shuffleQuestions();

  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;

  showQuestion();
}

/* ==================================================
   GENERATE ANSWER CHOICES
================================================== */

function getChoices(questionIndex) {
  const correctAnswer =
    questions[questionIndex];

  const otherAnswers = questions
    .filter(
      (question, index) =>
        index !== questionIndex
    )
    .sort(
      (first, second) => {
        const firstNumber =
          (
            questionIndex * 7 +
            first.chinese.charCodeAt(0)
          ) % 17;

        const secondNumber =
          (
            questionIndex * 7 +
            second.chinese.charCodeAt(0)
          ) % 17;

        return firstNumber - secondNumber;
      }
    )
    .slice(0, 2);

  const choices = [
    correctAnswer,
    ...otherAnswers
  ];

  choices.sort(
    (first, second) => {
      const firstNumber =
        (
          first.chinese.charCodeAt(0) +
          questionIndex
        ) % 3;

      const secondNumber =
        (
          second.chinese.charCodeAt(0) +
          questionIndex
        ) % 3;

      return firstNumber - secondNumber;
    }
  );

  return choices;
}

/* ==================================================
   SHOW QUESTION
================================================== */

function showQuestion() {
  const question =
    questions[currentQuestion];

  const choices =
    getChoices(currentQuestion);

  const percentage =
    (
      (currentQuestion + 1) /
      questions.length
    ) * 100;

  const choiceButtons = choices
    .map(
      (choice, index) => {
        const isCorrect =
          selectedAnswer &&
          choice.chinese ===
            question.chinese;

        const isWrong =
          selectedAnswer ===
            choice.chinese &&
          choice.chinese !==
            question.chinese;

        let answerClass = "";
        let answerMark = "";

        if (isCorrect) {
          answerClass = "correct";
          answerMark = "✓";
        }

        if (isWrong) {
          answerClass = "wrong";
          answerMark = "×";
        }

        return `
          <button
            class="choice ${answerClass}"
            type="button"
            onclick="selectAnswer(
              '${choice.chinese}'
            )"
            ${
              selectedAnswer
                ? "disabled"
                : ""
            }
          >

            <span class="choice-letter">
              ${String.fromCharCode(
                65 + index
              )}
            </span>

            <span class="hanzi">
              ${choice.chinese}
            </span>

            <span class="divider">
              •
            </span>

            <span class="english">
              ${choice.english}
            </span>

            <span class="answer-mark">
              ${answerMark}
            </span>

          </button>
        `;
      }
    )
    .join("");

  let feedback = "";

  if (selectedAnswer) {
    const wasCorrect =
      selectedAnswer ===
      question.chinese;

    feedback = `
      <section
        class="feedback ${
          wasCorrect
            ? ""
            : "incorrect"
        }"
        role="status"
      >

        <div>

          <strong>
            ${
              wasCorrect
                ? "🌟 Amazing! 答对了！"
                : "💪 Good try! 再试试看！"
            }
          </strong>

          <p>
            The answer is
            <b>
              ${question.chinese}
              ·
              ${question.english}
            </b>.
          </p>

        </div>

        <button
          class="next-button"
          type="button"
          onclick="nextQuestion()"
        >
          ${
            currentQuestion ===
            questions.length - 1
              ? "See Results 查看成绩"
              : "Next 下一题 →"
          }
        </button>

      </section>
    `;
  }

  app.innerHTML = page(`
    <section class="quiz">

      <header class="quiz-header">

        <div>

          <p class="eyebrow">
            🔍 MYSTERY SYMBOL
          </p>

          <h1>
            What does this symbol mean?
          </h1>

          <p class="chinese-prompt">
            这个甲骨文是什么意思？
          </p>

        </div>

        <div class="score-box">
          ⭐ Stars
          <br>

          <strong>
            ${score}
          </strong>
        </div>

      </header>

      <div class="progress-text">

        <span>
          Question 题目
          ${currentQuestion + 1}
          of
          ${questions.length}
        </span>

        <span>
          ${Math.round(percentage)}%
        </span>

      </div>

      <div class="progress-bar">

        <span
          class="progress-fill"
          style="width: ${percentage}%"
        >
        </span>

      </div>

      <div class="symbol-wrapper">

        <div class="mystery-label">
          MYSTERY #
          ${currentQuestion + 1}
        </div>

        <div class="symbol-card">

          <img
            src="images/${question.image}"
            alt="Oracle-bone symbol for question
            ${currentQuestion + 1}"
          >

        </div>

      </div>

      <div class="choices">
        ${choiceButtons}
      </div>

      ${feedback}

    </section>
  `);
}

/* ==================================================
   SELECT ANSWER
================================================== */

function selectAnswer(chineseAnswer) {
  if (selectedAnswer) {
    return;
  }

  selectedAnswer = chineseAnswer;

  const correctAnswer =
    questions[currentQuestion].chinese;

  if (chineseAnswer === correctAnswer) {
    score++;
    playCorrectSound();
  } else {
    playWrongSound();
  }

  showQuestion();
}

/* ==================================================
   NEXT QUESTION
================================================== */

function nextQuestion() {
  playButtonSound();

  if (
    currentQuestion ===
    questions.length - 1
  ) {
    showResults();
    return;
  }

  currentQuestion++;
  selectedAnswer = null;

  showQuestion();
}

/* ==================================================
   RESULTS SCREEN
================================================== */

function showResults() {
  stopBackgroundMusic();

  playFinishSound();

  let resultTitle;

  if (score === questions.length) {
    resultTitle =
      "Oracle Master! 甲骨文大师！";
  } else if (score >= 7) {
    resultTitle =
      "Great work! 太棒了！";
  } else {
    resultTitle =
      "Good try! 继续加油！";
  }

  app.innerHTML = page(`
    <section class="result">

      <div
        class="confetti"
        aria-hidden="true"
      >
        🎉 ⭐ 🎊
      </div>

      <div
        class="trophy"
        aria-hidden="true"
      >
        🏆
      </div>

      <p class="eyebrow">
        QUEST COMPLETE!
      </p>

      <h1>
        ${resultTitle}
      </h1>

      <div class="score-ring">

        <strong>
          ${score}
        </strong>

        <span>
          / ${questions.length}
        </span>

      </div>

      <p class="result-message">
        You identified
        ${score}
        oracle-bone
        ${
          score === 1
            ? "word"
            : "words"
        }
        correctly.
      </p>

      <button
        class="primary-button"
        type="button"
        onclick="startGame()"
      >
        Play Again 再玩一次
      </button>

    </section>
  `);
}

/* ==================================================
   LOAD GAME
================================================== */

updateSoundButton();
showWelcomeScreen();
