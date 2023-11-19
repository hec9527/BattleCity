/** @type {HTMLDivElement} */
const control = document.querySelector('#control');
/** @type {HTMLDivElement} */
const rocker = document.querySelector('#rocker');

const radius = control.offsetWidth / 2;

let originX = 0;
let originY = 0;

document.addEventListener('touchstart', e => {
  if (e.touches.length > 1) return;

  originX = e.touches[0].pageX;
  originY = e.touches[0].pageY;

  const x = originX - radius;
  const y = originY - radius;

  control.style.left = x + 'px';
  control.style.top = y + 'px';
  control.style.visibility = 'visible';
});

document.addEventListener(
  'touchmove',
  e => {
    e.preventDefault();
    let x = 0;
    let y = 0;
    const diffX = e.touches[0].pageX - originX;
    const diffY = e.touches[0].pageY - originY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance >= radius) {
      const rate = radius / distance;
      x = diffX * rate;
      y = diffY * rate;
    } else {
      x = diffX;
      y = diffY;
      const maxY = Math.sqrt(radius ** 2 - x ** 2);
      if (Math.abs(y) > maxY) {
        y = maxY * (diffY > 0 ? 1 : -1);
      }
    }

    rocker.style.transform = `translate(${x}px, ${y}px)`;
    const dir = getDirection(diffX, diffY);
    console.log(dir);
  },
  { passive: false },
);

document.addEventListener('touchend', e => {
  e.preventDefault();
  if (e.touches.length > 0) return;
  // control.style.visibility = 'hidden';
  rocker.style.transform = 'unset';
});

/**
 * @param {number} dx
 * @param {number} dy
 */
function getDirection(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'bottom' : 'top';
  }
}
