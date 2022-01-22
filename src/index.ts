import Loader from './loader/';
import Printer from './util/print';
import '/src/assets/less/index.less';
// import LoadImage from './loader/images';

Printer.copyright();

Loader().then(() => {
  Printer.info('资源加载完毕');
  import('./win/win-start').then(win => {
    new win.default();
  });
});

// LoadImage().then(console.log.bind(undefined));
