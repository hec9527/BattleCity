/**
 * 日志打印类
 */

export const Log = {
  debug(msg: string): void {
    console.debug(`%cdebug: ${msg}`, 'color:#58C9B9');
  },

  info(msg: string): void {
    console.info(`%cinfo: ${msg}`, 'color:#30A9DE');
  },

  warn(msg: string): void {
    console.warn(`%cwarn: ${msg}`, 'color:#f9c00c');
  },

  error(msg: string): void {
    console.error(`%cerror: ${msg}`, 'color:#E53A40');
  },

  copyright(): void {
    console.clear();
    console.log(
      '%c ',
      'background: url("/static/img/UI.png");padding:0px 184px; line-height:136px; margin: 15px calc(50% - 184px);'
    );
    console.log('%c@author: hec9527\n@time:   2020-1-24\n@note: \n\n\thi，你好', 'color:red; font-size:16px;');
    console.log(
      '%c这是一个彩蛋，但是我还没想好写啥',
      'color:#30A9DE;font-size:32px;padding:35px calc(50% - 256px);background:#30A9DE33;'
    );
    console.log(
      '%c广告位招租',
      'color:#abf;font-size:26px; padding:35px calc(50% - 65px); text-align:center;background: #abf3;'
    );
  },
};

export default Log;
