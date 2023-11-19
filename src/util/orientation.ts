import { $ } from '.';

export default undefined;

const isMobile = /iphone|ipad|ipod|android|micromessenger/i.test(window.navigator.userAgent);
const container = $('#container') as HTMLDivElement;

/** @returns isLandScape */
const checkLandScape = () => {
  if (!isMobile) return false;
  const { width, height } = window.screen;
  if (width > height) {
    return true;
  } else {
    return false;
  }
};

const handleOrientationChange = () => {
  switch (window.orientation) {
    case -90:
    case 90:
      console.debug('横屏:' + window.orientation);
      container.classList.add('landScape');
      window.isLandScape = true;
      break;
    case 0:
    case 180:
      container.classList.remove('landScape');
      console.debug('竖屏:' + window.orientation);
      window.isLandScape = false;
      break;
    default:
      checkLandScape();
  }
};

const isLandScape = (window.isLandScape = window.orientation == 90 || window.orientation == -90 || checkLandScape());

// 判断屏幕方向;
if (isLandScape) {
  if (!container.classList.contains('landScape')) {
    container.classList.add('landScape');
  }
}

// 监听屏幕方向;
window.onorientationchange = handleOrientationChange;
window.onresize = handleOrientationChange;
// TODO 新的change API
window.addEventListener('change', e => {
  console.log(e);
});
