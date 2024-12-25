const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let brushColor = document.getElementById('colorPicker').value;
let brushSize = document.getElementById('brushSize').value;
let eraserMode = false;
let paths = [];
let currentPath = [];

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

document.getElementById('colorPicker').addEventListener('input', (e) => {
    brushColor = e.target.value;
    eraserMode = false;
});

document.getElementById('brushSize').addEventListener('input', (e) => {
    brushSize = e.target.value;
});

document.getElementById('eraser').addEventListener('click', () => {
    eraserMode = true;
});

document.getElementById('eraserSize').addEventListener('input', (e) => {
    brushSize = e.target.value;
});

document.getElementById('clearCanvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paths = [];
});

document.getElementById('undo').addEventListener('click', () => {
    if (paths.length > 0) {
        paths.pop();
        redraw();
    }
});

function startDrawing(e) {
    drawing = true;
    currentPath = [];
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function draw(e) {
    if (!drawing) return;

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = eraserMode ? '#FFFFFF' : brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();

    currentPath.push({ x, y, brushColor: ctx.strokeStyle, brushSize: ctx.lineWidth });
}

function stopDrawing() {
    drawing = false;
    paths.push([...currentPath]);
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paths.forEach(path => {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        path.forEach(point => {
            ctx.lineTo(point.x, point.y);
            ctx.strokeStyle = point.brushColor;
            ctx.lineWidth = point.brushSize;
            ctx.lineCap = 'round';
            ctx.stroke();
        });
    });
}