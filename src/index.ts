import Loader from './loader/';
import Printer from './util/print';
import keyboard from './controller/keyboard';
import './util/orientation';
import './controller/simulator';
import './util/build-info';
import './less/index.less';

Printer.copyright();

window.allowEnemyPick = true;

Loader().then(() => {
  Printer.info('资源加载完毕');
  import('./win').then(win => {
    const windowManager = new win.default();
    let lastTime = 0;

    function gameLoop(time: number) {
      requestAnimationFrame(gameLoop);
      if (time - lastTime < 16) {
        return;
      }

      lastTime = time;

      keyboard.emitControl();
      windowManager.update();
      windowManager.draw();
    }

    gameLoop(lastTime);
  });
});
