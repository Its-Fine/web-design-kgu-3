// Генерация аватара-заглушки на Canvas из данных пользователя:
//  узор 5×5 (identicon) — хеш email;
//  цвет узора — длина email;
//  фон — цвета флага страны по телефонному коду;
//  количество точек — сложность пароля;
//  буква в центре — первая буква никнейма или имени.

const SIZE = 100;

// цвета флагов (полосы сверху вниз) по телефонному коду
const FLAGS = {
  "7": ["#ffffff", "#0039a6", "#d52b1e"], // Россия
  "995": ["#ffffff", "#ff0000", "#ffffff"], // Грузия
  "380": ["#0057b7", "#ffd700"], // Украина
  "375": ["#c8313e", "#c8313e", "#4aa657"], // Беларусь
  "49": ["#000000", "#dd0000", "#ffce00"], // Германия
  "33": ["#002395", "#ffffff", "#ed2939"], // Франция (вертикальные)
  "39": ["#009246", "#ffffff", "#ce2b37"], // Италия (вертикальные)
  "1": ["#b22234", "#ffffff", "#3c3b6e"], // США
  "44": ["#012169", "#ffffff", "#c8102e"], // Великобритания
};
const VERTICAL_FLAGS = ["33", "39"];
const DEFAULT_FLAG = ["#f0e6d3", "#e4d8c8"];

// простой 32-битный хеш строки (FNV-1a)
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// генератор псевдослучайных чисел от зерна — одинаковые данные дают одинаковый рисунок
function random(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getCountryCode(phone) {
  const digits = phone.replace(/\D/g, "");
  if (phone.trim().startsWith("8") && digits.length === 11) return "7";
  // ищем самый длинный подходящий код
  for (let len = 3; len >= 1; len--) {
    const code = digits.slice(0, len);
    if (FLAGS[code]) return code;
  }
  return null;
}

// 0–5 баллов: длина, строчные, заглавные, цифры, спецсимволы
function getPasswordScore(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-zа-я]/.test(password)) score++;
  if (/[A-ZА-Я]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^\wа-яА-Я]/.test(password)) score++;
  return password ? score : 0;
}

function drawFlag(ctx, code) {
  const colors = code ? FLAGS[code] : DEFAULT_FLAG;
  const vertical = VERTICAL_FLAGS.includes(code);
  const step = SIZE / colors.length;
  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    if (vertical) ctx.fillRect(i * step, 0, step + 1, SIZE);
    else ctx.fillRect(0, i * step, SIZE, step + 1);
  });
  // приглушаем фон, чтобы узор был заметнее
  ctx.fillStyle = "rgba(255, 255, 255, .35)";
  ctx.fillRect(0, 0, SIZE, SIZE);
}

function drawIdenticon(ctx, email, hue) {
  const h = hash(email.toLowerCase());
  const cells = 5;
  const cell = 14;
  const offset = (SIZE - cells * cell) / 2;
  ctx.fillStyle = `hsla(${hue}, 65%, 42%, .85)`;
  // левая половина + центр задаются битами хеша, правая зеркальна
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < cells; y++) {
      if ((h >> (x * cells + y)) & 1) {
        ctx.fillRect(offset + x * cell, offset + y * cell, cell, cell);
        ctx.fillRect(offset + (cells - 1 - x) * cell, offset + y * cell, cell, cell);
      }
    }
  }
}

function drawDots(ctx, count, hue, seed) {
  const rnd = random(seed);
  for (let i = 0; i < count * 3; i++) {
    ctx.beginPath();
    ctx.arc(rnd() * SIZE, rnd() * SIZE, 2 + rnd() * 5, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${(hue + 180) % 360}, 80%, 55%, .8)`;
    ctx.fill();
  }
}

function drawLetter(ctx, letter) {
  if (!letter) return;
  ctx.font = "700 44px Oswald, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(0, 0, 0, .55)";
  ctx.strokeText(letter, SIZE / 2, SIZE / 2 + 2);
  ctx.fillStyle = "#fff";
  ctx.fillText(letter, SIZE / 2, SIZE / 2 + 2);
}

function drawAvatar(canvas, user) {
  // чёткое изображение на экранах с высокой плотностью пикселей
  const ratio = window.devicePixelRatio || 1;
  canvas.width = SIZE * ratio;
  canvas.height = SIZE * ratio;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const hue = (user.email.length * 37) % 360;
  const score = getPasswordScore(user.password);
  const letter = (user.nickname || user.name).trim().charAt(0).toUpperCase();

  drawFlag(ctx, getCountryCode(user.phone));
  drawIdenticon(ctx, user.email, hue);
  drawDots(ctx, score, hue, hash(user.password));
  drawLetter(ctx, letter);

  return score;
}

const form = document.getElementById("profile-form");
const canvas = document.getElementById("avatar");
const strength = document.getElementById("password-strength");
const STRENGTH_LABELS = ["нет пароля", "очень слабый", "слабый", "средний", "хороший", "надёжный"];

function update() {
  // form.elements, т.к. form.name — это атрибут самой формы
  const fields = form.elements;
  const user = {
    name: fields.name.value,
    nickname: fields.nickname.value,
    email: fields.email.value,
    phone: fields.phone.value,
    password: fields.password.value,
  };
  const score = drawAvatar(canvas, user);
  strength.textContent = `Надёжность: ${STRENGTH_LABELS[score]} (${score}/5)`;
}

form.addEventListener("input", update);
form.addEventListener("submit", (event) => event.preventDefault());
// перерисовываем после загрузки шрифта Oswald для буквы
document.fonts.ready.then(update);
update();
