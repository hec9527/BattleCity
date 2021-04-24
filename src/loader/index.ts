/* eslint-disable no-async-promise-executor */
/**
 * 资源加载类
 * 先在页面中加载资源防止后面使用的时候出现资源未加载的情况
 */

import { loadImages, CacheImg } from './images';
import { loadAudio, CacheSound } from './sounds';

export type ResourceType = {
  Image: CacheImg;
  Audio: CacheSound;
};

export default function loadSource(): Promise<ResourceType> {
  const resource: ResourceType = {
    Image: {} as CacheImg,
    Audio: {} as CacheSound,
  };
  return new Promise<ResourceType>((resolve, reject) => {
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

  private constructor(public Image: ResourceType['Image'], public Audio: ResourceType['Audio']) {}

  public static getResource(resouce?: ResourceType): Resource {
    if (!Resource.instance && resouce) {
      Resource.instance = new Resource(resouce.Image, resouce.Audio);
    }
    return Resource.instance;
  }
}
