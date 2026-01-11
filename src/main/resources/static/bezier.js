const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const drawButton = document.getElementById('drawButton');
const clearButton = document.getElementById('clearButton');
const pointsTable = document.getElementById('pointsTable');

ctx.translate(0, canvas.height);
ctx.scale(1, -1);

let controlPoints = [
    { x: 75, y: 160 },
    { x: 40, y: 500 },
    { x: 680, y: 100 },
    { x: 650, y: 480 }
];

function updatePoint(index, coord, value) {
    controlPoints[index][coord] = parseFloat(value);
    drawControlPoints();
}

function deletePoint(index) {
    controlPoints.splice(index, 1);
    drawControlPoints();
    updatePointsTable();
}

function updatePointsTable() {
    pointsTable.parentElement.parentElement.hidden = !controlPoints.length;
    pointsTable.innerHTML = controlPoints.map((point, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><input type="number" value="${Math.round(point.x)}" onchange="updatePoint(${index}, 'x', this.value)"></td>
            <td><input type="number" value="${Math.round(point.y)}" onchange="updatePoint(${index}, 'y', this.value)"></td>
            <td><button onclick="deletePoint(${index})">Delete</button></td>
        </tr>
    `).join('');
}

function drawControlPoints() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (controlPoints.length > 1) {
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(controlPoints[0].x, controlPoints[0].y);
        for (let i = 1; i < controlPoints.length; i++) {
            ctx.lineTo(controlPoints[i].x, controlPoints[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }

    const colorPalette = ['#FF0000', '#0000FF', '#00FF00', '#FF8C00', '#9400D3', '#00FFFF', '#FFD700', '#FF1493'];
    for (let i = 0; i < controlPoints.length; i++) {
        const point = controlPoints[i];
        ctx.fillStyle = colorPalette[i % colorPalette.length];
        ctx.beginPath();
        ctx.save();
        ctx.translate(point.x, point.y);
        ctx.scale(1, -1);
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.restore();
        ctx.fill();
    }
}

function drawCurve(curvePoints) {
    if (curvePoints.length === 0) return;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
    for (let i = 1; i < curvePoints.length; i++) {
        ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
    }
    ctx.stroke();
}

canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    const x = canvasX;
    const y = canvas.height - canvasY;

    controlPoints.push({ x: x, y: y });
    drawControlPoints();
    updatePointsTable();
});

drawButton.addEventListener('click', function () {
    if (controlPoints.length < 2) {
        alert('Please add at least 2 control points');
        return;
    }

    fetch('/api/bezier/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ points: controlPoints })
    })
        .then(response => response.json())
        .then(curvePoints => {
            drawControlPoints();
            drawCurve(curvePoints);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error calculating curve');
        });
});

clearButton.addEventListener('click', function () {
    controlPoints = [];
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    updatePointsTable();
});

drawControlPoints();
updatePointsTable();
drawButton.click();