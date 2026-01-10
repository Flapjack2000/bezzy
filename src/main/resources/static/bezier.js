const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const drawButton = document.getElementById('drawButton');
const clearButton = document.getElementById('clearButton');

let controlPoints = [

    { x: 75, y: 160 },
    { x: 40, y: 500 },
    { x: 680, y: 100 },
    { x: 650, y: 480 },
];

canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    controlPoints.push({ x: x, y: y });
    drawControlPoints();
});

function drawControlPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    ctx.fillStyle = '#ff0000';
    for (let point of controlPoints) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

drawControlPoints();
drawButton.click();

