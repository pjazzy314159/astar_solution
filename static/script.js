const W = 17;
const H = 18;
const size = 40;

const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");

const shelfBtn = document.getElementById("shelfBtn");
const itemBtn = document.getElementById("itemBtn");
const runBtn = document.getElementById("runBtn");

let mode = "item";
let start = [0, 0];
let items = [];
let shelves = [];
let route = [];

canvas.addEventListener("click", handleClick);
shelfBtn.onclick = () => (mode = "shelf");
itemBtn.onclick = () => (mode = "item");

function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / size);
    const y = Math.floor((e.clientY - rect.top) / size);

    if (mode === "item") {
        items.push([x, y]);
    } else if (mode === "shelf") {
        shelves.push([x, y]);
    }

    drawGrid();
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            ctx.fillStyle = "#111827";
            if (shelves.some((s) => s[0] === x && s[1] === y)) {
                ctx.fillStyle = "#374151";
            }

            ctx.fillRect(x * size, y * size, size, size);
            ctx.strokeStyle = "#1f2937";
            ctx.strokeRect(x * size, y * size, size, size);
        }
    }

    drawItems();
}

function drawItems() {
    ctx.fillStyle = "orange";
    items.forEach((p) => {
        ctx.beginPath();
        ctx.arc(
            p[0] * size + size / 2,
            p[1] * size + size / 2,
            8,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });

    ctx.fillStyle = "lime";
    ctx.beginPath();
    ctx.arc(
        start[0] * size + size / 2,
        start[1] * size + size / 2,
        10,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

async function solve() {
    const res = await fetch("/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, items, shelves }),
    });

    const data = await res.json();
    route = data.path;
    animate();
}

async function animate() {
    for (let i = 0; i < route.length; i++) {
        drawGrid();

        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 3;
        ctx.beginPath();

        for (let j = 0; j <= i; j++) {
            const r = route[j];
            if (j === 0) {
                ctx.moveTo(
                    r[0] * size + size / 2,
                    r[1] * size + size / 2
                );
            } else {
                ctx.lineTo(
                    r[0] * size + size / 2,
                    r[1] * size + size / 2
                );
            }
        }
        ctx.stroke();

        const p = route[i];
        ctx.fillStyle = "cyan";
        ctx.beginPath();
        ctx.arc(
            p[0] * size + size / 2,
            p[1] * size + size / 2,
            10,
            0,
            Math.PI * 2
        );
        ctx.fill();
        await new Promise((r) => setTimeout(r, 60));
    }
}

runBtn.onclick = solve;
drawGrid();
