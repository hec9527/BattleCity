/* eslint-disable no-async-promise-executor */
/**
 * 资源加载类
 * 先在页面中加载资源防止后面使用的时候出现资源未加载的情况
 */

import { loadImages, CacheImg } from './images';
import { loadAudio, Sound } from './audio';

export type CacheResource = {
  Image: CacheImg;
  Audio: Sound;
};

export default function loadSource(): Promise<CacheResource> {
  const resource: CacheResource = {
    Image: {} as CacheImg,
    Audio: {} as Sound,
  };
  return new Promise<CacheResource>((resolve, reject) => {
    Promise.all([loadAudio(), loadImages()]).then(([audio, image]) => {
      resource.Image = image;
      resource.Audio = audio;
      Resource.getResource(resource);
      resolve(resource);
    }, reject);
  });
}

export class Resource {
  private static instance: Resource;

  private constructor(public Image: CacheResource['Image'], public Audio: CacheResource['Audio']) {}

  public static getResource(resouce?: CacheResource): Resource {
    if (!Resource.instance && resouce) {
      Resource.instance = new Resource(resouce.Image, resouce.Audio);
    }
    return Resource.instance;
  }
}
