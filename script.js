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

// Тексты, которые будут меняться при кликах/наведениях
const noTexts = [
    'Может, в другой раз',
    'Ты уверена? 🤔',
    'Правда?',
    'Подумай ещё раз 😊',
    'Я подожду…',
    'Ну хотя бы на 5 минут!',
    'Не поймаешь! 😜'
];
let noClicks = 0;

// Универсальная функция перемещения (работает и для мыши, и для пальца)
function moveButton(event) {
    // Предотвращаем стандартное поведение (например, скролл или клик)
    if (event && event.cancelable) event.preventDefault();

    // Меняем текст на кнопке
    if (noClicks < noTexts.length) {
        btnNo.textContent = noTexts[noClicks];
        noClicks++;
    }

    const pad  = 20; // Отступ от краев экрана
    const btnW = btnNo.offsetWidth;
    const btnH = btnNo.offsetHeight;

    // Границы видимой области экрана
    const minLeft = pad;
    const maxLeft = window.innerWidth  - pad - btnW;
    const minTop  = pad;
    const maxTop  = window.innerHeight - pad - btnH;

    if (maxLeft <= minLeft || maxTop <= minTop) return;

    // Определяем координаты курсора или пальца
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;

    if (event) {
        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else if (event.clientX !== undefined) {
            clientX = event.clientX;
            clientY = event.clientY;
        }
    }

    // Ищем точку подальше от пальца/курсора
    let targetX, targetY, tries = 0;
    do {
        targetX = minLeft + Math.random() * (maxLeft - minLeft);
        targetY = minTop  + Math.random() * (maxTop  - minTop);
        tries++;
    } while (
        tries < 30 &&
        Math.hypot(
            targetX + btnW / 2 - clientX,
            targetY + btnH / 2 - clientY
        ) < 150 // Безопасное расстояние, чтобы кнопка не спряталась под палец
    );

    // Двигаем кнопку через transform (это плавно благодаря CSS)
    btnNo.style.transform = `translate(${targetX}px, ${targetY}px)`;
}

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
    void btnNo.offsetWidth; // Фиксируем позицию без анимации
    btnNo.style.transition = '';

    btnNo.classList.add('ready');
}

// Ждем появления карточки
card.addEventListener('animationend', (e) => {
    if (e.target === card) placeInitially();
});
// Страховка
setTimeout(placeInitially, 1200);

// Пересчитываем позицию, если пользователь повернул экран
window.addEventListener('resize', () => {
    if (noClicks === 0) {
        placed = false;
        placeInitially();
    }
});

// --- Слушатели событий для кнопки «Нет» ---
// 1. Для компьютеров (наведение мыши)
btnNo.addEventListener('mouseover', moveButton);
// 2. Для телефонов (касание пальцем)
btnNo.addEventListener('touchstart', moveButton, { passive: false });
// 3. Страховка от случайных кликов
btnNo.addEventListener('click', (e) => e.preventDefault());


// ---------- Кнопка «Да» ----------
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');

btnYes.addEventListener('click', () => {
    celebrate();

    // Плавно скрываем убегающую кнопку
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

// Функция салюта из эмодзи
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

if (planForm) {
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
}
