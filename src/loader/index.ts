import { loadImages, ICacheImg } from './images';
import { loadAudio, IAudioManager } from './audio';

export type CacheResource = {
  Image: ICacheImg;
  Audio: IAudioManager;
};

let isLoad = false;

const resource: CacheResource = {
  Image: {} as ICacheImg,
  Audio: {} as IAudioManager,
};

export default function loadSource(): Promise<CacheResource> {
  if (isLoad) return Promise.resolve(resource);

  return new Promise<CacheResource>((resolve, reject) => {
    Promise.all([loadAudio(), loadImages()]).then(([audio, image]) => {
      isLoad = true;
      resource.Image = image;
      resource.Audio = audio;
      resolve(resource);
    }, reject);
  });
}

// window.r = resource;

export { resource as R, isLoad };
