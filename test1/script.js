const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas to cover the entire screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set car properties and positions
let xCars = 5;
let yCars = 3;
let carsX = [];
let carsY = [];
let xLight = 'red';
let yLight = 'green';
let roadWidth = 150; // Road width for both X and Y

function startSimulation() {
  // Reset cars
  carsX = [];
  carsY = [];
  
  // Get input values
  xCars = parseInt(document.getElementById('xCars').value);
  yCars = parseInt(document.getElementById('yCars').value);
  
  // Initialize car positions for X and Y axes
  for (let i = 0; i < xCars; i++) {
    carsX.push({ x: 50 + i * 100, y: canvas.height / 2 - roadWidth / 2 + 25 });
  }

  for (let i = 0; i < yCars; i++) {
    carsY.push({ x: canvas.width / 2 - roadWidth / 2 + 25, y: 50 + i * 100 });
  }

  // Start the animation
  requestAnimationFrame(updateSimulation);
}

function updateSimulation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw roads
  ctx.fillStyle = '#999999';
  ctx.fillRect(0, canvas.height / 2 - roadWidth / 2, canvas.width, roadWidth); // Horizontal road
  ctx.fillRect(canvas.width / 2 - roadWidth / 2, 0, roadWidth, canvas.height); // Vertical road

  // Determine traffic lights based on number of cars
  determineTrafficLights();

  // Draw traffic lights
  drawTrafficLights();

  // Move cars
  if (xLight === 'green') {
    moveCars(carsX, 'horizontal');
  }
  
  if (yLight === 'green') {
    moveCars(carsY, 'vertical');
  }

  // Draw cars
  drawCars(carsX, 'horizontal');
  drawCars(carsY, 'vertical');

  // Remove cars that have reached the end of the road
  removeOffScreenCars(carsX, 'horizontal');
  removeOffScreenCars(carsY, 'vertical');

  // Continue the animation
  requestAnimationFrame(updateSimulation);
}

function determineTrafficLights() {
  // If there are more cars on the X-axis, give the X-axis green light
  if (carsX.length > carsY.length) {
    xLight = 'green';
    yLight = 'red';
  } 
  // If there are more cars on the Y-axis, give the Y-axis green light
  else if (carsY.length > carsX.length) {
    xLight = 'red';
    yLight = 'green';
  }
  // If both have the same number of cars, let X pass first
  else if (carsX.length === carsY.length) {
    // First, let X pass
    if (xLight === 'red' && yLight === 'green') {
      xLight = 'green';
      yLight = 'red';
    }
  }

  // Once all X cars pass, let Y pass
  if (carsX.length === 0 && xLight === 'green') {
    xLight = 'red';
    yLight = 'green';
  }
}

function drawTrafficLights() {
  // Draw X-axis traffic light (on the middle left side of the road)
  ctx.fillStyle = xLight === 'red' ? 'red' : 'green';
  ctx.fillRect(canvas.width / 2 - roadWidth / 2 - 30, canvas.height / 2 - roadWidth / 2 - 30, 20, 20); // X-axis light

  // Draw Y-axis traffic light (on the middle top side of the road)
  ctx.fillStyle = yLight === 'red' ? 'red' : 'green';
  ctx.fillRect(canvas.width / 2 + roadWidth / 2 + 10, canvas.height / 2 - roadWidth / 2 - 30, 20, 20); // Y-axis light
}

function moveCars(cars, direction) {
  const carSpeed = 2; // Adjust car speed

  if (direction === 'horizontal') {
    for (let i = 0; i < cars.length; i++) {
      cars[i].x += carSpeed; // Move right slowly
    }
  } else if (direction === 'vertical') {
    for (let i = 0; i < cars.length; i++) {
      cars[i].y += carSpeed; // Move down slowly
    }
  }
}

function drawCars(cars, direction) {
  ctx.fillStyle = 'blue';
  for (let i = 0; i < cars.length; i++) {
    if (direction === 'horizontal') {
      ctx.fillRect(cars[i].x, cars[i].y, 30, 15); // Draw car
    } else {
      ctx.fillRect(cars[i].x, cars[i].y, 15, 30); // Draw car
    }
  }
}

function removeOffScreenCars(cars, direction) {
  if (direction === 'horizontal') {
    for (let i = cars.length - 1; i >= 0; i--) {
      if (cars[i].x > canvas.width) {
        cars.splice(i, 1); // Remove car when it moves off screen
      }
    }
  } else if (direction === 'vertical') {
    for (let i = cars.length - 1; i >= 0; i--) {
      if (cars[i].y > canvas.height) {
        cars.splice(i, 1); // Remove car when it moves off screen
      }
    }
  }
}
