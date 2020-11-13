import FontFaceObserver from './vendor/fontfaceobserver';

if (!sessionStorage.fontLoaded) {
  const fontInter = new FontFaceObserver('Inter');

  fontInter.load().then(() => {
    document.documentElement.classList.add('font-loaded');

    sessionStorage.fontLoaded = true;
  });
}
