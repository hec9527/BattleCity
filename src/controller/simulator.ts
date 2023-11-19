import { $ } from '../util';
import keyboard from './keyboard';

type Direction = 'right' | 'left' | 'bottom' | 'top';

const isMobile = /iphone|ipad|ipod|android|micromessenger/i.test(window.navigator.userAgent);
const landScapeCacheKey = 'tank_landScape_simulator_layout';
const verticalCacheKey = 'tank_vertical_simulator_layout';
const wrap = $('#control-wrap') as HTMLDivElement;
const control = $('#control') as HTMLDivElement;
const rocker = $('#rocker') as HTMLDivElement;
const menu = $('#menu') as HTMLDivElement;
const action = $('#action') as HTMLDivElement;
const select = $('#select') as HTMLDivElement;
const start = $('#start') as HTMLDivElement;
const a = $('#A') as HTMLDivElement;
const b = $('#B') as HTMLDivElement;
const c = $('#C') as HTMLDivElement;
const d = $('#D') as HTMLDivElement;

enum dir_keys {
  top = 'w',
  right = 'd',
  bottom = 's',
  left = 'a',
}

let config: ISimulatorConfig;
let originX = 0;
let originY = 0;
let radius = control.offsetWidth / 2;
let currentDirection: Direction | undefined;
let lastDirection: Direction | undefined;
let emitInterval: NodeJS.Timeout | undefined;

if (isMobile) {
  window.onload = function () {
    radius = control.offsetWidth / 2;

    const list: [HTMLDivElement, string][] = [
      [select, 'v'],
      [start, 'b'],
      [a, 'g'],
      [b, 'h'],
      [c, 'g'],
      [d, 'h'],
    ];

    list.forEach(([el, key]) => {
      el.addEventListener('touchend', () => keyboard.release(key));
      el.addEventListener('touchstart', e => {
        keyboard.press(key);
      });
    });
  };

  // 禁用双击缩放
  document.documentElement.addEventListener('touchend', e => {
    e.preventDefault();
  });

  // 禁止长按右键菜单
  window.addEventListener('contextmenu', e => {
    e.preventDefault();
  });

  // 初始化模拟器布局
  initSimulatorWidget();
  window.addEventListener('resize', initSimulatorWidget);
  window.addEventListener('orientationchange', initSimulatorWidget);
  wrap.addEventListener('touchstart', handleTouchStart, { capture: true });
  wrap.addEventListener('touchmove', handleTouchMove, { passive: false });
  wrap.addEventListener('touchend', handleTouchEnd, { capture: true });
}

function initSimulatorWidget() {
  const key = window.isLandScape ? landScapeCacheKey : verticalCacheKey;
  console.log({ landScape: window.isLandScape });

  try {
    if (!Object.keys(config).length) throw new Error('');
    config = JSON.parse(localStorage.getItem(key) || '');
  } catch {
    config = window.isLandScape ? getLandScapeDefaultLayout() : getVerticalDefaultLayout();
  }

  localStorage.setItem(key, JSON.stringify(config));
  requestAnimationFrame(() => setSimulatorWidgetPosition(config));
}

function getVerticalDefaultLayout(): ISimulatorConfig {
  const obj = {} as ISimulatorConfig;
  const menuDefaultSize = [200, 28];
  const actionDefaultSize = [120, 120];
  const w = window.innerWidth;
  const h = window.innerHeight;

  obj.control = {
    x: w * 0.15,
    y: h * 0.1,
    scale: 1,
  };

  obj.menu = {
    x: menuDefaultSize[1] * 1.5,
    y: (h - menuDefaultSize[0]) / 2,
    scale: 1,
  };

  obj.action = {
    x: w * 0.15,
    y: h - actionDefaultSize[1] - 0.15 * h,
    scale: 1,
  };

  return obj;
}

function getLandScapeDefaultLayout(): ISimulatorConfig {
  const obj = {} as ISimulatorConfig;
  const directionDefaultSize = [140, 140];
  const menuDefaultSize = [200, 28];
  const actionDefaultSize = [120, 120];
  const w = window.innerWidth;
  const h = window.innerHeight;

  obj.control = {
    x: 0.1 * w,
    y: h - directionDefaultSize[0] - 0.1 * h,
    scale: 1,
  };

  obj.menu = {
    x: (w - menuDefaultSize[0]) / 2,
    y: h - menuDefaultSize[1] * 2.5,
    scale: 1,
  };

  obj.action = {
    x: w - actionDefaultSize[0] - 0.1 * w,
    y: 0.75 * h - actionDefaultSize[1],
    scale: 1,
  };

  return obj;
}

function setSimulatorWidgetPosition(config: ISimulatorConfig) {
  control.style.left = config.control.x + 'px';
  control.style.top = config.control.y + 'px';
  control.style.transform = `scale(${config.control.scale})`;
  const els = [control, menu, action];
  const widget: ISimulatorWidgets[] = ['control', 'menu', 'action'];

  els.forEach((el, index) => {
    const _conf = config[widget[index]];
    el.style.left = _conf.x + 'px';
    el.style.top = _conf.y + 'px';
    el.style.transform = `scale(${_conf.scale})`;
  });
}

function checkIsInControl(el: HTMLDivElement): boolean {
  if (el.nodeName.toUpperCase() === 'BODY') {
    return false;
  }
  const parent = el.offsetParent as HTMLDivElement;
  return el.id === 'control-wrap' || (parent && checkIsInControl(parent));
}

function getControlTouch(touchList: TouchList) {
  return Array.from(touchList).find(item => checkIsInControl(item.target as HTMLDivElement));
}

function handleTouchStart(e: TouchEvent) {
  const controlTouch = getControlTouch(e.touches);
  if (!controlTouch) return;

  const target = e.target as HTMLDivElement;

  // 点击摇杆轮盘范围内，不重新计算轮盘位置
  if ((target.id != 'rocker' && target.id != 'control') || !originX || !originY) {
    originX = controlTouch.pageX;
    originY = controlTouch.pageY;

    const x = originX - radius;
    const y = originY - radius;

    control.style.left = x + 'px';
    control.style.top = y + 'px';
  }

  emitInterval = setInterval(() => {
    if (lastDirection && lastDirection != currentDirection) {
      keyboard.release(dir_keys[lastDirection]);
    }

    if (currentDirection) {
      keyboard.press(dir_keys[currentDirection]);
      lastDirection = currentDirection;
    }
  }, 84);
}

function handleTouchMove(e: TouchEvent) {
  e.preventDefault();
  let x = 0;
  let y = 0;

  const controlTouch = getControlTouch(e.touches);
  if (!controlTouch) return;

  const diffX = controlTouch.pageX - originX;
  const diffY = controlTouch.pageY - originY;
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
  calcDirection(diffX, diffY);
}

function handleTouchEnd(e: TouchEvent) {
  e.preventDefault();

  rocker.style.transform = 'unset';

  clearInterval(emitInterval);

  ['w', 'a', 's', 'd'].forEach(key => {
    keyboard.release(key);
  });

  lastDirection = undefined;
  currentDirection = undefined;
}

function calcDirection(dx: number, dy: number) {
  if (Math.abs(dx) > Math.abs(dy)) {
    currentDirection = dx > 0 ? 'right' : 'left';
  } else {
    currentDirection = dy > 0 ? 'bottom' : 'top';
  }
}
