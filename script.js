const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function heartShape(t) {
  let x = 16 * Math.pow(Math.sin(t), 3);
  let y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  return { x, y };
}

function createHeart() {
  particles = [];
  for (let i = 0; i < 1000; i++) {
    let t = Math.random() * Math.PI * 2;
    let pos = heartShape(t);

    let x = canvas.width / 2 + pos.x * 15;
    let y = canvas.height / 2 - pos.y * 15;

    particles.push(new Particle(x, y));
  }
}

function animate() {
  ctx.fillStyle = "rgba(43,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

createHeart();
animate();

// YES button
const yesBtn = document.getElementById("yesBtn");
const successScreen = document.getElementById("successScreen");
const mainUI = document.getElementById("mainUI");

yesBtn.addEventListener("click", () => {
  mainUI.style.display = "none"; // hide main content
  successScreen.classList.add("active");
});

// NO button runs away
const noBtn = document.getElementById("noBtn");

const noTexts = [
  "No",
  "Are you sure? 🥺",
  "Really sure? 😢",
  "Think again 💔",
  "Last chance 😭",
  "You can’t say no 😤",
  "Pleaseee ❤️",
  "Okay fine... 😔",
  "Syntax Error! 🚫",
];

let clickCount = 0;
let yesScale = 1;

noBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Change text until "Error Found."
  //   if (clickCount < noTexts.length - 1) {
  //     clickCount++;
  //     noBtn.textContent = noTexts[clickCount];
  //   }

  moveNoButton();

  // 🔥 Make YES more attractive every click
  yesScale += 0.1;
  yesBtn.style.transform = `scale(${yesScale})`;

  // Add glowing pulse effect after few clicks
  if (clickCount >= 2) {
    yesBtn.classList.add("attractive");
  }

  // Change color gradually
  //   const redIntensity = Math.min(255, 77 + clickCount * 15);
  //   yesBtn.style.background = `rgb(${redIntensity}, 50, 100)`;
});

function moveNoButton() {
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const contentWrapper = document.querySelector(".content-wrapper");
  const contentRect = contentWrapper.getBoundingClientRect();

  const padding = 20;

  const minY = contentRect.bottom + padding; // start BELOW text
  const maxY = window.innerHeight - buttonHeight;

  const minX = padding;
  const maxX = window.innerWidth - buttonWidth - padding;

  const randomX = Math.random() * (maxX - minX) + minX;
  const randomY = Math.random() * (maxY - minY) + minY;

  noBtn.style.position = "fixed";
  noBtn.style.left = randomX + "px";
  noBtn.style.top = randomY + "px";
}

noBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Change text only if not yet at last message
  if (clickCount < noTexts.length - 1) {
    clickCount++;
    noBtn.textContent = noTexts[clickCount];
  }

  // ALWAYS move the button
  moveNoButton();
});
