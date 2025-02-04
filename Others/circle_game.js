const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Orb {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

class Player extends Orb {
    constructor(x, y) {
        super(x, y, 10, "blue");
        this.speed = 3;
    }

    move(keys) {
        if (keys["W"]) this.y -= this.speed;
        if (keys["S"]) this.y += this.speed;
        if (keys["A"]) this.x -= this.speed;
        if (keys["D"]) this.x += this.speed;
    }
}

class ChaseOrb extends Orb {
    constructor(x, y) {
        super(x, y, 10, "red");
        this.speed = 1.5;
    }

    moveTowards(player) {
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let distance = Math.hypot(dx, dy);
        if (distance > 0) {
            this.vx = (dx / distance) * this.speed;
            this.vy = (dy / distance) * this.speed;
        }
        this.x += this.vx;
        this.y += this.vy;
    }

    avoidOthers(chaseOrbs) {
        let repulsionRadius = 30;
        chaseOrbs.forEach((other) => {
            if (other !== this) {
                let dx = this.x - other.x;
                let dy = this.y - other.y;
                let distance = Math.hypot(dx, dy);
                if (distance < repulsionRadius && distance > 0) {
                    this.vx += (dx / distance) * 0.5;
                    this.vy += (dy / distance) * 0.5;
                }
            }
        });
        this.x += this.vx;
        this.y += this.vy;
    }
}

class TeleportOrb extends Orb {
    constructor(x, y) {
        super(x, y, 10, "green");
    }

    teleport(entity) {
        entity.x = Math.random() * canvas.width;
        entity.y = Math.random() * canvas.height;
    }
}

const player = new Player(canvas.width / 2, canvas.height / 2);
const chaseOrbs = Array.from({ length: 5 }, () => new ChaseOrb(Math.random() * canvas.width, Math.random() * canvas.height));
const teleportOrbs = Array.from({ length: 3 }, () => new TeleportOrb(Math.random() * canvas.width, Math.random() * canvas.height));
const keys = {};

document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

function update() {
    player.move(keys);
    
    chaseOrbs.forEach((orb) => {
        orb.moveTowards(player);
        orb.avoidOthers(chaseOrbs);
    });

    teleportOrbs.forEach((teleportOrb) => {
        if (Math.hypot(player.x - teleportOrb.x, player.y - teleportOrb.y) < player.radius + teleportOrb.radius) {
            teleportOrb.teleport(player);
        }
        chaseOrbs.forEach((orb) => {
            if (Math.hypot(orb.x - teleportOrb.x, orb.y - teleportOrb.y) < orb.radius + teleportOrb.radius) {
                teleportOrb.teleport(orb);
            }
        });
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    chaseOrbs.forEach((orb) => orb.draw());
    teleportOrbs.forEach((orb) => orb.draw());
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();