window.onload = function () {
  console.log('window load');
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
  ctx.fillStyle = '#abf';
  ctx.strokeStyle = '#abf';

  var pos = { x: 250, y: 250 };
  var speed = { x: Math.random() * 10 - 5, y: Math.random() * 10 - 5 };

  let lasttime = 0;

  function animation(frame) {
    window.requestAnimationFrame(animation);
    document.title = frame - lasttime;
    lasttime = frame;
    if (pos.x < 0 || pos.x > canvas.width) {
      speed.x = -speed.x;
    }
    if (pos.y < 0 || pos.y > canvas.height) {
      speed.y = -speed.y;
    }

    pos.x += speed.x;
    pos.y += speed.y;
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    // console.log(pos.x, pos.y);
  }
  animation();
};
