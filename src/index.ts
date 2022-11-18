import Loader from './loader/';
import Printer from './util/print';
import keyboard from './object/keyboard';
import './object/simulator';
import './util/orientation';
import './util/build-info';
import './less/index.less';

Printer.copyright();

window.allowEnemyPick = true;

Loader().then(() => {
  Printer.info('资源加载完毕');
  import('./win').then(win => {
    const windowManager = new win.default();

    function gameLoop() {
      // requestAnimationFrame(gameLoop);
      keyboard.emitControl();
      windowManager.update();
      windowManager.draw();
    }

    // gameLoop();
    setInterval(gameLoop, 1000 / 60);
  });
});
