import { loadImages, CacheImg } from './images';
import { loadAudio, Sound } from './audio';

export type CacheResource = {
  Image: CacheImg;
  Audio: Sound;
};

let isLoad = false;

export default function loadSource(): Promise<CacheResource> {
  const resource: CacheResource = {
    Image: {} as CacheImg,
    Audio: {} as Sound,
  };
  if (isLoad) return Promise.resolve(resource);

  return new Promise<CacheResource>((resolve, reject) => {
    Promise.all([loadAudio(), loadImages()]).then(([audio, image]) => {
      isLoad = true;
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

  public static getResource(resource?: CacheResource): Resource {
    if (!Resource.instance && resource) {
      Resource.instance = new Resource(resource.Image, resource.Audio);
    }
    return Resource.instance;
  }
}
