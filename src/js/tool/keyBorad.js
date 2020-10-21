const GAME_LONG_KEYBORAD = new KeyBorad();

/**
 * 键盘事件监测类
 */
function KeyBorad() {
  const pressed = new Set();
  const blocked = new Set();
  const blockTicks = 150; // 连续响应间隔
  let isPasued = false;

  window.addEventListener('keydown', (e) => {
    if ((isPasued && e.key === GAME_CONFIG_KEYS.p1.start) || !isPasued) {
      pressed.add(e.key);
    }
  });

  window.addEventListener('keyup', (e) => {
    pressed.delete(e.key);
    blocked.delete(e.key);
  });

  /** 是否已经按下某个按键 , 非连续响应 */
  this.isTapKey = function (key) {
    if (pressed.has(key) && !blocked.has(key)) {
      blocked.add(key);
      return true;
    }
    return false;
  };

  /** 检测是否按下某个按键 */
  this.isPressedAny = function (...keys) {
    return keys.some((key) => pressed.has(key));
  };

  /** 是否已经按下某个按键， 可以快速连续响应 */
  this.isPressedKey = function (key) {
    return !blocked.has(key) && pressed.has(key);
  };

  /** 是否按下某个按键 */
  this.isKeyDown = function (key) {
    if (!blocked.has(key) && pressed.has(key)) {
      blocked.add(key);
      setTimeout(() => blocked.delete(key), blockTicks);
      return true;
    }
    return false;
  };

  /** 游戏是否暂停 */
  this.isPasued = function () {
    return isPasued;
  };

  /** 清除所有按键 */
  this.clearKeys = function () {
    try {
      pressed.clear();
      blocked.clear();
    } catch (e) {
      new Print().error(e);
      return true;
    }
    return true;
  };
}
