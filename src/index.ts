import Print from './util/print';
import Source from './loader/index';
import './assets/scss/';

// TODO Copyright 无法打印
// Print.copyright();
// Print.debug('debug');
// Print.info('info');
// Print.warn('warn');
// Print.error('error');

new Source(() => {
  console.log('资源加载完毕');
});
