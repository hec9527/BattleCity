export default undefined;

const copyright = (document.querySelector('#copy-right') as HTMLDivElement) || null;

if (copyright) {
  copyright.title = import.meta.env.BUILD_VERSION || window.BUILD_VERSION || '';
}
