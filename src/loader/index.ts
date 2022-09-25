import { loadImages, CacheImg } from './images';
import { loadAudio, Sound } from './audio';

export type CacheResource = {
  Image: CacheImg;
  Audio: Sound;
};

let isLoad = false;

const resource: CacheResource = {
  Image: {} as CacheImg,
  Audio: {} as Sound,
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

export { resource as R, isLoad };
