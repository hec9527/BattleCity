import Print from './util/print';
import Source from './loader/index';
import './assets/scss/index';
import game from './game';

// Print.copyright();
// Print.debug('debug');
// Print.info('info');
// Print.warn('warn');
// Print.error('error');

const source = new Source(() => {
  Print.info('游戏资源加载完毕');

  document.body.onclick = function () {
    console.log(1);

    source.SOUNDS.play('start');
  };
});
