import FontFaceObserver from './vendor/fontfaceobserver';

if (!sessionStorage.getItem('font-loaded')) {
  const fontInter = new FontFaceObserver('Inter');

  fontInter
    .load(null, 5000)
    .then(() => {
      document.documentElement.classList.add('font-loaded');

      sessionStorage.setItem('font-loaded', true);
    })
    .catch(() => {
      sessionStorage.setItem('font-loaded', false);
    });
}
