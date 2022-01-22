import Loader from './loader/';
import Printer from './util/print';
import '/src/assets/less/index.less';
import Controller from './util/ally-control';

new Controller();

// Printer.copyright();

Loader().then(() => {
  Printer.info('资源加载完毕');
  import('./object/game').then(game => {
    import('./win/win-start').then(win => {
      game.default.getInstance().setGameWin(new win.default());
    });
  });
});
