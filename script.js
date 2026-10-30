// ---------- Летящие сердечки ----------
const heartsContainer = document.getElementById('hearts');
const symbols = ['💖', '💕', '🌸', '✨', '💗'];

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
    heart.style.animationDuration = (Math.random() * 6 + 8) + 's';
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 15000);
}
setInterval(createHeart, 800);


// ---------- Убегающая кнопка «Нет» ----------
const btnNo  = document.getElementById('btnNo');
const btnYes = document.getElementById('btnYes');
const card   = document.querySelector('.card');

btnNo.addEventListener('click', (e) => e.preventDefault());

// Ставим кнопку под «Да» после появления карточки
let placed = false;
function placeInitially() {
    if (placed) return;
    placed = true;

    const yesRect = btnYes.getBoundingClientRect();
    const x = yesRect.left + yesRect.width / 2 - btnNo.offsetWidth / 2;
    const y = yesRect.bottom + 15;

    btnNo.style.transition = 'none';
    btnNo.style.transform  = `translate(${x}px, ${y}px)`;
    void btnNo.offsetWidth;      // фиксируем позицию без анимации
    btnNo.style.transition = '';

    btnNo.classList.add('ready');
}

// Ловим только собственную анимацию карточки (не детей)
card.addEventListener('animationend', (e) => {
    if (e.target === card) placeInitially();
});
// Страховка
setTimeout(placeInitially, 1200);

function escapeFromCursor(event) {
    const pad  = 25;
    const btnW = btnNo.offsetWidth;
    const btnH = btnNo.offsetHeight;

    const minLeft = pad;
    const maxLeft = window.innerWidth  - pad - btnW;
    const minTop  = pad;
    const maxTop  = window.innerHeight - pad - btnH;

    if (maxLeft <= minLeft || maxTop <= minTop) return;

    let targetX, targetY, tries = 0;
    do {
        targetX = minLeft + Math.random() * (maxLeft - minLeft);
        targetY = minTop  + Math.random() * (maxTop  - minTop);
        tries++;
    } while (
        tries < 30 &&
        Math.hypot(
            targetX + btnW / 2 - event.clientX,
            targetY + btnH / 2 - event.clientY
        ) < 180
    );

    btnNo.style.transform = `translate(${targetX}px, ${targetY}px)`;
}

btnNo.addEventListener('mouseover', escapeFromCursor);


// ---------- Кнопка «Да» ----------
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');

btnYes.addEventListener('click', () => {
    celebrate();

    // Плавно прячем убегающую кнопку
    btnNo.classList.remove('ready');
    setTimeout(() => { btnNo.style.display = 'none'; }, 300);

    // Плавный переход между шагами
    step1.style.transition = 'opacity 0.4s ease';
    step1.style.opacity = '0';
    setTimeout(() => {
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        step2.style.opacity = '0';
        step2.style.transition = 'opacity 0.5s ease';
        requestAnimationFrame(() => step2.style.opacity = '1');
    }, 400);
});

function celebrate() {
    const emojis = ['🎉', '💖', '🌸', '✨', '🎊', '💕', '🎈'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'burst';
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.left = (Math.random() * 80 + 10) + 'vw';
            el.style.top  = (Math.random() * 70 + 15) + 'vh';
            el.style.fontSize = (22 + Math.random() * 30) + 'px';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1500);
        }, i * 40);
    }
}


// ---------- Отправка формы без перезагрузки ----------
const planForm = document.getElementById('planForm');
const sentMsg  = document.getElementById('sentMsg');

planForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = planForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляю…';

    try {
        const res = await fetch(planForm.action, {
            method: 'POST',
            body: new FormData(planForm),
            headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
            planForm.classList.add('hidden');
            sentMsg.classList.remove('hidden');
        } else {
            throw new Error('Ошибка отправки');
        }
    } catch (err) {
        alert('Не получилось отправить :( Попробуй ещё раз.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить 💌';
    }
});