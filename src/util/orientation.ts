import { $ } from '.';

export default undefined;

const isMobile = /iphone|ipad|ipod|android|micromessenger/i.test(window.navigator.userAgent);
const container = $('#container') as HTMLDivElement;

/** @returns isLandScape */
const checkOrientation = () => {
  if (!isMobile) return false;
  const { width, height } = window.screen;
  if (width < height) {
    return true;
  } else {
    return false;
  }
};

const handleOrientationChange = () => {
  switch (window.orientation) {
    case -90:
    case 90:
      console.log('横屏:' + window.orientation);
      container.classList.remove('rotate');
      break;
    case 0:
    case 180:
      container.classList.add('rotate');
      console.log('竖屏:' + window.orientation);
      break;
    default:
      checkOrientation();
  }
};

// 判断屏幕方向;
if (window.orientation == 0 || window.orientation == 180 || checkOrientation()) {
  if (!container.classList.contains('rotate')) {
    container.classList.add('rotate');
  }
}

// 监听屏幕方向;
window.onorientationchange = handleOrientationChange;
window.onresize = handleOrientationChange;
