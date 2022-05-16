import Loader from './loader/';
import Printer from './util/print';
import '/src/assets/less/index.less';

// Printer.copyright();

Loader().then(() => {
  Printer.info('资源加载完毕');
  import('./object/game').then(game => {
    // import('./win/win-settle').then(win => {
    // import('./win/win-start').then(win => {
    import('./win/win-select').then(win => {
      const G = game.default.getInstance();
      G.setMode('double');
      G.setStage(1);
      G.setGameWin(new win.default());
      (window as any).game = G;
    });
  });
});
