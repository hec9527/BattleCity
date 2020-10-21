const GAME_ASSETS_SOUND = new Sound();

/**
 * 音频加载
 */
function Sound() {
  let isLoad = false;
  const path = (fName) => `./audio/${fName}.mp3`;
  const list = [
    'attack',
    'attackOver',
    'bomb',
    'eat',
    'life',
    'misc',
    'move',
    'over',
    'pause',
    'start',
  ];
  const loadSound = () => {
    return list.map((key) => {
      return new Promise((resolve, reject) => {
        const player = new Audio();
        const timer = setTimeout(() => {
          Printer.error(`音频加载失败 ${path(key)}`);
          reject();
        }, 5000);
        player.oncanplay = () => {
          resolve(player);
          clearTimeout(timer);
        };
        player.src = path(key);
      });
    });
  };

  Promise.all(loadSound()).then(
    () => (isLoad = true) && Printer.info('音频加载完成'),
    () => new Error('音频加载失败') && window.location.reload()
  );

  this.isLoad = function () {
    return isLoad;
  };
  /** 每次播放生成新的播放对象，对于可以同时存在多个的音效有用 */
  this.play = function (fName) {
    Printer.debug('播放音乐:', fName);
    if (!list.includes(fName)) {
      return Printer.error(`未注册的音频文件: ${fName}`);
    }
    const player = new Audio();
    player.oncanplay = () => player.play();
    player.src = path(fName);
  };
}
