document.addEventListener('DOMContentLoaded', () => {
    /* =====================================================
       1. COUNTDOWN
       Target: 30 August 2026, 00:00:00 Nepal time (+05:45)
    ===================================================== */
    const targetTime = new Date('2026-08-30T00:00:00+05:45').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const openBtn = document.getElementById('open-btn');
    const statusEl = document.getElementById('lock-status');

    let unlocked = false;
    let isTransitioning = false;

    function updateCountdown() {
        const difference = targetTime - Date.now();

        if (difference <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';

            if (!unlocked) {
                unlocked = true;
                document.body.classList.add('unlocked');
                statusEl.textContent = 'The divine moment has arrived. ♥';
            }
            return;
        }

        const totalSeconds = Math.floor(difference / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* =====================================================
       2. PARTICLES
    ===================================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const colors = ['216,180,226', '243,229,171', '174,230,230', '255,255,255'];

    class Particle {
        constructor() { this.reset(true); }
        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 20;
            this.size = Math.random() * 2.5 + .5;
            this.speed = Math.random() * .3 + .1;
            this.angle = Math.random() * Math.PI * 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = initial ? Math.random() * .55 : 0;
            this.maxOpacity = Math.random() * .5 + .12;
        }
        update() {
            this.y -= this.speed;
            this.angle += .008;
            this.x += Math.sin(this.angle) * .18;
            if (this.opacity < this.maxOpacity) this.opacity += .002;
            if (this.y < -20) this.reset();
        }
        draw() {
            if (this.opacity <= 0) return;
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
            gradient.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
            gradient.addColorStop(1, `rgba(${this.color},0)`);
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particleCount = width < 768 ? 45 : 90;
    const particles = Array.from({ length: particleCount }, () => new Particle());

    function renderParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(renderParticles);
    }
    renderParticles();

    /* =====================================================
       3. BUTTERFLIES
    ===================================================== */
    const butterflyContainer = document.getElementById('butterfly-container');
    const butterflyColors = [
        'rgba(216,180,226,.95)',
        'rgba(243,229,171,.95)',
        'rgba(174,230,230,.9)'
    ];

    class Butterfly {
        constructor() {
            this.el = document.createElement('div');
            this.el.className = 'butterfly';
            const color = butterflyColors[Math.floor(Math.random() * butterflyColors.length)];
            this.el.innerHTML = `
                <svg class="butterfly-wing wing-left" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <use href="#butterfly-wing" fill="${color}" stroke="rgba(255,255,255,.4)"></use>
                </svg>
                <svg class="butterfly-wing wing-right" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <use href="#butterfly-wing" fill="${color}" stroke="rgba(255,255,255,.4)" transform="scale(-1,1) translate(-100,0)"></use>
                </svg>`;
            butterflyContainer.appendChild(this.el);
            this.reset();
            setTimeout(() => { this.el.style.opacity = .35 + Math.random() * .6; }, 500 + Math.random() * 1800);
        }
        reset() {
            this.x = Math.random() < .5 ? -60 : width + 60;
            this.y = height * (.2 + Math.random() * .6);
            this.speed = .3 + Math.random() * .45;
            this.angle = Math.random() * Math.PI * 2;
            this.scale = .55 + Math.random() * .65;
            this.z = Math.random() * 40 - 20;
        }
        update() {
            if (isTransitioning) return;
            this.angle += (Math.random() - .5) * .08;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed - .12;
            if (this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) this.reset();
            const rotation = Math.atan2(Math.sin(this.angle), Math.cos(this.angle)) * 180 / Math.PI;
            this.el.style.transform = `translate3d(${this.x}px,${this.y}px,${this.z}px) rotateZ(${rotation + 90}deg) scale(${this.scale})`;
        }
    }

    const butterflies = Array.from({ length: width < 768 ? 7 : 14 }, () => new Butterfly());

    function animateButterflies() {
        butterflies.forEach(b => b.update());
        requestAnimationFrame(animateButterflies);
    }
    animateButterflies();

    /* =====================================================
       4. BUTTON / LOVE LOCK
       Before zero: show the divine waiting message.
       At zero: lock opens and button navigates to main.html.
    ===================================================== */
    openBtn.addEventListener('click', () => {
        if (isTransitioning) return;

        if (!unlocked) {
            document.body.classList.add('message-visible');
            statusEl.textContent = 'Can not Open yet... But Very soon 🤞. ✦';

            // Small butterfly celebration around the panel, but no page change.
            butterflies.forEach((b, index) => {
                if (index % 2 === 0) {
                    b.el.style.transition = 'transform 1.8s ease, opacity 1.8s ease';
                    b.el.style.opacity = '.9';
                }
            });
            return;
        }

        isTransitioning = true;
        document.body.classList.add('transitioning');

        butterflies.forEach((b, i) => {
            b.el.style.transition = 'transform 1.4s cubic-bezier(.5,0,.1,1), opacity .8s ease';
            b.el.style.opacity = '0';
            const direction = i % 2 === 0 ? 1 : -1;
            b.el.style.transform = `translate3d(${b.x + direction * 260}px,${b.y - 180}px,0) scale(.15)`;
        });

        setTimeout(() => {
            window.location.href = 'main.html';
        }, 1350);
    });
});
