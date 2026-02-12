const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let showFlower = false;

let flowers = [];

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

class Flower {
  constructor(x, maxStemHeight, petalColor) {
    this.x = x;
    this.baseY = canvas.height / 2 + 200;

    this.stemHeight = 0;
    this.maxStemHeight = maxStemHeight;

    this.bloomScale = 0;
    this.petalColor = petalColor;
  }

  update() {
    if (this.stemHeight < this.maxStemHeight) {
      this.stemHeight += 3; // faster grow
    } else if (this.bloomScale < 1) {
      this.bloomScale += 0.03;
    }
  }

  draw() {
    const centerX = this.x;
    const bottomY = this.baseY;

    // 🌱 Stem
    ctx.strokeStyle = "#00ff99";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(centerX, bottomY);
    ctx.lineTo(centerX, bottomY - this.stemHeight);
    ctx.stroke();

    // 🌸 Flower
    if (this.stemHeight >= this.maxStemHeight) {
      const flowerY = bottomY - this.stemHeight;

      ctx.save();
      ctx.translate(centerX, flowerY);
      ctx.scale(this.bloomScale, this.bloomScale);

      // Bigger petals
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.fillStyle = this.petalColor;
        ctx.ellipse(0, -50, 30, 70, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Center glow
      ctx.beginPath();
      ctx.fillStyle = "#ff1744";
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
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

  if (showFlower) {
    flowers.forEach((flower) => {
      flower.update();
      flower.draw();
    });
  }

  requestAnimationFrame(animate);
}

function drawFlower() {
  const centerX = canvas.width / 2;
  const bottomY = canvas.height / 2 + 150;

  // 🌱 Grow stem
  if (stemHeight < maxStemHeight) {
    stemHeight += 2;
  }

  ctx.strokeStyle = "#00ff99";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(centerX, bottomY);
  ctx.lineTo(centerX, bottomY - stemHeight);
  ctx.stroke();

  // 🌸 Bloom after stem finishes
  if (stemHeight >= maxStemHeight) {
    if (bloomScale < 1) {
      bloomScale += 0.02;
    }

    const flowerY = bottomY - stemHeight;

    ctx.save();
    ctx.translate(centerX, flowerY);
    ctx.scale(bloomScale, bloomScale);

    // Draw petals
    for (let i = 0; i < 6; i++) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.fillStyle = "#ffffff";
      ctx.ellipse(0, -30, 20, 40, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center
    ctx.beginPath();
    ctx.fillStyle = "#ff4d6d";
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
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

  showFlower = true;

  flowers = [
    new Flower(canvas.width / 2 - 250, 300, "#ffffff"),
    new Flower(canvas.width / 2 - 120, 350, "#ffb3c6"),
    new Flower(canvas.width / 2, 380, "#ffffff"), // center biggest
    new Flower(canvas.width / 2 + 120, 350, "#ffb3c6"),
    new Flower(canvas.width / 2 + 250, 300, "#ffffff"),
  ];
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
