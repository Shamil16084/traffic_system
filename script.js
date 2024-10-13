const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas to cover the entire screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;// Vehicle types and weights
const VEHICLE_TYPES = {
  "car": { weight: 1, color: 'blue' },
  "bus": { weight: 2, color: 'orange' },
  "emergency": { weight: 3, color: 'red' },  // Police, Ambulance
};

// Set car properties and positions
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
  const xCars = parseInt(document.getElementById('xCars').value);
  const xBuses = parseInt(document.getElementById('xBuses').value);
  const xUrgent = parseInt(document.getElementById('xUrgent').value);
  const yCars = parseInt(document.getElementById('yCars').value);
  const yBuses = parseInt(document.getElementById('yBuses').value);
  const yUrgent = parseInt(document.getElementById('yUrgent').value);

  // Initialize car positions for X and Y axes based on input values
  addVehicles(carsX, xCars, xBuses, xUrgent, 'horizontal');
  addVehicles(carsY, yCars, yBuses, yUrgent, 'vertical');

  // Start the animation
  requestAnimationFrame(updateSimulation);
}

function addVehicles(carsArray, cars, buses, urgent, direction) {
  if (direction === 'horizontal') {
    for (let i = 0; i < cars; i++) {
      carsArray.push({ x: 50 + i * 100, y: canvas.height / 2 - roadWidth / 2 + 25, type: 'car', direction });
    }
    for (let i = 0; i < buses; i++) {
      carsArray.push({ x: 50 + (cars + i) * 100, y: canvas.height / 2 - roadWidth / 2 + 25, type: 'bus', direction });
    }
    for (let i = 0; i < urgent; i++) {
      carsArray.push({ x: 50 + (cars + buses + i) * 100, y: canvas.height / 2 - roadWidth / 2 + 25, type: 'emergency', direction });
    }
  } else if (direction === 'vertical') {
    for (let i = 0; i < cars; i++) {
      carsArray.push({ x: canvas.width / 2 - roadWidth / 2 + 25, y: 50 + i * 100, type: 'car', direction });
    }
    for (let i = 0; i < buses; i++) {
      carsArray.push({ x: canvas.width / 2 - roadWidth / 2 + 25, y: 50 + (cars + i) * 100, type: 'bus', direction });
    }
    for (let i = 0; i < urgent; i++) {
      carsArray.push({ x: canvas.width / 2 - roadWidth / 2 + 25, y: 50 + (cars + buses + i) * 100, type: 'emergency', direction });
    }
  }
}

function updateSimulation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw roads
  ctx.fillStyle = '#999999';
  ctx.fillRect(0, canvas.height / 2 - roadWidth / 2, canvas.width, roadWidth); // Horizontal road
  ctx.fillRect(canvas.width / 2 - roadWidth / 2, 0, roadWidth, canvas.height); // Vertical road

  // Determine traffic lights based on vehicle weight
  determineTrafficLights();

  // Draw traffic lights next to the axes
  drawTrafficLights();

  // Move cars only when the light is green for their axis
  if (xLight === 'green') {
    moveCars(carsX, 'horizontal');
  }
  
  if (yLight === 'green') {
    moveCars(carsY, 'vertical');
  }

  // Draw cars (dots now representing cars)
  drawCars(carsX, 'horizontal');
  drawCars(carsY, 'vertical');

  // Remove cars that have reached the end of the road
  removeOffScreenCars(carsX, 'horizontal');
  removeOffScreenCars(carsY, 'vertical');

  // Continue the animation
  requestAnimationFrame(updateSimulation);
}

function drawTrafficLights() {
  const lightWidth = 20;
  const lightHeight = 60;

  // X-axis traffic light (horizontal road) placed at the beginning of the X-axis
  ctx.fillStyle = xLight === 'red' ? 'red' : 'green';
  ctx.fillRect(10, canvas.height / 2 - lightHeight / 2, lightWidth, lightHeight);

  // Y-axis traffic light (vertical road) placed at the beginning of the Y-axis
  ctx.fillStyle = yLight === 'red' ? 'red' : 'green';
  ctx.fillRect(canvas.width / 2 + roadWidth / 2 + 10, 10, lightWidth, lightHeight);
}

function determineTrafficLights() {
  // Calculate the total weight on each road
  const xWeight = carsX.reduce((sum, car) => sum + VEHICLE_TYPES[car.type].weight, 0);
  const yWeight = carsY.reduce((sum, car) => sum + VEHICLE_TYPES[car.type].weight, 0);

  // Give priority to the road with higher weight
  if (xWeight > yWeight) {
    xLight = 'green';
    yLight = 'red';
  } else if (yWeight > xWeight) {
    xLight = 'red';
    yLight = 'green';
  } else {
    // If both weights are equal, let X go first
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
  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    ctx.fillStyle = VEHICLE_TYPES[car.type].color;  // Color based on vehicle type
    ctx.beginPath();
    ctx.arc(car.x, car.y, 10, 0, 2 * Math.PI);  // Draw car as a circle
    ctx.fill();
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