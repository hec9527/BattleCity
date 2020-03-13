import Print from '@/util/print';
import Source from './loader/index';
import './assets/scss/index';

import Win from '@/win/win';

Source.getSource(source => {
  Print.info('游戏资源加载完毕');
  new Win(source);
});
