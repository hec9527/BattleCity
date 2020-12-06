import Print from './util/print';
import Source from './loader/index';
import './assets/scss/index';
import game from './game';

// Print.copyright();
// Print.debug('debug');
// Print.info('info');
// Print.warn('warn');
// Print.error('error');

const source = Source.getSource(() => {
  Print.info('游戏资源加载完毕');
  console.log(source.isLoaded());

  console.log(source.IMAGES.Cache.myTank);

  document.body.innerHTML = '';
  document.body.append(source.IMAGES.Cache.getScoreDouble);
});
