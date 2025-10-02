class WordGuessingGame {
    constructor() {
        this.secretWord = '';
        this.hints = '';
        this.timeLeft = 20;
        this.timerInterval = null;
        this.confettiCanvas = null;
        this.confettiCtx = null;
        this.confettiParticles = [];

        this.initializeElements();
        this.setupEventListeners();
        this.setupConfetti();
    }

    initializeElements() {
        this.setupScreen = document.getElementById('setupScreen');
        this.guessingScreen = document.getElementById('guessingScreen');
        this.resultScreen = document.getElementById('resultScreen');

        this.secretWordInput = document.getElementById('secretWord');
        this.hintsInput = document.getElementById('hints');
        this.startRoundBtn = document.getElementById('startRoundBtn');

        this.emojiDisplay = document.getElementById('emojiDisplay');
        this.timer = document.getElementById('timer');
        this.letterHint = document.getElementById('letterHint');
        this.feedback = document.getElementById('feedback');
        this.guessInput = document.getElementById('guessInput');
        this.submitGuessBtn = document.getElementById('submitGuessBtn');

        this.resultMessage = document.getElementById('resultMessage');
        this.playAgainBtn = document.getElementById('playAgainBtn');
    }

    setupEventListeners() {
        this.startRoundBtn.addEventListener('click', () => this.startRound());
        this.submitGuessBtn.addEventListener('click', () => this.submitGuess());
        this.playAgainBtn.addEventListener('click', () => this.playAgain());

        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitGuess();
            }
        });

        this.secretWordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.hintsInput.focus();
            }
        });

        this.hintsInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startRound();
            }
        });
    }

    setupConfetti() {
        this.confettiCanvas = document.getElementById('confetti');
        this.confettiCtx = this.confettiCanvas.getContext('2d');
        this.resizeCanvas();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.confettiCanvas.width = window.innerWidth;
        this.confettiCanvas.height = window.innerHeight;
    }

    showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    startRound() {
        this.secretWord = this.secretWordInput.value.trim();
        this.hints = this.hintsInput.value.trim();

        if (!this.secretWord) {
            alert('Please enter a secret word or phrase!');
            this.secretWordInput.focus();
            return;
        }

        if (!this.hints) {
            alert('Please enter emoji hints!');
            this.hintsInput.focus();
            return;
        }

        this.emojiDisplay.textContent = this.hints;
        this.guessInput.value = '';
        this.letterHint.textContent = '';
        this.feedback.textContent = '';
        this.timeLeft = 20;
        this.updateTimer();

        this.showScreen(this.guessingScreen);
        this.guessInput.focus();
        this.startTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();

            if (this.timeLeft === 10) {
                this.showFirstLetterHint();
            }

            if (this.timeLeft === 5) {
                this.showSecondLetterHint();
                this.timer.classList.add('warning');
            }

            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    updateTimer() {
        this.timer.textContent = this.timeLeft;
    }

    showFirstLetterHint() {
        const hint = this.createLetterHint(1);
        this.letterHint.innerHTML = `💡 ${hint}`;
        this.letterHint.className = 'letter-hint show';
    }

    showSecondLetterHint() {
        const hint = this.createLetterHint(2);
        this.letterHint.innerHTML = `💡 ${hint}`;
        this.letterHint.className = 'letter-hint show';
    }

    createLetterHint(numLetters) {
        const word = this.secretWord.toLowerCase();
        let hint = '';

        for (let i = 0; i < word.length; i++) {
            if (word[i] === ' ') {
                hint += '&nbsp;&nbsp;';
            } else if (i < numLetters) {
                hint += word[i].toUpperCase();
            } else {
                hint += '_';
            }
        }

        return hint;
    }

    submitGuess() {
        const guess = this.guessInput.value.trim();

        if (!guess) {
            this.guessInput.focus();
            return;
        }

        if (guess.toLowerCase() === this.secretWord.toLowerCase()) {
            clearInterval(this.timerInterval);
            this.correctGuess();
        } else {
            this.feedback.textContent = '❌ Incorrect! Try again...';
            this.feedback.className = 'feedback incorrect';
            this.guessInput.value = '';
            this.guessInput.focus();

            setTimeout(() => {
                this.feedback.textContent = '';
                this.feedback.className = 'feedback';
            }, 2000);
        }
    }

    correctGuess() {
        this.resultMessage.innerHTML = `Correct! 🎉<br><strong>"${this.secretWord}"</strong>`;
        this.resultMessage.className = 'correct';
        this.showScreen(this.resultScreen);
        this.startConfetti();
    }


    timeUp() {
        clearInterval(this.timerInterval);
        this.timer.classList.remove('warning');
        this.resultMessage.innerHTML = `Time's up! ⏰<br>The answer was<br><strong>"${this.secretWord}"</strong>`;
        this.resultMessage.className = 'incorrect';
        this.showScreen(this.resultScreen);
    }

    playAgain() {
        this.secretWordInput.value = '';
        this.hintsInput.value = '';
        this.timer.classList.remove('warning');
        this.stopConfetti();
        this.showScreen(this.setupScreen);
        this.secretWordInput.focus();
    }

    createConfettiParticle() {
        const colors = ['#0d3b66', '#faf0ca', '#f4d35e', '#ee964b', '#f95738'];

        return {
            x: Math.random() * this.confettiCanvas.width,
            y: -10,
            vx: Math.random() * 6 - 3,
            vy: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        };
    }

    startConfetti() {
        this.confettiParticles = [];

        for (let i = 0; i < 100; i++) {
            this.confettiParticles.push(this.createConfettiParticle());
        }

        this.animateConfetti();
    }

    animateConfetti() {
        this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

        for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
            const particle = this.confettiParticles[i];

            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;

            this.confettiCtx.save();
            this.confettiCtx.translate(particle.x, particle.y);
            this.confettiCtx.rotate(particle.rotation * Math.PI / 180);
            this.confettiCtx.fillStyle = particle.color;
            this.confettiCtx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            this.confettiCtx.restore();

            if (particle.y > this.confettiCanvas.height) {
                this.confettiParticles.splice(i, 1);
            }
        }

        if (this.confettiParticles.length > 0) {
            requestAnimationFrame(() => this.animateConfetti());
        }
    }

    stopConfetti() {
        this.confettiParticles = [];
        this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WordGuessingGame();
});