const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 720;
let time = 0;

type = 'game'; // State tracking ('game', 'game-over', 'game-won')

// Player setup
let player = { x: 640, y: 360, radius: 10, vx: 0, vy: 0, invulnerable: true };
let stamina = 600;
let score = 0;
let gameOver = false;

// Generate random positions
function randPos() { return { x: Math.random() * 1260 + 10, y: Math.random() * 700 + 10 }; }

let spawnOrb = randPos();
player.x = spawnOrb.x;
player.y = spawnOrb.y;

let scoreOrbs = Array.from({ length: 10 }, () => ({ ...randPos(), collected: false }));
let teleportOrbs = Array.from({ length: 15 }, randPos);
let chaseOrbs = Array.from({ length: 8 }, () => ({ ...randPos(), vx: 0, vy: 0 }));

// Key tracking
let keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Game loop
function update() {
    if (gameOver) return;
    time += 1;
    if(time >= 120) {
        player.invulnerable = false;
    }

    // Player movement
    if (keys['w']) player.vy -= 0.4;
    if (keys['s']) player.vy += 0.4;
    if (keys['a']) player.vx -= 0.4;
    if (keys['d']) player.vx += 0.4;
    if (keys[' '] && stamina > 0) {
        player.vx *= 1.1;
        player.vy *= 1.1;
        stamina -= 5;
    }
    player.vx *= 0.95;
    player.vy *= 0.95;
    player.x += player.vx;
    player.y += player.vy;

    // Collision with walls
    if (player.x < 0 || player.x > canvas.width) player.vx *= -0.75;
    if (player.y < 0 || player.y > canvas.height) player.vy *= -0.75;

    // Check collisions with score orbs
    scoreOrbs.forEach(orb => {
        if (!orb.collected && Math.hypot(orb.x - player.x, orb.y - player.y) < 22) {
            orb.collected = true;
            score++;
            stamina = Math.min(600, stamina + 50);
        }
    });

    // Check teleport orbs
    teleportOrbs.forEach(orb => {
        if (Math.hypot(orb.x - player.x, orb.y - player.y) < 22) {
            player.x = spawnOrb.x;
            player.y = spawnOrb.y;
        }
        chaseOrbs.forEach(corb => {
            if(Math.hypot(orb.x - corb.x, orb.y - player.y) < 22){
                corb.x = spawnOrb.x;
                corb.y = spawnOrb.y;
            }
        });
    });

    // Chase orb logic
    chaseOrbs.forEach(orb => {
        let dx = player.x - orb.x;
        let dy = player.y - orb.y;
        let dist = Math.hypot(dx, dy);
        orb.vx += (dx / dist) * 0.5;
        orb.vy += (dy / dist) * 0.5;
        orb.vx *= 0.95;
        orb.vy *= 0.95;
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Collision with player
        if (Math.hypot(orb.x - player.x, orb.y - player.y) < 22 && !player.invulnerable) {
            gameOver = true;
            type = 'game-over';
        }
    });

    if (score === scoreOrbs.length) {
        gameOver = true;
        type = 'game-won';
    }
    requestAnimationFrame(draw);
}

// Draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw objects
    ctx.fillStyle = 'purple';
    ctx.beginPath();
    ctx.arc(spawnOrb.x, spawnOrb.y, 10, 0, Math.PI * 2);
    ctx.fill();

    scoreOrbs.forEach(orb => {
        if (!orb.collected) {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    teleportOrbs.forEach(orb => {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });

    chaseOrbs.forEach(orb => {
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw player
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw stamina bar
    ctx.fillStyle = 'white';
    ctx.fillRect(340, 620, stamina, 10);

    if (type === 'game-over') {
        ctx.fillStyle = 'red';
        ctx.font = '60px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
    }
    if (type === 'game-won') {
        ctx.fillStyle = 'white';
        ctx.font = '60px Arial';
        ctx.fillText('You Won!', canvas.width / 2 - 150, canvas.height / 2);
    }
    requestAnimationFrame(update);
}

// Start game
requestAnimationFrame(update);