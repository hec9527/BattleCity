import Loader from './loader/';
import Printer from './util/print';
import Keyboard from './object/keyboard';
import '/src/assets/less/index.less';

// Printer.copyright();

Loader().then(() => {
  Printer.info('资源加载完毕');
  import('./win').then(win => {
    const keyboard = new Keyboard();
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
