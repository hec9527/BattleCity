/**
 * 资源加载器测试
 * @author
 * @time 2020-12-5 16:03:25
 */

// import imgUrl from '@src/assets/img/text.png';
// import mp3Url from '@src/assets/audio/attack.mp3';

import Source from '@src/loader/index';
// import Images from '@src/loader/images';
// import Sounds from '@src/loader/sounds';

describe('Game resource load test', () => {
  test('source should be defined', () => {
    expect(Source).toBeDefined();
  });

  // test('Source.isLoaded should return true affter load', () => {
  //   return new Promise((res, rej) => {
  //     const source = new Source(() => {
  //       expect(source.isLoaded).toBeTruthy();
  //       res();
  //     });
  //     expect(source.isLoaded).toBeFalsy();
  //   });
  // });
});
