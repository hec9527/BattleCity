/* eslint-disable @typescript-eslint/no-explicit-any */

const str = `
____          _    _    _         ____  _  _          
| __ )   __ _ | |_ | |_ | |  ___  / ___|(_)| |_  _   _ 
|  _ \\  / _\` || __|| __|| | / _ \\| |    | || __|| | | |
| |_) || (_| || |_ | |_ | ||  __/| |___ | || |_ | |_| |
|____/  \\__,_| \\__| \\__||_| \\___| \\____||_| \\__| \\__, |
                                                 |___/ `;

/**
 * 日志打印类
 */
export const Log = {
  debug(msg: string, ...otherParams: any[]): void {
    console.debug(`%c debug: ${msg}`, 'color:#58C9B9', ...otherParams);
  },

  info(msg: string, ...otherParams: any[]): void {
    console.info(`%c info: ${msg}`, 'color:#30A9DE', ...otherParams);
  },

  warn(msg: string, ...otherParams: any[]): void {
    console.warn(`%c warn: ${msg}`, 'color:#f9c00c', ...otherParams);
  },

  error(msg: string, ...otherParams: any[]): void {
    console.error(`%c error: ${msg}`, 'color:#E53A40', ...otherParams);
  },

  copyright(): void {
    console.log(
      `%c ${str} \n\n%c Copyright © 2021 \n%c Powered By Hec9527`,
      'color: #abf; padding 24px 36px;',
      'color: #f78; padding-left: 250px',
      'color: #78f; ',
    );
  },
};

export default Log;
