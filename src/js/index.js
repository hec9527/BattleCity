/**
 * @author     hec9527
 * @time       2020-07-27
 * @change     2020-07-27
 * @description
 *      Battle City
 *      TDD
 */

export class Tool {
  static getPwd() {
    const index = window.location.href.lastIndexOf('/');
    return window.location.href.slice(0, index + 1);
  }
}

export class Print {
  debug(msg) {
    console.debug(`%cdebug: ${msg}`, 'color:#58C9B9');
  }

  info(msg) {
    console.info(`%cinfo: ${msg}`, 'color:#30A9DE');
  }

  warn(msg) {
    console.warn(`%cwarn: ${msg}`, 'color:#f9c00c');
  }

  error(msg) {
    console.error(`%cerror: ${msg}`, 'color:#E53A40');
  }

  copyright() {
    console.clear();
    console.log('%c ', `background: url(${Tool.getPwd()}img/UI.png);padding:0px 184px; line-height:136px;margin: 15px calc(50% - 184px);`);
    console.log(
      `%c@author: hec9527\n@time:   2020-1-5\n@description: \n\n\thi，你好。你能看到这条消息，多半也是程序员。无论是不是，请在程序中保留第一作者，虽然微不足道，但这是对原作者的一种鼓励也是继续创作的动力所在。\n\t如果你在使用过程中发现有任何bug，或者优化建议，可以直接发送到我的邮箱:\thec9527@foxmail.com\n\n`,
      'color:red'
    );
  }
}
