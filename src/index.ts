import Loader from '@/loader';
import Log from './util/print';
import './assets/css/index.css';

Loader().then(() => {
  Log.info('资源加载完毕');
  import('./win/win-start').then(win => {
    new win.default();
  });
});
