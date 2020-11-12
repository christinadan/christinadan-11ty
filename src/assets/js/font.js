import FontFaceObserver from './vendor/fontfaceobserver';

const fontInter = new FontFaceObserver('Inter');

fontInter.load(null, 5000).then(() => {
  document.documentElement.classList.add('font-loaded');

  sessionStorage.setItem('font-loaded', true);
});
