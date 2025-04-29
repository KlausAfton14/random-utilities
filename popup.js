let currentDiceSides = 6;
let wheelOptions = ["1", "2", "3"];
let isSpinning = false;

function rollDice() {
  const roll = (crypto.getRandomValues(new Uint32Array(1))[0] % currentDiceSides) + 1;
  document.getElementById("diceResult").textContent = `🎲 Result: ${roll}`;
}

function changeDice() {
  const sides = prompt("Enter number of sides (e.g. 6, 12, 20):", currentDiceSides);
  const parsed = parseInt(sides);
  if (!isNaN(parsed) && parsed > 0) {
    currentDiceSides = parsed;
    document.getElementById("diceType").textContent = `Dice: d${currentDiceSides}`;
  }
}

function drawWheel() {
  const canvas = document.getElementById("wheelCanvas");
  const ctx = canvas.getContext("2d");
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;
  const sliceAngle = (2 * Math.PI) / wheelOptions.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  wheelOptions.forEach((option, index) => {
    const startAngle = index * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = `hsl(${index * 360 / wheelOptions.length}, 70%, 60%)`;
    ctx.fill();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "black";
    ctx.font = "14px sans-serif";
    ctx.fillText(option, radius - 10, 5);
    ctx.restore();
  });
}

function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;

  let canvas = document.getElementById("wheelCanvas");
  let ctx = canvas.getContext("2d");

  const sliceAngle = 2 * Math.PI / wheelOptions.length;
  const selected = crypto.getRandomValues(new Uint32Array(1))[0] % wheelOptions.length;
  const selectedOption = wheelOptions[selected];

  const selectedAngle = (selected * sliceAngle) + (sliceAngle / 2);
  const targetAngle = (3 * Math.PI / 2) - selectedAngle;
  const totalRotation = (Math.PI * 10) + targetAngle;

  let start = null;
  let currentAngle = 0;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    const duration = 2000;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    currentAngle = easedProgress * totalRotation;

    drawRotatedWheel(currentAngle);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      document.getElementById("wheelResult").textContent = `🎯 Selected: ${selectedOption}`;
      isSpinning = false;
    }
  }

  requestAnimationFrame(animate);
}

function drawRotatedWheel(rotation) {
  const canvas = document.getElementById("wheelCanvas");
  const ctx = canvas.getContext("2d");
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;
  const sliceAngle = (2 * Math.PI) / wheelOptions.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  wheelOptions.forEach((option, index) => {
    const startAngle = index * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = `hsl(${index * 360 / wheelOptions.length}, 70%, 60%)`;
    ctx.fill();

    ctx.save();
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "black";
    ctx.font = "14px sans-serif";
    ctx.fillText(option, radius - 10, 5);
    ctx.restore();
  });

  ctx.restore();
}

function addWheelOption() {
  const newOption = prompt("Enter new option:");
  if (newOption && newOption.trim().length > 0) {
    wheelOptions.push(newOption.trim());
    drawWheel();
  }
}

function removeWheelOption() {
  const toRemove = prompt("Enter the option to remove:");
  if (toRemove && wheelOptions.includes(toRemove)) {
    wheelOptions = wheelOptions.filter(opt => opt !== toRemove);
    drawWheel();
  } else {
    alert("Option not found.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("rollDice").addEventListener("click", rollDice);
  document.getElementById("changeDice").addEventListener("click", changeDice);
  document.getElementById("spinWheel").addEventListener("click", spinWheel);
  document.getElementById("addOption").addEventListener("click", addWheelOption);
  document.getElementById("removeOption").addEventListener("click", removeWheelOption);

  document.getElementById("switchGame").addEventListener("change", (e) => {
    if (e.target.checked) {
      document.getElementById("dice").style.display = "none";
      document.getElementById("wheel").style.display = "block";
    } else {
      document.getElementById("wheel").style.display = "none";
      document.getElementById("dice").style.display = "block";
    }
  });

  drawWheel();
});
