// Sons de clique, acerto e erro
const clickSound = new Audio('assets/click.mp3');
const correctSound = new Audio('assets/correct.mp3');
const wrongSound = new Audio('assets/wrong.mp3');

// Música de fundo e trecho de música para pergunta 4
const bgMusic = document.getElementById('bg-music');
const musicSnippet = document.getElementById('music-snippet');
let musicSnippetPlaying = false;

// Elementos principais
const startScreen = document.getElementById('start-screen');
const quizContent = document.getElementById('quiz-content');
const startBtn = document.getElementById('start-btn');
const questions = document.querySelectorAll('.question');
const progress = document.querySelector('.progress');
const resultScreen = document.querySelector('.result-screen');
const resultTitle = document.querySelector('.result-title');
const memoryBtn = document.querySelector('.memory-btn');

let currentQuestion = 0;
let score = 0;

// Fade helpers
function fadeOut(element, callback) {
    element.style.opacity = 1;
    let fadeEffect = setInterval(() => {
        if (element.style.opacity > 0) {
            element.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
            element.style.display = "none";
            if (callback) callback();
        }
    }, 30);
}

function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = 'block';
    let fadeEffect = setInterval(() => {
        let opacity = parseFloat(element.style.opacity);
        if (opacity < 1) {
            element.style.opacity = opacity + 0.1;
        } else {
            clearInterval(fadeEffect);
        }
    }, 30);
}

// Iniciar quiz e música de fundo
startBtn.addEventListener('click', () => {
    startScreen.style.opacity = 1;
    startScreen.style.transition = "opacity 0.6s";
    startScreen.style.opacity = 0;
    setTimeout(() => {
        startScreen.style.display = "none";
        quizContent.style.display = "block";
        quizContent.style.animation = "fadeIn 1s";
        // Música de fundo
        if(bgMusic) {
            bgMusic.currentTime = 0;
            bgMusic.volume = 0.5;
            bgMusic.play();
        }
    }, 600);
});

// Opções NORMAIS (todas menos a pergunta 4)
document.querySelectorAll('.option:not(.music-option)').forEach(option => {
    option.addEventListener('click', function() {
        clickSound.currentTime = 0; clickSound.play();
        this.classList.add('selected');
        setTimeout(() => {
            this.classList.remove('selected');
            if(this.dataset.correct === 'true') {
                correctSound.currentTime = 0; correctSound.play();
                score++;
            } else {
                wrongSound.currentTime = 0; wrongSound.play();
            }
            showNextQuestion();
        }, 350);
    });
    option.addEventListener('keydown', function(e) {
        if(e.key === "Enter" || e.key === " ") {
            this.click();
        }
    });
});

// Opções da pergunta 4 (com música)
document.querySelectorAll('.music-option').forEach(option => {
    option.addEventListener('click', function() {
        // Sempre toca o trecho da música ao clicar
        if(musicSnippetPlaying) {
            musicSnippet.pause();
            musicSnippet.currentTime = 0;
        }
        if(bgMusic) bgMusic.pause(); // Pausa a música de fundo ao tocar trecho
        musicSnippet.src = this.getAttribute('data-music');
        musicSnippet.currentTime = 0;
        musicSnippet.volume = 1;
        musicSnippet.play();
        musicSnippetPlaying = true;
        musicSnippet.onended = () => {
            musicSnippetPlaying = false;
            // Não retoma a música de fundo aqui para aguardar a próxima pergunta
        };

        // Lógica de duplo clique para avançar
        const now = Date.now();
        if (!option.lastClickTime) option.lastClickTime = 0;
        if (!option.lastClicked) option.lastClicked = false;

        if (option.lastClicked && (now - option.lastClickTime) < 600) {
            // Avança para a próxima pergunta
            if(musicSnippetPlaying) {
                musicSnippet.pause();
                musicSnippet.currentTime = 0;
                musicSnippetPlaying = false;
            }
            if(bgMusic) bgMusic.play(); // Retoma a música de fundo ao avançar
            this.classList.add('selected');
            setTimeout(() => {
                this.classList.remove('selected');
                if(this.dataset.correct === 'true') {
                    correctSound.currentTime = 0; correctSound.play();
                    score++;
                } else {
                    wrongSound.currentTime = 0; wrongSound.play();
                }
                showNextQuestion();
            }, 350);
            option.lastClicked = false;
            option.lastClickTime = 0;
        } else {
            option.lastClicked = true;
            option.lastClickTime = now;
        }
    });
    // Acessibilidade: responder com Enter/Espaço
    option.addEventListener('keydown', function(e) {
        if(e.key === "Enter" || e.key === " ") {
            this.click();
        }
    });
});

// Barra de progresso
function updateProgress() {
    const width = (currentQuestion / questions.length) * 100;
    progress.style.width = `${width}%`;
}

// Próxima pergunta com fade
function showNextQuestion() {
    fadeOut(questions[currentQuestion], () => {
        currentQuestion++;
        if(currentQuestion < questions.length) {
            fadeIn(questions[currentQuestion]);
        } else {
            showResult();
        }
        updateProgress();
    });
}

// Resultado final
function showResult() {
    document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
    resultScreen.style.display = 'block';
    fadeIn(resultScreen);

    if(score >= 3) {
        resultTitle.innerHTML = "🎉 Parabéns, Amor! 🎉";
        memoryBtn.style.display = 'inline-block';
        document.querySelector('.memory-content').innerHTML = `
            <p>Você acertou ${score} perguntas! Você me conhece muito bem! 💖</p>
        `;
        showConfetti();
    } else {
        resultTitle.innerHTML = "Não foi dessa vez... mas como eu te amo, vou deixar passar! 😘";
        memoryBtn.style.display = 'inline-block';
        document.querySelector('.memory-content').innerHTML = `
            <p>Você acertou só ${score}... mas o que importa é o nosso amor! 💖</p>
        `;
        showConfetti();
    }
}

// Botão para ver memórias
memoryBtn.addEventListener('click', () => {
    window.location.href = "memories.html";
});

// Inicialização
updateProgress();

// Partículas de coração flutuando
const heartContainer = document.createElement('div');
heartContainer.style.position = 'fixed';
heartContainer.style.top = '0';
heartContainer.style.left = '0';
heartContainer.style.width = '100%';
heartContainer.style.height = '100%';
heartContainer.style.pointerEvents = 'none';
heartContainer.style.zIndex = '5';
document.body.appendChild(heartContainer);

function createHeart() {
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.style.position = 'absolute';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.opacity = 1;
    heart.style.transition = 'all 3s linear';
    heartContainer.appendChild(heart);
    setTimeout(() => {
        heart.style.top = '-50px';
        heart.style.opacity = 0;
    }, 50);
    setTimeout(() => {
        heart.remove();
    }, 3050);
}
setInterval(createHeart, 500);

// 🎉 Confete ao final
function showConfetti() {
    for(let i=0;i<30;i++) {
        setTimeout(() => {
            const conf = document.createElement('div');
            conf.textContent = (Math.random() > 0.5) ? '💖' : '💘';
            conf.style.position = 'fixed';
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.top = '-40px';
            conf.style.fontSize = (Math.random() * 18 + 18) + 'px';
            conf.style.opacity = 0.85;
            conf.style.transition = 'top 2.2s cubic-bezier(.4,2,.6,1), opacity 2.2s';
            document.body.appendChild(conf);
            setTimeout(() => {
                conf.style.top = (Math.random() * 70 + 20) + 'vh';
                conf.style.opacity = 0;
            }, 50);
            setTimeout(() => { conf.remove(); }, 2300);
        }, i * 60);
    }
}
