export default undefined;
const time = document.querySelector('meta[name="__BUILD_TIME"]') as HTMLMetaElement | null;
const version = document.querySelector('meta[name="__BUILD_VERSION"]') as HTMLMetaElement | null;
const copyright = (document.querySelector('#copy-right') as HTMLDivElement) || null;

if (time) {
  time.content = import.meta.env.BUILD_TIME || window.BUILD_TIME || '';
}
if (version) {
  version.content = import.meta.env.BUILD_VERSION || window.BUILD_VERSION || '';
}

if (copyright) {
  copyright.title = import.meta.env.BUILD_VERSION || window.BUILD_VERSION || '';
}
