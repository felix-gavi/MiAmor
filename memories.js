// Animação de entrada dos cards, corações flutuantes, confete, digitação e som de clique
document.addEventListener("DOMContentLoaded", function() {
    // Reveal cards
    const cards = document.querySelectorAll('.memory-card');
    const reveal = () => {
        const trigger = window.innerHeight * 0.92;
        cards.forEach(card => {
            const top = card.getBoundingClientRect().top;
            if(top < trigger) {
                card.classList.add('visible');
            }
        });
    };
    reveal();
    window.addEventListener('scroll', reveal);
    window.addEventListener('resize', reveal);

    // Efeito de digitação no título
    const title = document.querySelector('.memories-title');
    if (title) {
        const text = title.textContent;
        title.textContent = "";
        let i = 0;
        function type() {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(type, 60);
            } else {
                title.innerHTML += ' <span>❤️</span>';
            }
        }
        type();
    }

    // Corações flutuando animados (diferentes tamanhos e velocidades)
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.textContent = "❤️";
        heart.style.position = "fixed";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.top = "110vh";
        heart.style.fontSize = (Math.random() * 28 + 16) + "px";
        heart.style.opacity = Math.random() * 0.4 + 0.5;
        heart.style.pointerEvents = "none";
        heart.style.transition = `top ${Math.random()*2+3.5}s linear, opacity 4s`;
        document.body.appendChild(heart);
        setTimeout(() => {
            heart.style.top = "-40px";
            heart.style.opacity = 0;
        }, 50);
        setTimeout(() => {
            heart.remove();
        }, 4500);
    }
    setInterval(createFloatingHeart, 950);

    // Confete ao clicar no botão
    const btn = document.querySelector('.memory-btn');
    if(btn) {
        btn.addEventListener('click', function(e) {
            const clickSound = document.getElementById('click-sound');
            if(clickSound) { clickSound.currentTime = 0; clickSound.play(); }
            for(let i=0;i<24;i++) {
                setTimeout(() => {
                    const conf = document.createElement('div');
                    conf.textContent = (Math.random() > 0.5) ? '💖' : '💘';
                    conf.style.position = 'fixed';
                    conf.style.left = Math.random() * 100 + 'vw';
                    conf.style.top = '-40px';
                    conf.style.fontSize = (Math.random() * 18 + 18) + 'px';
                    conf.style.opacity = 0.85;
                    conf.style.transform = `rotate(${Math.random()*360}deg)`;
                    conf.style.transition = 'top 2.2s cubic-bezier(.4,2,.6,1), opacity 2.2s, transform 2.2s';
                    document.body.appendChild(conf);
                    setTimeout(() => {
                        conf.style.top = (Math.random() * 70 + 20) + 'vh';
                        conf.style.opacity = 0;
                        conf.style.transform = `rotate(${Math.random()*720-360}deg) scale(${Math.random()*0.6+0.7})`;
                    }, 50);
                    setTimeout(() => { conf.remove(); }, 2300);
                }, i * 55);
            }
        });
    }

    // Mudança suave de cor de fundo ao rolar
    window.addEventListener('scroll', () => {
        const scroll = window.scrollY || window.pageYOffset;
        const max = document.body.scrollHeight - window.innerHeight;
        const percent = Math.min(scroll / max, 1);
        document.body.style.background = `linear-gradient(135deg, #c70039 0%, #${(17+Math.round(100*percent)).toString(16)}${(17+Math.round(100*percent)).toString(16)}${(17+Math.round(100*percent)).toString(16)} 100%)`;
    });
});
