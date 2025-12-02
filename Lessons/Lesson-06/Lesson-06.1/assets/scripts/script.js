const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

const size = 200;

let circlePos = size/2;

function draw() {

    ctx.clearRect(0, 0, width, height);

    circlePos += 2;

    if (circlePos > height + 80){
        circlePos = -80;
    }

    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillRect(width/2 - size/2, height/2 - size/2, size, size)

    ctx.beginPath();
    ctx.fillStyle = 'pink';
    ctx.arc(width/2, circlePos, 100, 0, Math.PI *2)
    ctx.fill();

    requestAnimationFrame(draw);

}

draw()



// function draw() {

//     // console.log('Hello')
//     ctx.fillStyle = 'white'
//     ctx.clearRect(0, 0, width, height)

//     circlePos += 0.5;

//     ctx.fillStyle = 'black';
//     ctx.font = '40px Arial';
//     ctx.fillText('Hello', 100, 100)

//     ctx.save();
//     ctx.translate(width/2, height/2);

//         ctx.fillStyle = 'blue';
//         ctx.fillRect(0, 0, size, size)

//         ctx.fillStyle = 'pink';
//         ctx.arc(circlePos, circlePos, 50, 0, Math.PI*2)
//         ctx.fill()

//     ctx.restore();

//     requestAnimationFrame(draw);

// }